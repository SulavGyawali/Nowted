from typing import List
from fastapi import Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from .. import models, schemas, oauth2
from ..database import get_db
from .notes_buffer import redis_client
import json

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Note)
async def create_notes(
    note: schemas.NoteCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    new_note = models.Notes(**note.model_dump())
    new_note.user_id = current_user.id
    new_note.author = current_user.username
    new_note.title = note.title
    new_note.description = note.description
    new_note.folder = note.folder
    new_note.favourite = note.favourite if note.favourite is not None else False
    new_note.archive = note.archive if note.archive is not None else False
    new_note.trash = note.trash if note.trash is not None else False
    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    note_user_entry = models.NoteUsers(note_id=new_note.id, user_id=current_user.id)
    db.add(note_user_entry)
    db.commit()
    return new_note


@router.get("/", response_model=List[schemas.Note])
async def read_notes(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):

    notes = (
        db.query(models.Notes)
        .join(models.NoteUsers, models.Notes.id == models.NoteUsers.note_id)
        .filter(models.NoteUsers.user_id == current_user.id)
        .all()
    )
    if notes is []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No notes found"
        )
    return notes


@router.get("/{note_id}", response_model=schemas.Note)
async def read_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    redis_key = f"note:{note_id}:user:{current_user.id}"

    note_json = redis_client.get(redis_key)
    if note_json:

        print(note_json)
        note_data = schemas.Note.model_validate_json(note_json)
        print(note_data)
        return schemas.Note(
            id=note_id,
            title=note_data.title,
            description=note_data.description,
            favourite=note_data.favourite,
            archive=note_data.archive,
            trash=note_data.trash,
            folder=note_data.folder,
            created_at=note_data.created_at,
            updated_at=note_data.updated_at,
            user_id=current_user.id,
        )
    note = (
        db.query(models.Notes)
        .join(models.NoteUsers, models.Notes.id == models.NoteUsers.note_id)
        .filter(models.Notes.id == note_id, models.NoteUsers.user_id == current_user.id)
        .first()
    )
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    return note


@router.get("/folder/favourite", response_model=List[schemas.Note])
async def read_favourite_notes(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    notes = (
        db.query(models.Notes)
        .join(models.NoteUsers, models.Notes.id == models.NoteUsers.note_id)
        .filter(
            models.NoteUsers.user_id == current_user.id, models.Notes.favourite == True
        )
        .all()
    )
    if notes is []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No favourite notes found"
        )
    return notes


@router.get("/folder/archive", response_model=List[schemas.Note])
async def read_archived_notes(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    notes = (
        db.query(models.Notes)
        .join(models.NoteUsers, models.Notes.id == models.NoteUsers.note_id)
        .filter(
            models.NoteUsers.user_id == current_user.id, models.Notes.archive == True
        )
        .all()
    )
    if notes is []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No archived notes found"
        )
    return notes


@router.get("/folder/trash", response_model=List[schemas.Note])
async def read_trash_notes(
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    notes = (
        db.query(models.Notes)
        .join(models.NoteUsers, models.Notes.id == models.NoteUsers.note_id)
        .filter(models.NoteUsers.user_id == current_user.id, models.Notes.trash == True)
        .all()
    )
    if notes is []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No trashed notes found"
        )
    return notes


@router.get("/folder/{folder_name}", response_model=List[schemas.Note])
async def read_notes_by_folder(
    folder_name: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    notes = (
        db.query(models.Notes)
        .join(models.NoteUsers, models.Notes.id == models.NoteUsers.note_id)
        .filter(
            models.NoteUsers.user_id == current_user.id,
            models.Notes.folder == folder_name,
        )
        .all()
    )
    if notes is []:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No notes found in this folder",
        )
    return notes


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    note = db.query(models.Notes).filter(models.Notes.id == note_id).first()
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )
    note_user = (
        db.query(models.NoteUsers)
        .filter(
            models.NoteUsers.note_id == note_id,
            models.NoteUsers.user_id == current_user.id,
        )
        .first()
    )
    if current_user.id != note_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this note",
        )
    db.delete(note)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{note_id}", response_model=schemas.Note)
async def update_notes(
    note_id: int,
    new_note: schemas.NoteCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    note_query = db.query(models.Notes).filter(models.Notes.id == note_id)
    note_user = (
        db.query(models.NoteUsers)
        .filter(
            models.NoteUsers.note_id == note_id,
            models.NoteUsers.user_id == current_user.id,
        )
        .first()
    )
    if note_query.first() is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
        )

    if current_user.id != note_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this note",
        )
    note_query.update(new_note.model_dump())

    db.commit()
    return note_query.first()


@router.post(
    "/share", status_code=status.HTTP_201_CREATED, response_model=schemas.NoteShare
)
async def share_note(
    share_data: schemas.NoteShare,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(oauth2.get_current_user),
):
    print(share_data)
    note = db.query(models.Notes).filter(models.Notes.id == share_data.note_id).first()
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Note not found"
        )
    note_user = (
        db.query(models.NoteUsers)
        .filter(
            models.NoteUsers.note_id == share_data.note_id,
            models.NoteUsers.user_id == current_user.id,
        )
        .first()
    )
    if current_user.id != note_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to share this note",
        )
    shared_entry = models.NoteUsers(
        note_id=share_data.note_id, user_id=share_data.user_id
    )
    db.add(shared_entry)
    db.commit()
    print("Shared successfully")
    return share_data

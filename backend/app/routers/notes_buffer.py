import json
from time import time, sleep
import datetime
from ..database import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import schemas, oauth2, models
import redis
import requests

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)


router = APIRouter(prefix="/notes", tags=["Notes Buffer"])

def update_note_in_db(db: Session, note_id: int, note_data: dict, user_id: int):

    note_query = db.query(models.Notes).filter(models.Notes.id == note_id)
    
    note_user = (
        db.query(models.NoteUsers)
        .filter(models.NoteUsers.note_id == note_id, models.NoteUsers.user_id == user_id)
        .first()
    )
    
    if note_query.first() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    
    if note_user is None:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    note_query.update({
        "title": note_data.get("title"),
        "description": note_data.get("description"),
        "folder": note_data.get("folder", "Personal"),
        "favourite": note_data.get("favourite", False),
        "archive": note_data.get("archive", False),
        "trash": note_data.get("trash", False),
        "updated_at": note_data.get("updated_at"),  # you can also set datetime.utcnow()
    })
    
    db.commit()
    return note_query.first()

def flush_redis_to_db(interval=5):
    while True:
        try:
            keys = redis_client.smembers("pending_note_updates")
            for key in keys:
                note_json = redis_client.get(key)
                if not note_json:
                    redis_client.srem("pending_note_updates", key)
                    continue

                note_data = json.loads(note_json)

                if "updated_at" not in note_data:
                    note_data["updated_at"] = datetime.utcnow().isoformat()

                db = next(get_db())
                try:
                    update_note_in_db(db, note_data["id"], note_data, note_data["user_id"])
                except Exception as e:
                    print(f"Failed to update note {note_data['id']}: {e}")
                    continue

                redis_client.delete(key)
                redis_client.srem("pending_note_updates", key)

        except Exception as e:
            print("Redis flush error:", e)

        sleep(interval)

@router.put("/{note_id}/buffer", response_model=schemas.Note)
async def buffer_note_update(
    note_id: int,
    new_note: schemas.NoteCreate,
    current_user: schemas.User = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db),
):
    db_note = (
        db.query(models.Notes)
        .join(models.NoteUsers)
        .filter(models.Notes.id == note_id, models.NoteUsers.user_id == current_user.id)
        .first()
    )
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    note_to_buffer = {
        "id": db_note.id,
        "title": new_note.title,
        "description": new_note.description,
        "favourite": new_note.favourite,
        "archive": new_note.archive,
        "trash": new_note.trash,
        "folder": new_note.folder,
        "created_at": str(db_note.created_at),  # store as ISO string
        "updated_at": str(datetime.datetime.utcnow()),  # current time as ISO string
        "user_id": db_note.user_id,
    }


    key = f"note:{note_id}:user:{current_user.id}"

    redis_client.set(key, json.dumps(note_to_buffer))
    redis_client.set(f"{key}:timestamp", str(time()))

    redis_client.sadd("pending_note_updates", key)

    return note_to_buffer


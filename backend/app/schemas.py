from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: str
    email: EmailStr
    password: str

class NoteBase(BaseModel):
    title: str
    description: str

class NoteCreate(NoteBase):
    folder : str 
    favourite : bool = False
    trash : bool = False
    archive : bool = False
    pass

class Note(NoteBase):
    id: int
    folder: str = "default"
    favourite: bool = False
    trash: bool = False
    archive: bool = False
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        from_attributes = True

class NoteUpdate(BaseModel):
    title: str
    description: str
    user_id: int
    pass

class NoteDelete(BaseModel):
    id: int
    user_id: int
    pass

class Login(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

class TokenVerify(BaseModel):
    valid: bool
    reason: str | None = None

class NoteShare(BaseModel):
    note_id: int
    user_id: int
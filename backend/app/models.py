from .database import Base
from sqlalchemy import Column, Integer, String, TIMESTAMP, ForeignKey, Boolean
from sqlalchemy.sql import text
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, nullable=False)
    email = Column(String, index=True, nullable=False, unique=True)
    password = Column(String, nullable=False)
    notes = relationship("Notes", back_populates="user")

class Notes(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    author = Column(String, index=True, nullable=False)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)
    updated_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), onupdate=text('now()'), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    favourite = Column(Boolean, default=False)
    folder = Column(String, nullable=True)
    archive = Column(Boolean, default=False)
    trash = Column(Boolean, default=False)
    user = relationship("User", back_populates="notes")

class NoteUsers(Base):
    __tablename__ = "note_users"
    
    note_id = Column(Integer, ForeignKey("notes.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
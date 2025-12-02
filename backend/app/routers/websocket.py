import asyncio
from .. import models
from ..database import get_db
from fastapi import WebSocket, APIRouter, Depends
from sqlalchemy.orm import Session
from collections import defaultdict
import redis.asyncio as aioredis
import json
import os

router = APIRouter(prefix="/websocket", tags=["websocket"])
redis_host = os.getenv("REDIS_HOST") or "localhost"
redis_port = int(os.getenv("REDIS_PORT") or 6379)

redis = aioredis.Redis(host=redis_host, port=redis_port, decode_responses=True)
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = defaultdict(list)

    async def connect(self, note_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[note_id].append(websocket)

    def disconnect(self, note_id: int, websocket: WebSocket):
        self.active_connections[note_id].remove(websocket)

    async def broadcast(self, note_id: int, message: dict):
        for connection in self.active_connections[note_id]:
            await connection.send_json(message)


manager = ConnectionManager()



@router.websocket("/ws/{note_id}")
async def websocket_endpoint(
    websocket: WebSocket, note_id: int, db: Session = Depends(get_db)
):
    user_count = (
        db.query(models.NoteUsers).filter(models.NoteUsers.note_id == note_id).count()
    )
    if user_count < 2:
        await websocket.close(code=1008)
        return

    await manager.connect(note_id, websocket)

    pubsub = redis.pubsub()
    await pubsub.subscribe(f"note_updates:{note_id}")

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                data = json.loads(message["data"])
                await manager.broadcast(note_id, data)

    except Exception as e:
        print(f"WebSocket connection closed: {e}")
    finally:
        manager.disconnect(note_id, websocket)
        await pubsub.unsubscribe(f"note_updates:{note_id}")

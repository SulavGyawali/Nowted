import asyncio
import datetime
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
        print(f"[note ws] note {note_id} has only {user_count} user(s), closing")
        await websocket.close(code=1008)
        return

    await manager.connect(note_id, websocket)
    print(f"[note ws] connected: note {note_id}")

    pubsub = redis.pubsub()
    await pubsub.subscribe(f"note_updates:{note_id}")

    try:
        async for message in pubsub.listen():
            if message["type"] == "message":
                data = json.loads(message["data"])
                ts = datetime.datetime.utcnow().isoformat()
                changed_by = data.get("user_id", "unknown")
                print(
                    f"[note change] note={note_id} user={changed_by} "
                    f"title={data.get('title')!r} at={ts}"
                )
                await manager.broadcast(note_id, data)
    except Exception as e:
        print(f"[note ws] closed: {e}")
    finally:
        manager.disconnect(note_id, websocket)
        await pubsub.unsubscribe(f"note_updates:{note_id}")
        print(f"[note ws] disconnected: note {note_id}")


@router.websocket("/ws/typing/{note_id}/{user_id}")
async def typing_indicator(
    websocket: WebSocket, note_id: int, user_id: int, db: Session = Depends(get_db)
):
    await websocket.accept()
    print(f"[typing ws] connected: note {note_id}, user {user_id}")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    username = user.username if user else f"User {user_id}"

    channel = f"typing_indicator:{note_id}"
    pubsub = redis.pubsub()
    await pubsub.subscribe(channel)

    async def reader():
        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = json.loads(message["data"])
                    if data.get("user_id") != user_id:
                        await websocket.send_json(data)
        except Exception as e:
            print(f"[typing ws] reader error: {e}")

    reader_task = asyncio.create_task(reader())

    try:
        while True:
            data = await websocket.receive_json()
            data["user_id"] = user_id
            data["username"] = username
            await redis.publish(channel, json.dumps(data))
    except Exception as e:
        print(f"[typing ws] closed: {e}")
    finally:
        reader_task.cancel()
        await pubsub.unsubscribe(channel)
        print(f"[typing ws] disconnected: note {note_id}, user {user_id}")
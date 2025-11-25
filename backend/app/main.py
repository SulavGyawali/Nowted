from fastapi import FastAPI
from .routers import users, auth, notes
from dotenv import load_dotenv
import os
import psycopg2 as pg
from psycopg2.extras import RealDictCursor
import time
from .database import engine
from . import models
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

load_dotenv()

POSTGRES_HOST = os.getenv("POSTGRES_HOST") or "localhost"
POSTGRES_PORT = os.getenv("POSTGRES_PORT")
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_PORT= os.getenv("POSTGRES_PORT")
# print(POSTGRES_USER)

app = FastAPI()

origins = [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

while True:
    try:
        conn = pg.connect(
            dbname=POSTGRES_DB,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            host=POSTGRES_HOST,
            port=POSTGRES_PORT,
            cursor_factory=RealDictCursor,
        )
        cur = conn.cursor()
        print("Connected to the database")
        cur.execute(
            "CREATE TABLE IF NOT EXISTS notes (id serial PRIMARY KEY, author VARCHAR(50), title VARCHAR(50), description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INTEGER REFERENCES users(id), favourite BOOLEAN DEFAULT FALSE, folder TEXT, archive BOOLEAN DEFAULT FALSE, trash BOOLEAN DEFAULT FALSE) "
        )
        cur.execute(
            "CREATE TABLE IF NOT EXISTS users (id serial PRIMARY KEY, username VARCHAR(50), email VARCHAR(50), password VARCHAR(100))"
        )
        conn.commit()
        break
    except Exception as e:
        print(e)
        print("Failed to connect to the database")
        exit()
        time.sleep(5)


# Root endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to Notes API"}


app.include_router(users.router)
app.include_router(auth.router)
app.include_router(notes.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="notes-api", port=8000)

# Run with: uvicorn app.main:app --reload

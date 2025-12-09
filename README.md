# Nowted

*A modern, real‑time, collaborative notes platform built with a scalable, production‑ready architecture.*

---

## 🚀 Overview
Nowted is a **full‑stack, real‑time notes application** designed with modern engineering principles and production‑grade technologies. It supports:
- **Live collaboration** via WebSockets
- **Secure multi‑user sharing** with fine‑grained access control
- **Autosaving with Redis caching** for high responsiveness
- **JWT authentication (access + refresh tokens)**
- **Scalable Dockerized architecture** with decoupled services
- **Clean database modeling** using SQLAlchemy ORM
- **FastAPI backend + React/Tailwind frontend + PostgreSQL database**

If you're looking for a project showcasing advanced full‑stack engineering, distributed systems concepts, and real‑time web capabilities, this is it.

---

## Screen Shot

![Alt Text](/home.png)
![Alt Text](/login.png)
![Alt Text](/register.png)


## Demo Videos
- [Demo Video](https://youtu.be/-Lb4WKp-o2I)
- [Demo Video2](https://youtu.be/87bEpnDUHAM)

## 🧩 Features
### 🔴 Real‑Time Collaboration
- Multi-user simultaneous editing of the same note
- WebSocket powered live updates
- Conflict‑free autosaving

### ⚡ Autosaving + Redis Caching
- Lightning‑fast note syncing
- Reduced database load
- Zero-lag editing experience

### 👥 Multi‑User Sharing
- Share notes with other users
- Join table **NoteUsers** ensures proper relational design
- Fine‑grained access control per note

### 🔐 Authentication & Security
- JWT **access + refresh tokens**
- Token verification middleware
- OAuth2Flow
- **Password hashing** for secure credential storage
- Route protection for all private operations

### 🛠 Backend (FastAPI)
- Modular service-based architecture
- SQLAlchemy ORM models for Notes, Users, and relationships
- Pydantic schemas for validation and serialization
- Organized routers and dependency injection

### 🗄 Database (PostgreSQL)
- Scalable relational schema
- Proper normalization & many‑to‑many join tables
- Indexing-ready for search and expansion

### 🖥 Frontend (React + TailwindCSS)
- Clean, modern UI
- Real‑time WebSocket integration
- Responsive and fast

### 🐳 Dockerized Deployment
- All services containerized
- `docker-compose` for orchestration
- Reproducible and production-ready environment

---

## 🏗 Architecture

```
            ┌──────────────────┐        ┌──────────────────┐
            │     Frontend     │        │     WebSocket    │
            │ React + Tailwind │◀─────▶│   FastAPI WS     │
            └─────────▲────────┘        └─────────▲────────┘
                      │                           │
                      ▼                           ▼
              ┌──────────────────┐       ┌──────────────────┐
              │   REST API       │◀────▶│     Redis Cache  │
              │     FastAPI      │       └──────────────────┘
              └─────────▲────────┘
                        │
                        ▼
                ┌──────────────────┐
                │   PostgreSQL     │
                │   Database       │
                └──────────────────┘
```

## 🏗 Backend Architecture

```
                         ┌──────────────────────────────────────────────┐
                         │                  Nowted System               │
                         │ (Real-time Collaboration via WebSockets)     │
                         └──────────────────────────────────────────────┘

┌──────────┐                    ┌──────────────────────────────────────┐
│ Browser  │   Websocket conn   │   Horizontally Scaled WS Servers     │
│ (User 1) ├────────────────────►  (real-time collaboration)           │
└──────────┘                    │                                      │
                                │   ┌───────────┐      ┌───────────┐   │
┌──────────┐                    │   │   ws1     │      │   ws2     │   │
│ Browser  │   Websocket conn   │   │ (WS node) │      │ (WS node) │   │
│ (User 2) ├────────────────────►   └─────┬─────┘      └─────┬─────┘   │
└──────────┘                    │         │                  │         │
                                │         │ Redis Pub/Sub    │         │
                                │         ▼                  ▼         │
                                │   ┌────────────────────────────────┐ │
                                │   │     Redis Pub/Sub Channel      │ │
                                │   │ (broadcast updates to all WS)  │ │
                                │   └────────────────────────────────┘ │
                                └──────────────────────────────────────┘


            ┌───────────────────────────┐
            │       Primary Backend     │ Get Notes
  ──────────│         (FastAPI)         │─────────────────────
  |         │       Auth, API, CRUD     │                     │
  |         └───────────┬───────────────┘                     │
  |                     │                                     │
  | Get Notes           │ Update Note                         │
  |                     ▼                                     │
  |         ┌───────────────────────────┐                     │
  |         │       Redis Cache         │                     │
  |         │   - Stores in-memory note │                     │
  ────────► │     states & changes      │                     │
            │   - Buffers edits         │                     │
            │   - Autosave staging      │                     │
            └───────────┬───────────────┘                     │
                        │                                     │ If Notes not 
                        │ Batched flush every 5 seconds       | in Redis
                        ▼                                     │
            ┌───────────────────────────┐                     │
            │       Flusher Worker      │                     │
            │ - Pulls changes from      │                     │
            │   Redis cache             │                     │
            │ - Batches writes to DB    │                     │
            │ - Prevents DB overload    │                     │
            └───────────┬───────────────┘                     │
                        │                                     │
                        ▼                                     │
            ┌───────────────────────────┐                     │
            │         PostgreSQL        │                     │
            │  Notes, Users, Sharing    │◀────────────────────
            │  Many-to-many NoteUsers   │
            └───────────────────────────┘

```

---

## 🚀 Getting Started
### 📦 Prerequisites
- Docker & Docker Compose installed

### ▶ Run the full stack
```bash
docker-compose up --build
```
- Frontend will be available at **http://localhost:5173**
- Backend API at **http://localhost:8000**

---

## 🧪 API Documentation
FastAPI provides built‑in docs:
- Swagger UI → http://localhost:8000/docs
- ReDoc → http://localhost:8000/redoc

---

## 🛡 Security
- Passwords hashed using industry‑standard algorithms
- JWT access tokens for authorization
- Refresh tokens for session persistence
- HTTPS‑ready deployment

---

## 📈 Future Improvements
- CRDT-based conflict resolution
- Offline notes support
- Real-time presence indicators
- Full-text search
- CI/CD pipeline
- Testing suite (pytest)

---

## ⭐ Contributing
Contributions, issues and feature requests are welcome! Feel free to check the issues page.

---

## 🎯 Final Notes
Nowted is more than a notes app — it's a production‑style real‑time collaboration system built with clean architecture, strong security, and scalable foundations.

If you're using this as a portfolio project, it effectively demonstrates:
- full-stack engineering
- distributed systems
- authentication & security
- real-time communication
- database modeling

You're welcome to fork, extend, or deploy it however you like!

# 📝 Nowted

Nowted is a production-grade collaborative notes application built with React + Tailwind CSS on the frontend, FastAPI on the backend, and PostgreSQL as the primary database.
It features autosaving, real-time collaboration, and Redis-powered caching and Pub/Sub messaging for low-latency updates across users. Notes can be shared between users using a robust permission system backed by a many-to-many join table.

Designed with scalability and seamless user experience in mind, Nowted combines modern UI, efficient backend architecture, and distributed systems techniques to deliver fast, reliable, and collaborative note-taking.

## Screen Shot

![Alt Text](/home.png)
![Alt Text](/login.png)
![Alt Text](/register.png)


## 📚 Table of Contents
- [Demo Video](https://youtu.be/-Lb4WKp-o2I)
- [Demo Video2](https://youtu.be/87bEpnDUHAM)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- User-friendly interface for creating, editing, and organizing notes
- Responsive and modern UI built with React and Tailwind CSS
- Autosaving to ensure no progress is ever lost
- Real-time collaboration powered by WebSockets and Redis Pub/Sub
- Redis caching layer for faster responses and reduced database load
- Secure note sharing between users via a many-to-many join table
- RESTful API built with FastAPI
- Reliable data persistence using PostgreSQL
- Containerized with Docker for easy setup and deployment
- Scalable architecture decoupling app servers with Redis for horizontal scaling

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **Caching & Pub/Sub:** Redis
- **Real-Time Collaboration:** WebSockets
- **Containerization:** Docker

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SulavGyawali/Notes.git
   cd Notes
   ```

2. **Build and run the containers:**

   ```bash
   docker-compose -f docker-compose.yml up --build
   ```

   This command will set up the frontend, backend, and PostgreSQL database.

3. **Access the application:**

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000)
   - PostgreSQL : [http://localhost:5432](http://localhost:5432)

## 📖 Usage

- Navigate to the frontend URL to interact with the Notes application.
- Use the interface to create, edit, and delete notes.
- The backend API provides endpoints for CRUD operations on notes.

## 🗂️ Project Structure

```
Notes/
├── backend/
|    ├──app/               # FastAPI backend
│    |  ├── main.py            # Entry point for the API
│    |  └── ...                # Additional backend modules
|    ├── requirements.txt
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   └── ...            # Additional frontend components
├── docker-compose.dev.yml # Docker Compose configuration
├── Dockerfile             # Dockerfile for containerization
└── README.md              # Project documentation
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

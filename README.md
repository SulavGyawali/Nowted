# 📝 Nowted

A full-stack Notes application built with **React** and **Tailwind CSS** for the frontend, **FastAPI** for the backend, and **PostgreSQL** as the database.

## Screen Shot

![Alt Text](/home.png)
![Alt Text](/login.png)
![Alt Text](/register.png)


## 📚 Table of Contents

- [Demo Video](https://youtu.be/87bEpnDUHAM)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- User-friendly interface for creating, editing, and deleting notes
- Responsive design with Tailwind CSS
- RESTful API built with FastAPI
- Data persistence using PostgreSQL
- Dockerized for easy deployment

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** FastAPI
- **Database:** PostgreSQL
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

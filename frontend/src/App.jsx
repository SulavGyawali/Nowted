import { useState, useEffect, use } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import axios from "axios";
import Signup from "./components/Signup";
import Alert from "./components/Alert";

function App() {
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [tokenType, setTokenType] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState(["Personal"]);
  const [recentNotes, setRecentNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [folderNotes, setFolderNotes] = useState([]);
  const [newNote, setNewNote] = useState(null);
  const [updatedNote, setUpdatedNote] = useState(null);
  const [signup, setSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [logout, setLogout] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [shareUserId, setShareUserId] = useState("");

  const handleCreateUser = async (newUser) => {
    try {
      const data = {
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
      };
      console.log("Creating user:", data);
      console.log("new user:", newUser);
      const response = await axios.post("http://localhost:8000/users", data);
      console.log("User created:", response.data);
      handleAlert("User Created Successfully!", "success");
    } catch (error) {
      handleAlert("Error creating user!", "error");
      console.error("Error creating user:", error);
    }
  };

  const handleAlert = (message, type) => {
    setShowAlert(true);
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }

  const getCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/users/current", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  }

  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
  }
  , [token]);

  useEffect(() => {
    if(logout) {
      setIsLoggedIn(false);
      setToken("");
      setTokenType("");
      setRefreshToken("");
      setNotes([]);
      setFolders(["Personal"]);
      setRecentNotes([]);
      setCurrentNote(null);
      setCurrentNoteId(null);
      setCurrentFolder(null);
      setFolderNotes([]);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
      handleAlert("Logged out successfully!", "success");
    }
  }, [logout]);

  const handleAddNewNote = async (note) => {
    try {
      const data = {
        title: note.title,
        description: note.description,
        folder: note.folder ,
      };
      const response = await axios.post("http://localhost:8000/notes", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setNotes((prevNotes) => [...prevNotes, response.data]);
      setCurrentNote(response.data);
      setCurrentNoteId(response.data.id);
      handleAlert("Note added successfully!", "success");
    } catch (error) {
      handleAlert("Error adding note!", "error");
      console.error("Error adding note:", error);
    }
  }

  useEffect(() => {
    if (newNote) {
      handleAddNewNote(newNote);
      setNewNote(null);
    }
  }
  , [newNote]);

  const handleUpdateNote = async (noteId, updatedNote) => {
    try {
      const data = {
        title: updatedNote.title,
        description: updatedNote.description,
        folder: updatedNote.folder || "Personal",
        favourite: updatedNote.favourite || false,
        archive: updatedNote.archive || false,
        trash: updatedNote.trash || false,
      };
      const response = await axios.put(
        `http://localhost:8000/notes/${noteId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, ...response.data } : note
        )
      );
      setCurrentNote(response.data);
      handleAlert("Note updated successfully!", "success");
    } catch (error) {
      handleAlert("Error updating note!", "error");
      console.error("Error updating note:", error);
    }
  }

  const handleShare = async (noteId, userId) => {
    try {
      const data = {
        note_id: noteId,
        user_id: userId,
      };
      const response = await axios.post("http://localhost:8000/notes/share", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      handleAlert("Note shared successfully!", "success");
    } catch (error) {
      handleAlert("Error sharing note!", "error");
      console.error("Error sharing note:", error);
    }
    console.log("Sharing note:", noteId, "with user:", userId, "response:", response);

  } 

  useEffect(() => {
    if (updatedNote) {
      handleUpdateNote(currentNoteId, updatedNote);
      setUpdatedNote(null);
    }
  }
  , [updatedNote, currentNoteId]);

  const handleFetchFolderNotes = async (folderName) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/notes/folder/${folderName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFolderNotes(response.data);
      setCurrentFolder(folderName);
      
    } catch (error) {
      handleAlert("Error fetching folder notes!", "error");
      console.error("Error fetching folder notes:", error);
    }
  };

  useEffect(() => {
    if (currentFolder) {
      handleFetchFolderNotes(currentFolder);
    }
  }, [currentFolder, token]);

  const handlefetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setNotes(response.data);
    } catch (error) {
      handleAlert("Error fetching notes!", "error");
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    const fetchNote = async (noteId) => {
      try {
        const response = await axios.get(
          `http://localhost:8000/notes/${noteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setCurrentNote(response.data);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };
    if (currentNoteId) {
      fetchNote(currentNoteId);
    }
  }, [currentNoteId]);

  useEffect(() => {
    if (currentNote) {
      if (currentNote.folder) {
        setCurrentFolder(currentNote.folder);
      } else {
        setCurrentFolder(null);
      }
    }
  }, [currentNote]);

  useEffect(() => {
    const updateFolders = () => {
      const uniqueFolders = [...folders];
      notes.forEach((note) => {
        if (note.folder && !uniqueFolders.includes(note.folder)) {
          uniqueFolders.push(note.folder);
        }
      });

      setFolders(uniqueFolders);
    };
    updateFolders();
  }, [notes]);
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);



  useEffect(() => {
    if (!isLoggedIn) {
      if(signup) {
        navigate("/register");
      }
      else
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [isLoggedIn, navigate, signup]);

  useEffect(() => {
    const handleRecentNotes = () => {
      const recentNote = notes.slice(-3);
      recentNote.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );

      setRecentNotes(recentNote);
    };
    handleRecentNotes();
  }, [notes]);

  useEffect(() => {
    const handleRefreshToken = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/auth/refresh-token",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setToken(response.data.access_token);
        setTokenType(response.data.token_type);
        localStorage.setItem("token", response.data.access_token);
      } catch (error) {
        console.error("Error refreshing token:", error);
        setIsLoggedIn(false);
        setToken("");
      }
    };
    const interval = setInterval(() => {
      if (isLoggedIn) {
        handleRefreshToken();
      }
    }, 1000 * 60 * 15);
    return () => clearInterval(interval);
  }, [isLoggedIn, token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const handleVerifyToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/auth/verify-token",
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setToken(storedToken);
          setIsLoggedIn(true);
          setCurrentFolder("Personal");
        }
      } catch (error) {
        const refresh = localStorage.getItem("refresh_token");
        if (refresh) {
          try {
            const response = await axios.get(
              "http://localhost:8000/auth/refresh-token",

              {
                headers: {
                  Authorization: `Bearer ${refresh}`,
                  "Content-Type": "application/json",
                },
              }
            );

            setToken(response.data.access_token);

            setIsLoggedIn(true);
          } catch (error) {
            console.error("Error refreshing token:", error);
            setIsLoggedIn(false);
            setToken("");
          }
        } else {
          setIsLoggedIn(false);
          setToken("");
        }
      }
    };
    handleVerifyToken();
  }, []);

  useEffect(() => {
    if (token) {
      handlefetchNotes();
      localStorage.setItem("token", token);
    }
  }, [token]);

  return (<>
    <Alert 
      showAlert={showAlert}
      setShowAlert={setShowAlert}
      alertMessage={alertMessage}
      alertType={alertType}
    />
    <Routes>
      <Route
        path="/"
        element={
          <Home
            notes={notes}
            folders={folders}
            recentNotes={recentNotes}
            setNotes={setNotes}
            setFolders={setFolders}
            setCurrentFolder={setCurrentFolder}
            currentFolder={currentFolder}
            currentNote={currentNote}
            setCurrentNote={setCurrentNote}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            currentNoteId={currentNoteId}
            setCurrentNoteId={setCurrentNoteId}
            folderNotes={folderNotes}
            setNewNote={setNewNote}
            setUpdatedNote={setUpdatedNote}
            currentUser={currentUser}
            setLogout={setLogout}
            handleAlert={handleAlert}
            shareUserId={shareUserId}
            setShareUserId={setShareUserId}
            handleShare={handleShare}
          />
        }
      />
      <Route
        path="/login"
        element={
          <Login
            setIsLoggedIn={setIsLoggedIn}
            setToken={setToken}
            setTokenType={setTokenType}
            setRefreshToken={setRefreshToken}
            isLoggedIn={isLoggedIn}
            handleAlert={handleAlert}
            setSignup={setSignup}
            setLogout={setLogout}
          />
        }
      />
      <Route
        path="/register"
        element={
          <Signup
            setIsLoggedIn={setIsLoggedIn}
            setToken={setToken}
            setTokenType={setTokenType}
            setRefreshToken={setRefreshToken}
            isLoggedIn={isLoggedIn}
            handleCreateUser={handleCreateUser}
            setSignup={setSignup}
            handleAlert={handleAlert}
          />
        }
      />
    </Routes>
    </>
  );
}

export default App;

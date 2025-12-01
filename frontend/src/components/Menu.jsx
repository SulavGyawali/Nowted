import React from "react";
import { LuPencil } from "react-icons/lu";
import { IoSearch, IoArchiveOutline, IoExitOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FiFileText, FiTrash } from "react-icons/fi";
import { FaRegFolder, FaRegFolderOpen, FaRegHeart } from "react-icons/fa";
import { HiOutlineFolderAdd } from "react-icons/hi";
import { IoIosMore } from "react-icons/io";
import myImage1 from "../assets/image1.png";
import myImage2 from "../assets/image2.png";
import myImage3 from "../assets/image3.png";
import myImage4 from "../assets/image4.png";
import myImage5 from "../assets/image5.png";
import myImage6 from "../assets/image6.png";
import myImage7 from "../assets/image7.png";

const Menu = (props) => {
  const [mouseInDots, setMouseInDots] = React.useState(false);
  const [mouseInSettings, setMouseInSettings] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [editingFolder, setEditingFolder] = React.useState(null);
  const images = [
    myImage1,
    myImage2,
    myImage3,
    myImage4,
    myImage5,
    myImage6,
    myImage7,
  ];
  const handleMouseLeaveDots = () => {
    setMouseInDots(false);
  };
  const handleMouseEnterSettings = () => {
    setMouseInSettings(true);
  };
  const handleMouseLeaveSettings = () => {
    setMouseInSettings(false);
  };
  const handleMouseEnterDots = () => {
    setMouseInDots(true);
  };
  const handleAddNewNote = () => {
    props.setCurrentNoteId(null);
    props.setCurrentNote({
      title: "",
      description: "",
      folder: props.currentFolder || "Personal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    props.currentFolder
      ? props.setCurrentFolder(props.currentFolder)
      : props.setCurrentFolder("Personal");
  };

  React.useEffect(() => {
    if (mouseInDots || mouseInSettings) {
      setShowSettings(true);
    } else {
      setShowSettings(false);
    }
  }, [mouseInDots, mouseInSettings]);

  const handleAddFolder = () => {
    props.setFolders([...props.folders, "new folder"]);
    props.handleAlert("Folder created successfully!", "success");
    props.setCurrentFolder(newFolder);
  };
  const handleNameChange = (index, newName) => {
    const updated = [...props.folders];
    updated[index] = newName;
    props.setFolders(updated);
  };

  return (
    <div className="w-[20%] h-[100vh] flex flex-col  pt-7 font-medium">
      <div className="box1 w-full  font px-3 flex justify-between items-center">
        <div className="group flex">
          <div className="txt text-2xl custom-kaushan">Nowted</div>
          <div className="frame flex items-start">
            <LuPencil className="text-lg ml-2" />
          </div>
        </div>
        <div className="search">
          <IoSearch className="text-2xl opacity-50" />
        </div>
      </div>
      <div className="box2  w-full flex justify-center items-center h-[5%] mt-5 ">
        <div
          className="newnote flex h-full w-[80%] bg-neutral-800 justify-center items-center gap-1 font-medium cursor-pointer hover:bg-neutral-700 transition-all duration-300"
          onClick={handleAddNewNote}
        >
          <IoMdAdd className="text-xl " />
          <span>New Note</span>
        </div>
      </div>
      <div className="box3  w-full h-[20%] mt-5 flex flex-col ">
        <div className="recent w-[20%] opacity-50 text-sm pl-3">Recents</div>
        <div className="rec-notes flex flex-col my-2">
          {props.recentNotes.map((recent) => (
            <div
              className={`note flex pl-3 cursor-pointer hover:bg-[#312EB5] h-[5vh] items-center overflow-hidden ${
                props.currentNoteId === recent.id &&
                props.currentFolder === recent.folder
                  ? "opacity-100 bg-[#312EB5]"
                  : "opacity-50"
              }`}
              onClick={() => props.setCurrentNoteId(recent.id)}
              key={recent.id}
            >
              <FiFileText className="text-2xl " />
              <div className="text-lg max-h-full overflow-hidden whitespace-nowrap text-ellipsis ml-2">
                {recent.title || "Untitled Note"}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="box4 max-h-[30%] w-full h-[20%] mt-5 flex flex-col">
        <div className="folders   pl-3 flex justify-between">
          <span className="text-sm opacity-50">Folder</span>
          <HiOutlineFolderAdd
            className="text-2xl mr-4 opacity-50 hover:opacity-100 cursor-pointer"
            onClick={handleAddFolder}
          />
        </div>
        <div className="folder-list max-h-[30vh]  w-full h-[20vh] flex flex-col overflow-y-scroll scrollbar">
          {props.folders.map((folder, index) => (
            <div
              className={`folder cursor-pointer flex pl-3 min-h-[5vh] items-center overflow-hidden ${
                props.currentFolder === folder
                  ? "opacity-100 bg-neutral-800"
                  : "opacity-50"
              } hover:bg-neutral-800`}
              onClick={() => props.setCurrentFolder(folder)}
              key={index}
            >
              {props.currentFolder === folder ? (
                <FaRegFolderOpen className="text-2xl" />
              ) : (
                <FaRegFolder className="text-2xl" />
              )}

              {editingFolder === index ? (
                <input
                  className="text-lg ml-2 mr-10 bg-transparent border-b border-gray-500 outline-none text-white"
                  value={folder}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  onBlur={() => setEditingFolder(null)} // exit edit mode
                  autoFocus
                />
              ) : (
                <input
                  className="text-lg ml-2 mr-10 bg-transparent outline-none text-white cursor-pointer"
                  value={folder || "Untitled Folder"}
                  readOnly
                  onClick={(e) => {
                    e.stopPropagation(); // prevent onClick of parent div
                    setEditingFolder(index);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="box5  w-full h-[20%] mt-5 flex flex-col">
        <div className="more opacity-50  pl-3">
          <span className="text-sm">More</span>
        </div>
        <div className="more-list flex flex-col my-2">
          <div
            className={`favourie flex pl-3  h-[5vh] items-center overflow-hidden hover:opacity-100 cursor-pointer ${
              props.currentFolder === "favourite" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => props.setCurrentFolder("favourite")}
          >
            <FaRegHeart className="text-2xl " />
            <div className="text-lg max-h-full overflow-hidden whitespace-nowrap text-ellipsis ml-2 ">
              Favourites
            </div>
          </div>
          <div
            className={`trash flex pl-3  h-[5vh] items-center overflow-hidden hover:opacity-100 cursor-pointer ${
              props.currentFolder === "trash" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => props.setCurrentFolder("trash")}
          >
            <FiTrash className="text-2xl " />
            <div className="text-lg max-h-full overflow-hidden whitespace-nowrap text-ellipsis ml-2">
              Trash
            </div>
          </div>
          <div
            className={`archive flex pl-3  h-[5vh] items-center overflow-hidden hover:opacity-100 cursor-pointer ${
              props.currentFolder === "archive" ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => props.setCurrentFolder("archive")}
          >
            <IoArchiveOutline className="text-2xl " />
            <div className="text-lg max-h-full overflow-hidden whitespace-nowrap text-ellipsis ml-2">
              Archive
            </div>
          </div>
        </div>
      </div>
      <div className="box6 w-full flex mt-10 mx-auto justify-between items-center gap-2 font-medium rounded-3xl p-2 hover:bg-neutral-800 max-w-full">
        <div className="left flex items-center gap-2">
          <div className="left">
            <img
              src={images[props.currentUser ? props.currentUser.id % 7 : 1]}
              alt=""
              className="h-10 w-10 rounded-3xl "
            />
          </div>
          <div className="mid flex flex-col">
            <div className="username">
              {props.currentUser ? props.currentUser.username : ""}
            </div>
            <div className="email opacity-50">
              {props.currentUser ? props.currentUser.email : ""}
            </div>
            <div className="id opacity-50 text-sm">
              ID: {props.currentUser ? props.currentUser.id : ""}
            </div>
          </div>
        </div>

        <div className="right">
          <IoIosMore
            className="text-2xl opacity-50 hover:opacity-100 cursor-pointer"
            onMouseEnter={handleMouseEnterDots}
            onMouseLeave={handleMouseLeaveDots}
          />
        </div>
        <div
          className={`settings flex flex-col fixed ml-[19%] mb-20 bg-neutral-800 rounded-lg gap-2  transition-opacity duration-300  ${
            showSettings ? "opacity-100 z-100" : "opacity-0 -z-100"
          }`}
          onMouseEnter={handleMouseEnterSettings}
          onMouseLeave={handleMouseLeaveSettings}
        >
          <span className="hover:bg-neutral-700 w-[100%] h-[50%] p-2 rounded-lg flex items-center gap-2 cursor-pointer">
            <LuPencil className="text-sm" />
            Edit User
          </span>
          <span
            className="hover:bg-neutral-700 w-[100%] h-[50%] p-2 rounded-lg flex items-center gap-2 cursor-pointer"
            onClick={() => props.setLogout(true)}
          >
            <IoExitOutline className="text-sm" />
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default Menu;

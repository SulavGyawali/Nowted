import { CiCircleMore } from "react-icons/ci";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FaRegFolder, FaRegCopy } from "react-icons/fa";
import Editor from "react-simple-wysiwyg";
import { use, useEffect, useRef, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { FiShare } from "react-icons/fi";
import { IoArchiveOutline } from "react-icons/io5";
import { FiFileText } from "react-icons/fi";

const Content = (props) => {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState();
  const [folder, setFolder] = useState("");
  const [showSave, setShowSave] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [mouseInDots, setMouseInDots] = useState(false);
  const [mouseInSettings, setMouseInSettings] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const [archived, setArchived] = useState(false);
  const [trash, setTrash] = useState(false);
  const [share, setShare] = useState(false);

  const timeoutRef = useRef(null);

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
  useEffect(() => {
    if (mouseInDots || mouseInSettings) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  }, [mouseInDots, mouseInSettings]);

  const handleSave = () => {
    if (props.currentNoteId) {
      props.setUpdatedNote({
        title: title,
        description: value,
        folder: folder,
        favourite: favourite || false,
        archive: archived || false,
        trash: trash || false,
      });
      props.setCurrentNote({
        ...props.currentNote,
        title: title,
        description: value,
        folder: folder,
        updated_at: new Date().toISOString(),
      });
      setShowSave(false);
      props.handleAlert("Note updated successfully!", "success");
    } else {
      props.setNewNote({
        title: title,
        description: value,
        folder: props.currentFolder || "Personal",
        favourite: false,
        archived: false,
        trash: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      props.setCurrentNote({
        title: title,
        description: value,
        folder: folder,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      props.setCurrentNoteId(null);
      setTitle("");
      setValue("");
      setFolder("Personal");
      setDate(new Date().toLocaleDateString("en-US"));
      setShowSave(false);
      props.handleAlert("New note created successfully!", "success");
    }
  };

  useEffect(() => {
    if (props.currentNote) {
      setTitle(props.currentNote.title);
      setValue(props.currentNote.description);
      setDate(
        new Date(props.currentNote.updated_at).toLocaleDateString("en-US")
      );
      setFolder(props.currentNote.folder || "Personal");
      setFavourite(props.currentNote.favourite || false);
      setArchived(props.currentNote.archive || false);
      setTrash(props.currentNote.trash || false);
    }
  }, [props.currentNote]);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (
        props.currentNote.title !== title ||
        props.currentNote.description !== value ||
        props.currentNote.favourite !== favourite ||
        props.currentNote.archive !== archived ||
        props.currentNote.trash !== trash
      ) {
        handleSave();
      }
    }, 1000);
    return () => clearTimeout(timeoutRef.current);
  }, [title, value, props.currentNote, favourite, archived, trash]);

  return (
    <div className="w-[55%] h-[100%] flex flex-col px-7">
      {props.currentNote ? (
        <div>
          <div className="box1 mt-7 flex justify-between text-2xl font-medium">
            <input
              type="text"
              value={title}
              className="w-full focus:outline-0"
              onChange={(e) => setTitle(e.target.value)}
            />
            <CiCircleMore
              className="text-2xl opacity-50 hover:opacity-100 cursor-pointer"
              onMouseEnter={handleMouseEnterDots}
              onMouseLeave={handleMouseLeaveDots}
            />
            <div
              className={`share text-white w-[15vw] flex flex-col fixed right-0 mr-[20%] 
                top-10 bg-neutral-800 rounded-lg gap-2  transition-opacity text-xl duration-300   ${
                  share ? "opacity-100 z-100" : "opacity-0 -z-100"
                }`}
              onMouseLeave={() => setShare(false)}
            >
              <div className="title  w-[100%] h-[30%] p-2 pt-4  rounded-lg flex items-center gap-2 justify-center">
                Enter id of User
              </div>
              <div className="input w-[100%] h-[30%] p-2   rounded-lg flex items-center gap-2 justify-center">
                <input
                  type="text"
                  className="w-[90%] border border-white rounded-lg pl-2"
                  value={props.shareUserId}
                  onChange={(e) => props.setShareUserId(e.target.value)}
                />
              </div>
              <div className="button  w-[100%] h-[40%] p-2  pb-4 rounded-lg flex items-center gap-2 justify-center">
                <button
                  className="w-[50%] h-[60%] bg-white text-black text-lg font-medium cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    props.handleShare(props.currentNoteId, props.shareUserId);
                  }}
                >
                  Share
                </button>
              </div>
            </div>
            <div
              className={`more text-white w-[15vw] flex flex-col fixed right-0 mr-[3%] mt-1 bg-neutral-800 rounded-lg gap-2  transition-opacity text-lg duration-300   ${
                showMore ? "opacity-100 z-100" : "opacity-0 -z-100"
              }`}
              onMouseEnter={handleMouseEnterSettings}
              onMouseLeave={handleMouseLeaveSettings}
            >
              <div
                className="fav hover:bg-neutral-700 w-[100%] h-[50%] p-2 pl-4 pt-4 rounded-lg flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setFavourite(!favourite);
                }}
              >
                <FaRegHeart className="text-xl " />
                Add to Favourites
              </div>
              <div
                className="archive  hover:bg-neutral-700 w-[100%] h-[50%] p-2 pl-4 rounded-lg flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setArchived(!archived);
                }}
              >
                <IoArchiveOutline className="text-xl " /> Archive
              </div>
              <div
                className="fav hover:bg-neutral-700 w-[100%] h-[50%] p-2 pl-4 pt-4 rounded-lg flex items-center gap-2 cursor-pointer"
                onMouseDown={() => {
                  setShare(!share);
                }}
              >
                <FiShare className="text-xl " />
                Share Note
              </div>
              <div className="separator w-[95%] h-[0.5px] mx-auto bg-neutral-600"></div>
              <div
                className="delete hover:bg-neutral-700 w-[100%] h-[50%] p-2 pl-4 pb-4 rounded-lg flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setTrash(!trash);
                }}
              >
                <FiTrash className="text-xl " /> Delete
              </div>
            </div>
          </div>
          <div className="box2 flex mt-5 gap-10 items-center">
            <div className="date flex opacity-50 gap-5 items-center">
              <MdOutlineCalendarMonth className="text-2xl " />
              <span>Date</span>
            </div>
            <div className="value underline-offset-2 underline decoration-[1px]">
              {date}
            </div>
          </div>
          <div className="separator w-full h-[0.5px] mx-auto bg-neutral-600 m-3"></div>
          <div className="box3 flex gap-10 items-center">
            <div className="date flex opacity-50 gap-5 items-center">
              <FaRegFolder className="text-2xl " />
              <span>Folder</span>
            </div>
            <div className="value underline-offset-2 underline decoration-[1px]">
              {folder}
            </div>
          </div>
          <div className="separator w-full h-[0.5px] mx-auto bg-neutral-600 m-3"></div>

          <div className="box4 h-[65%]">
            <Editor
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              containerProps={{
                style: {
                  background: "none",
                  border: "none",
                },
              }}
              style={{ background: "none" }}
              className="ql-editor overflow-y-scroll scrollbar"
            ></Editor>
          </div>
        </div>
      ) : (
        <>
          <div className="nonote w-full h-full flex flex-col justify-center items-center gap-5">
            <FiFileText className="text-6xl" />
            <span className="text-3xl font-medium">Select a note to view</span>
            <span className="w-[50%] flex flex-col items-center justify-center opacity-50">
              <span>Choose a note from your left to view its contents</span>or
              add a note to your collection.<span></span>{" "}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default Content;

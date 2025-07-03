import { useContext, useEffect, useRef, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { format } from "timeago.js";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const fileRef = useRef();
  const storiesRef = useRef();
  const containerRef = useRef();
  const [openStoryUser, setOpenStoryUser] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);

  const { data: stories, isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload`, formData, {
        withCredentials: true,
      });
      const filename = uploadRes.data;
      return makeRequest.post("/stories", { img: filename });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["stories"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (storyId) => makeRequest.delete(`/stories/${storyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["stories"]);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadMutation.mutate(file);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const groupedStories = stories?.reduce((acc, story) => {
    const { userid } = story;
    if (!acc[userid]) acc[userid] = [];
    acc[userid].push(story);
    return acc;
  }, {}) || {};

  const previewStories = Object.values(groupedStories).map(
    (userStories) => userStories[userStories.length - 1]
  );

  const myUserStories = groupedStories?.[currentUser.id] || [];
  const myLatestStory = myUserStories[myUserStories.length - 1];

  useEffect(() => {
    if (!openStoryUser) return;
    const timer = setTimeout(() => {
      const userStories = groupedStories[openStoryUser];
      if (storyIndex < userStories.length - 1) {
        setStoryIndex(storyIndex + 1);
      } else {
        setOpenStoryUser(null);
        setStoryIndex(0);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [openStoryUser, storyIndex, groupedStories]);

  return (
    <>
      <div className="storiesContainer" ref={containerRef}>
        <div className="stories" ref={storiesRef}>
          {/* Your Story */}
          <div className="story addStory" onClick={() => fileRef.current.click()}>
            <img
              src={
                myLatestStory
                  ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${myLatestStory.img}?t=${Date.now()}`
                  : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${currentUser.profilePic || "noprofile.jpg"}`
              }
              alt="your story"
              onError={(e) =>
                (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`)
              }
            />
            <span>{currentUser.name}</span>
            <button title="Add Story">+</button>
            <input
              type="file"
              ref={fileRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {myLatestStory && (
              <button className="deleteBtn" onClick={(e) => handleDelete(myLatestStory.id, e)}>
                <DeleteIcon style={{ fontSize: "16px" }} />
              </button>
            )}
          </div>

          {/* Others' Stories */}
          {!isLoading &&
            previewStories.map((story) => (
              <div
                className="story"
                key={story.id}
                onClick={() => {
                  setOpenStoryUser(story.userid);
                  setStoryIndex(0);
                }}
              >
                <img
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${story.img}?t=${Date.now()}`}
                  alt={story.name}
                  onError={(e) =>
                    (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`)
                  }
                />
                <span>{story.name}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {openStoryUser && groupedStories[openStoryUser] && (
        <div className="storyViewer" onClick={() => setStoryIndex(storyIndex + 1)}>
          <div className="storyContent">
            <div className="progressContainer">
              {groupedStories[openStoryUser].map((_, idx) => (
                <div
                  className={`progressBar ${
                    idx < storyIndex ? "seen" : idx === storyIndex ? "active" : ""
                  }`}
                  key={idx}
                />
              ))}
            </div>

            <img
              src={`${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${groupedStories[openStoryUser][storyIndex].img}?t=${Date.now()}`}
              alt="story"
              onError={(e) =>
                (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`)
              }
            />
            <span className="topText">
              {format(groupedStories[openStoryUser][storyIndex].createdAt)}
            </span>
            <span className="bottomText">
              {groupedStories[openStoryUser][storyIndex].name}
            </span>
            <button
              className="closeBtn"
              onClick={(e) => {
                e.stopPropagation();
                setOpenStoryUser(null);
                setStoryIndex(0);
              }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Stories;

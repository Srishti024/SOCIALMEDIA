import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, error, data: commentsData = [] } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    if (!desc.trim()) return;
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  const handleNavigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ scroll to top
  };

  return (
    <div className="comments">
      <div className="write">
       <img
  src={
    currentUser.profilepic
      ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${encodeURIComponent(currentUser.profilepic)}?t=${Date.now()}`
      : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`
  }
  alt="profile"
  className="profilePic"
  onError={(e) =>
    (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`)
  }
/>

        <input
          type="text"
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading..."
        : commentsData.map((comment) => (
            <div className="comment" key={comment.id}>
              <img
                src={
                  comment.profilePic
                    ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${encodeURIComponent(comment.profilePic)}?t=${Date.now()}`
                    : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`
                }
                alt="profile"
                className="profilePic"
                onClick={() => handleNavigateToProfile(comment.userId)} // ✅ Navigate + scroll
                style={{ cursor: "pointer" }}
                onError={(e) => (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`)}
              />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">{moment(comment.createdAt).fromNow()}</span>
            </div>
          ))}
    </div>
  );
};

export default Comments;

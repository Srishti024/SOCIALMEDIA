import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useNavigate } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => res.data),
  });

  const likeMutation = useMutation({
    mutationFn: (liked) =>
      liked
        ? makeRequest.delete("/likes?postId=" + post.id)
        : makeRequest.post("/likes", { postId: post.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", post.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => makeRequest.delete("/posts/" + postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate(data?.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const goToProfile = () => {
    navigate(`/profile/${post.userId}`);
    window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ scroll to top
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img
              src={
                post.profilePic
                  ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${encodeURIComponent(post.profilePic)}?t=${Date.now()}`
                  : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`
              }
              onClick={goToProfile}
              style={{ cursor: "pointer" }}
              alt="profile"
              className="profilePic"
              onError={(e) => (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/.jpg`)}
            />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} // ✅ also works for name link
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>

          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>

        <div className="content">
          <p>{post.desc}</p>
          {post.img && <img src={`${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${post.img || "noprofile.jpg"}?t=${Date.now()}`} alt="post" />}
        </div>
{/* <img src={"/upload/" + post.img} alt="post" />} */}
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data?.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length || 0} Likes
          </div>

          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>

          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>

        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;

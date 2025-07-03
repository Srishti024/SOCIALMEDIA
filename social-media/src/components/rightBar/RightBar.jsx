import "./rightBar.scss";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await makeRequest.get(`/users/suggestions/${currentUser.id}`);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    const fetchFollowed = async () => {
      try {
const res = await makeRequest.get(`/relationships`);

        setFollowedUsers(res.data); // array of followed user IDs
      } catch (err) {
        console.error("Error fetching followed users:", err);
      }
    };

    fetchSuggestions();
    fetchFollowed();
  }, [currentUser.id]);

  const handleFollowToggle = async (userId) => {
    try {
      if (followedUsers.includes(userId)) {
        await makeRequest.delete(`/relationships?userId=${userId}`);
        setFollowedUsers((prev) => prev.filter((id) => id !== userId));
      } else {
        await makeRequest.post("/relationships", { userId });
        setFollowedUsers((prev) => [...prev, userId]);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const handleDismiss = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          <div className="scrollable-users">
            {Array.isArray(users) &&
              users.map((user) => (
                <div className="user" key={user.id}>
                  <div
                    className="userInfo"
                    onClick={() => navigate(`/profile/${user.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={
                        user.profilePic?.startsWith("http")
                          ? user.profilePic
                          : user.profilePic
                          ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${user.profilePic}`
                          : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`
                      }
                      alt="profile"
                    />
                    <span>{user.name}</span>
                  </div>
                  <div className="buttons">
                    <button onClick={() => handleFollowToggle(user.id)}>
                      {followedUsers.includes(user.id) ? "Unfollow" : "Follow"}
                    </button>
                    <button onClick={() => handleDismiss(user.id)}>Dismiss</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;

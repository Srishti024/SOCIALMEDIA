import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const userId = parseInt(useLocation().pathname.split("/")[2], 10);

  const {
    isLoading: uLoading,
    error: uError,
    data: userData,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then((res) => res.data),
  });

const {
  isLoading: rLoading,
  error: rError,
  data: followedUsers,
} = useQuery({
  queryKey: ["relationship"],
  queryFn: () =>
    makeRequest.get("/relationships").then((res) => res.data),
});


  const followMutation = useMutation({
    mutationFn: (isFollowing) =>
      isFollowing
        ? makeRequest.delete("/relationships?userId=" + userId)
        : makeRequest.post("/relationships", { userId }),
   onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["relationship"] });
},

  });

  const handleFollow = () => {
  followMutation.mutate(followedUsers.includes(userId));
};

  if (uLoading || rLoading) return <div>Loading...</div>;
  if (uError || rError) return <div>Error loading profile!</div>;
  if (!userData) return <div>User not found.</div>;
  console.log("userData:", userData);

  return (
    <div className="profile">
      <div className="images">
        <img
          src={
            userData.coverpic
              ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${encodeURIComponent(userData.coverpic)}?t=${Date.now()}`
              : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/defaultCover.jpg`
          }
          alt="cover"
          className="cover"
          onError={(e) => (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/default.jpg`)}
        />
        <img
          src={
            userData.profilepic
              ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${encodeURIComponent(userData.profilepic)}?t=${Date.now()}`
              : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/defaultProfile.jpg`
          }
          alt="profile"
          className="profilePic"
          onError={(e) => (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`)}
        />
      </div>

      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer">
              <PinterestIcon fontSize="large" />
            </a>
          </div>

          <div className="center">
            <span>{userData.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{userData.city || "Unknown City"}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{userData.website || "No Website"}</span>
              </div>
            </div>
            {userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)}>Update Profile</button>
            ) : (
              <button onClick={handleFollow}>
  {followedUsers.includes(userId) ? "Following" : "Follow"}
</button>

            )}
          </div>

          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>

        <Posts userId={userId} />
      </div>

      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={userData} />}
    </div>
  );
  console.log("🔍 userData.profilePic", userData.profilePic);
console.log("🔍 userData.coverPic", userData.coverPic);
console.log("Image URL:", `${import.meta.env.VITE_API_BASE_URL}/upload/${userData.profilePic}`);
};

export default Profile;

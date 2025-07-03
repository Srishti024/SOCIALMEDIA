import { useState, useContext } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AuthContext } from "../../context/authContext";

const Update = ({ setOpenUpdate, user }) => {
  const { setCurrentUser } = useContext(AuthContext);

  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user?.email || "",
    password: user?.password || "",
    name: user?.name || "",
    city: user?.city || "",
    website: user?.website || "",
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedUser) => makeRequest.put("/users", updatedUser),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", user.id]);
      setTimeout(() => {
        makeRequest.get(`/users/find/${user.id}`).then((res) => {
          setCurrentUser(res.data);
        });
      }, 300);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl = cover ? await upload(cover) : user.coverPic;
    let profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({
      ...texts,
      coverPic: coverUrl,
      profilePic: profileUrl,
    });

    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
  <div className="files">
    <label htmlFor="cover">
      <span>Cover Picture</span>
      <div className="imgContainer">
        <img
          src={
            cover
              ? URL.createObjectURL(cover)
              : user.coverPic
              ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${encodeURIComponent(user.coverPic)}?t=${Date.now()}`
              : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/default.jpg`
          }
          alt="cover"
          onError={(e) => (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/default.jpg`)}
        />
        <CloudUploadIcon className="icon" />
      </div>
    </label>
    <input
      type="file"
      id="cover"
      style={{ display: "none" }}
      onChange={(e) => setCover(e.target.files[0])}
    />

    <label htmlFor="profile">
      <span>Profile Picture</span>
      <div className="imgContainer">
        <img
          src={
            profile
              ? URL.createObjectURL(profile)
              : user.profilePic
              ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${encodeURIComponent(user.profilePic)}?t=${Date.now()}`
              : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/default.jpg`
          }
          alt="profile"
          onError={(e) => (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/default.jpg`)}
        />
        <CloudUploadIcon className="icon" />
      </div>
    </label>
    <input
      type="file"
      id="profile"
      style={{ display: "none" }}
      onChange={(e) => setProfile(e.target.files[0])}
    />
  </div>

  <label>Email</label>
  <input
    type="email"
    value={texts.email}
    name="email"
    onChange={handleChange}
    required
  />

  <label>Password</label>
  <input
    type="password"
    value={texts.password}
    name="password"
    onChange={handleChange}
    required
  />

  <label>Name</label>
  <input
    type="text"
    value={texts.name}
    name="name"
    onChange={handleChange}
    required
  />

  <label>Country / City</label>
  <input
    type="text"
    name="city"
    value={texts.city}
    onChange={handleChange}
    required
  />

  <label>Website</label>
  <input
    type="url"
    name="website"
    value={texts.website}
    onChange={handleChange}
    required
  />

  <button onClick={handleClick}>Update</button>
</form>

        <button className="close" onClick={() => setOpenUpdate(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Update;

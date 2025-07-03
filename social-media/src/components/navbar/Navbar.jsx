import "./navbar.scss";
import {
  HomeOutlined,
  DarkModeOutlined,
  WbSunnyOutlined,
  NotificationsOutlined,
  EmailOutlined,
  PersonOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import RightBar from "../rightBar/RightBar";



const Navbar = () => {
  const { darkMode, toggle } = useContext(DarkModeContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotificationClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/search?name=${value}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleSelectUser = (id) => {
    setSearchTerm("");
    setSearchResults([]);
    navigate(`/profile/${id}`);
  };
  const goToOwnProfile = () => {
  navigate(`/profile/${currentUser.id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Pixera</span>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <HomeOutlined />
        </Link>
        {darkMode ? (
          <WbSunnyOutlined onClick={toggle} />
        ) : (
          <DarkModeOutlined onClick={toggle} />
        )}

        <MenuIcon className="menuIcon" onClick={() => setShowMobileMenu(!showMobileMenu)} />

        <div className="search">
          <SearchOutlined />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchResults.length > 0 && (
            <div className="searchResults">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="searchResultItem"
                  onClick={() => handleSelectUser(user.id)}
                >
                  <img
                    src={
                      user.profilePic
                        ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${user.profilePic}`
                        : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`
                    }
              
                    alt="user"
                  />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="right">
        {currentUser ? (
          <>
            <span>Welcome, {currentUser.name}</span>
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </button>
          </>
        ) : (
          <span>Please log in</span>
        )}
        <PersonOutlined />
        <EmailOutlined />
        <NotificationsOutlined
          onClick={handleNotificationClick}
          style={{ cursor: "pointer" }}
        />
        <div className="user">
          <img
  src={
    currentUser.profilepic
      ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${encodeURIComponent(currentUser.profilepic)}?t=${Date.now()}`
      : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`
  }
  alt="profile"
  className="profilePic"
  onClick={goToOwnProfile} // ✅ added
  style={{ cursor: "pointer" }}
  onError={(e) => (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`)}
/>

        </div>
        {showToast && <div className="toast">You have no notifications yet.</div>}
      </div>

      {/* ✅ Mobile right menu popup */}
      {showMobileMenu && (
        <div className="mobileRightMenu">
          <RightBar />
        </div>
      )}

      {/* ✅ Mobile-only: Logout & Profile */}
      {currentUser && (
        <div className="mobileRightUser">
          <button onClick={handleLogout}>Logout</button>
              <img
  src={
    currentUser.profilepic
      ? `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/${encodeURIComponent(currentUser.profilepic)}?t=${Date.now()}`
      : `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`
  }
  alt="profile"
  className="profilePic"
  onClick={goToOwnProfile} // ✅ added
  style={{ cursor: "pointer" }}
  onError={(e) => (e.target.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/upload/noprofile.jpg`)}
/>
        </div>
      )}
    </div>
  );
};

export default Navbar;

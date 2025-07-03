import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { blue } from "@mui/material/colors";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!validatePassword(inputs.password)) {
      setErr(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_UR}/auths/register`, inputs);
      setErr(null);
    } catch (err) {
      if (err.response && err.response.data) {
        setErr(err.response.data);
      } else {
        setErr("Server is not responding.");
      }
    }
  };

  const images = [
    "/images/pexels-david-besh-884788.jpg",
    "/images/pexels-hannah-nelson-390257-1065081.jpg",
    "/images/pexels-helenalopes-708392.jpg",
    "/images/pexels-minan1398-853168.jpg",
  ];

  const [bgImage, setBgImage] = useState(images[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setBgImage(images[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="register"
      style={{ backgroundImage: `url(${bgImage})`, height: "100vh", overflowY: "auto", overflowX: "hidden" }}
    >
      <div className="card">
        <div className="left">
          <h1>Welcome to Pixera📸</h1>
          <p>
            Where your new era of sharing starts. Create your account
            and start posting, liking, scrolling, and connecting — beautifully.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form onSubmit={handleClick}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              required
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              required
              onChange={handleChange}
            />
              <input
              type="text"
              placeholder="Name"
              name="name"
              required
              onChange={handleChange}
            />
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                required
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

           
            {err && <p className="error">{err}</p>}
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

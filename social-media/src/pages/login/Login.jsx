import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setErr(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Background slideshow logic
  const images = [
    "/images/pexels-david-besh-884788.jpg",
    "/images/pexels-hannah-nelson-390257-1065081.jpg",
    "/images/pexels-helenalopes-708392.jpg",
    "/images/pexels-minan1398-853168.jpg",
  ]; // Use your actual image paths (public folder recommended)

  const [bgImage, setBgImage] = useState(images[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      setBgImage(images[index]);
    }, 3000); // 3seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="login"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="card">
        <div className="left">
          <h1>Pixera</h1>
          <p>Create. Connect. Scroll. Repeat..</p>
        
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
            />
            {err && <span className="error">{err}</span>}
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

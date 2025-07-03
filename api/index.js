import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Serve uploaded images from /upload
app.use("/upload", express.static(path.join(__dirname, "upload")));

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Change this to your frontend domain on production
    credentials: true,
  })
);

// ✅ Multer storage config to save in api/upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "upload")); // ✅ Now pointing to backend folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Upload route
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json("No file uploaded");
  res.status(200).json(file.filename);
});

// ✅ Routes
import authRoutes from "./routes/auths.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import storyRoutes from "./routes/stories.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";

app.use("/api/auths", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);

// ✅ Optional test route
app.get("/api/test", (req, res) => {
  res.send("Backend is running!");
});

// ✅ Start server
app.listen(8800, () => {
  console.log("✅ API working on port 8800");
});

import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// ✅ Get a single user
export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};
export const searchUsers = (req, res) => {
  const searchTerm = req.query.name;
  const q = "SELECT id, name, profilePic FROM users WHERE name LIKE ? LIMIT 10";
  db.query(q, [`%${searchTerm}%`], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// ✅ Update the current logged-in user's profile
export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token,process.env.JWT_SECRET
, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      UPDATE users
      SET name=?, city=?, website=?, profilePic=?, coverPic=?
      WHERE id=?`;

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        userInfo.id,
      ],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your account!");
      }
    );
  });
};

// ✅ Get user suggestions excluding current user
export const getSuggestions = (req, res) => {
  const currentUserId = req.params.userId;

  const q = `
    SELECT id, name, profilePic
    FROM users
    WHERE id != ?`;

  db.query(q, [currentUserId], (err, data) => {
    if (err) {
      console.error("Suggestion fetch error:", err);
      return res.status(500).json({ error: "Failed to get suggestions" });
    }
    return res.status(200).json(data);
  });
};

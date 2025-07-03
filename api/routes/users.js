import express from "express";
import { getUser, updateUser, getSuggestions,searchUsers } from "../controllers/user.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/", updateUser);
router.get("/suggestions/:userId", getSuggestions); // ✅ Add this
router.get("/search", searchUsers);
export default router;

import express from "express";
import { getStories, addStory, deleteStory } from "../controllers/story.js";

const router = express.Router();

// Get stories of current user and followed users
router.get("/", getStories);

// Add a new story (image + userId from token)
router.post("/", addStory);

// Delete a story if it belongs to the user
router.delete("/:id", deleteStory);

export default router;

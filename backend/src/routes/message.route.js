import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendMessage, getMessages, getUsersForSidebar } from "../controllers/message.controller.js";

const router = express.Router();

//this will make sure that only authenticated users get to the message sidebar (function)
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id",protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage)
export default router;

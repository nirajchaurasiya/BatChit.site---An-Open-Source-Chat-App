import { Router } from "express";
import { getAllChats, createChat } from "../controllers/chat.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-chat").post(verifyJWT, createChat);
router.route("/get-chats").get(verifyJWT, getAllChats);

export default router;

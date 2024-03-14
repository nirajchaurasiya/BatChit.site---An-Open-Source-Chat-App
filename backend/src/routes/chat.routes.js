import { Router } from "express";
import {
   createIndividualChat,
   getIndividualChat,
   getIndividualMessages,
   getSlicedMessages,
   sendIndividualMessage,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/individual/create-chat").post(verifyJWT, createIndividualChat);

router.route("/individual/get-chats").get(verifyJWT, getIndividualChat);

router
   .route("/individual/send-message/:chatId")
   .post(verifyJWT, sendIndividualMessage);

router
   .route("/individual/get-messages/:chatId")
   .get(verifyJWT, getIndividualMessages);

router
   .route("/individual/get-sliced-messages/:chatId/:page")
   .get(verifyJWT, getSlicedMessages);

export default router;

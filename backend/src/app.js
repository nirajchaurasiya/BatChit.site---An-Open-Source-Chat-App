import express from "express";
import { user, addUser, removeUser } from "./user.store.js";
import cookieParser from "cookie-parser";
import http from "http"; // Import http module for Socket.IO
import { Server } from "socket.io"; // Import Server class from Socket.IO
const app = express();
const server = http.createServer(app); // Create HTTP server using Express app
const io = new Server(server, {
   cors: {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
   },
}); // Create Socket.IO server instance

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";

import { typingHandler } from "./socketFunctions/typingHandler.js";
import { sendIndividualMessageHandler } from "./socketFunctions/sendIndividualMessageHandler.js";
//routes declaration
app.use("/api/v1/users", userRouter);

app.use("/api/v1/chat", chatRouter);

// Socket.IO event handling
io.on("connection", async (socket) => {
   const socketId = socket.id;

   socket.on("add-user", (user_Id) => {
      addUser(socketId, user_Id);
   });

   socket.on("send-individual-message", sendIndividualMessageHandler);

   socket.on("typing", typingHandler());

   socket.on("disconnect", () => {
      console.log("User disconnected");
      removeUser(socketId);
   });
});

export { app, server, io };

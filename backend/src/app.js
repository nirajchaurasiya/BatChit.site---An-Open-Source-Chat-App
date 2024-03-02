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
//routes declaration
app.use("/api/v1/users", userRouter);

app.use("/api/v1/chat", chatRouter);

// Socket.IO event handling
io.on("connection", (socket) => {
  const id = socket.id;

  socket.on("add-user", () => {
    addUser(id);
    console.log(user);
  });

  // Example socket event handling
  socket.on("chat-message", (msg) => {
    console.log("Received message:", JSON.stringify(msg));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    removeUser(id);
  });
});

app.get("/get", (req, res) => {
  return res.status(200).json({
    msg: "Working",
  });
});

export { app, server, io }; // Export server instance as well for use with Socket.IO

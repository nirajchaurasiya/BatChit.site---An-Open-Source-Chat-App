import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
// import { Message } from "../models/message.model.js";

const createChat = asyncHandler(async (req, res) => {
  const admin = req?.user?._id;
  const { chatName, isGroupChat, users } = req.body;

  if (!chatName) {
    throw new ApiError(400, "Unauthorized request");
  }

  await Chat.create({
    chatName,
    isGroupChat,
    users,
    admin,
    latestMessage: mongoose.Types.ObjectId(),
  });

  const chats = await Chat.aggregate([
    {
      $match: {
        $or: [
          {
            admin: admin,
          },
          {
            users: admin,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "admin",
        foreignField: "_id",
        as: "adminUserDetails",
        pipeline: [
          {
            $project: {
              fullName: 1,
              email: 1,
              background: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        adminUserDetails: {
          $arrayElemAt: ["$adminUserDetails", 0],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "userDetails",
        pipeline: [
          {
            $project: {
              fullName: 1,
              email: 1,
              background: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "latestMessage",
        foreignField: "_id",
        as: "latestMessageDetails",
      },
    },
    {
      $addFields: {
        latestMessageDetails: {
          $arrayElemAt: ["$latestMessageDetails", 0],
        },
      },
    },
    {
      $unset: ["admin", "users"],
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, chats, "Chats created successfully", 7003));
});

const getAllChats = asyncHandler(async (req, res) => {
  try {
    const user = req?.user;
    if (!user) throw new ApiError(404, "User doesn't exists");

    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [
            {
              admin: user?._id,
            },
            {
              users: user?._id,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "admin",
          foreignField: "_id",
          as: "adminUserDetails",
          pipeline: [
            {
              $project: {
                fullName: 1,
                email: 1,
                background: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          adminUserDetails: {
            $arrayElemAt: ["$adminUserDetails", 0],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "usersDetails",
          pipeline: [
            {
              $project: {
                fullName: 1,
                email: 1,
                background: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "latestMessage",
          foreignField: "_id",
          as: "latestMessageDetails",
        },
      },
      {
        $unwind: "$latestMessageDetails", // Unwind the latestMessageDetails array
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessageDetails.readBy",
          foreignField: "_id",
          as: "latestMessageDetails.readBy",
          pipeline: [
            {
              $project: {
                fullName: 1,
                email: 1,
                background: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessageDetails.sender",
          foreignField: "_id",
          as: "latestMessageDetails.senderDetails",
          pipeline: [
            {
              $project: {
                fullName: 1,
                email: 1,
                background: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          "latestMessageDetails.senderDetails": {
            $arrayElemAt: ["$latestMessageDetails.senderDetails", 0],
          },
        },
      },

      {
        $unset: ["admin", "users"],
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, chats, "Chats retreived successfully", 7000));
  } catch (error) {
    throw new ApiError(500, error);
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { sender, content, chat, readBy } = req.body;

  if ([sender, content, chat].some((field) => field.trim() === ""))
    throw new ApiError(400, "Fields are empty");

  if (readBy && readBy?.length < 1)
    throw new ApiError(404, `ReadBy user is undefined`);

  const msg = await Message.create({
    sender,
    content,
    chat,
    readBy,
  });

  const chatRef = await Chat.findById(chat);

  chatRef.latestMessage = msg._id;

  await chatRef.save();

  return res.status(200).json(new ApiResponse(200, [], "Messages added", 9001));
});

const getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  if (!chatId) {
    throw new ApiError(400, "ChatId is undefined");
  }

  console.log("ChatId:", chatId); // Log the chatId to check its value

  const messages = await Message.aggregate([
    {
      $match: {
        chat: new mongoose.Types.ObjectId(chatId),
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "sender",
        as: "senderDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              bio: 1,
              background: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        senderDetails: {
          $arrayElemAt: ["$senderDetails", 0],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "readBy",
        as: "readByDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              bio: 1,
              background: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "chats",
        localField: "chat",
        foreignField: "_id",
        as: "chatDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "chatDetails.admin",
        foreignField: "_id",
        as: "chatDetails.adminDetails",
        pipeline: [
          {
            $project: {
              _id: 1,
              fullName: 1,
              bio: 1,
              background: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        "chatDetails.adminDetails": {
          $arrayElemAt: ["$chatDetails.adminDetails", 0],
        },
      },
    },
    {
      $unset: ["sender,readBy"],
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages retrieved success", 10000));
});

export { getAllChats, createChat, sendMessage, getAllMessages };

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
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
    latestMessage: new mongoose.Types.ObjectId(),
    admin,
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
        $unset: ["admin", "users"],
      },
    ]);
    return res
      .status(200)
      .json(new ApiResponse(200, chats, "Chats retreived successfully", 7000));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
});

export { getAllChats, createChat };

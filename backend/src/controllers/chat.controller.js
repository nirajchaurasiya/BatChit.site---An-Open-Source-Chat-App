import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { IndividualChat } from "../models/individualChat.model.js";
import mongoose from "mongoose";
import { IndividualChatMessage } from "../models/individualChatMessage.model.js";

const createIndividualChat = asyncHandler(async (req, res) => {
   try {
      const { receiver } = req?.body;

      const admin = req?.user?._id;

      const chatName = req?.user?.fullName;
      if (!admin) {
         throw new ApiError(400, "User Id is undefined");
      }
      if ([chatName, receiver].some((field) => field?.trim() === "")) {
         throw new ApiError(404, "Fields are necessary");
      }

      const isChatExistsForBothUsers = await IndividualChat.findOne({
         $or: [
            {
               $and: [
                  { admin: new mongoose.Types.ObjectId(admin) },
                  { receiver: new mongoose.Types.ObjectId(receiver) },
               ],
            },
            {
               $and: [
                  { admin: new mongoose.Types.ObjectId(receiver) },
                  { receiver: new mongoose.Types.ObjectId(admin) },
               ],
            },
         ],
      });

      if (isChatExistsForBothUsers) {
         throw new ApiError(409, "Chat already exists");
      }

      await IndividualChat.create({
         chatName,
         receiver,
         admin,
         latestMessage: new mongoose.Types.ObjectId(),
      });

      const chats = await IndividualChat.aggregate([
         {
            $match: {
               $or: [
                  {
                     admin: new mongoose.Types.ObjectId(admin),
                  },
                  {
                     receiver: new mongoose.Types.ObjectId(admin),
                  },
               ],
            },
         },
         {
            $lookup: {
               from: "users",
               localField: "receiver",
               foreignField: "_id",
               as: "receiverUserDetails",
               pipeline: [
                  {
                     $project: {
                        _id: 1,
                        fullName: 1,
                        background: 1,
                     },
                  },
               ],
            },
         },
         {
            $addFields: {
               receiverUserDetails: {
                  $arrayElemAt: ["$receiverUserDetails", 0],
               },
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
                        _id: 1,
                        fullName: 1,
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
               from: "individualchatmessages",
               foreignField: "_id",
               localField: "latestMessage",
               as: "latestMessageDetails",
               pipeline: [
                  {
                     $project: {
                        _id: 1,
                        sender: 1,
                        content: 1,
                     },
                  },
               ],
            },
         },
         {
            $addFields: {
               latestMessageDetails: {
                  $arrayElemAt: ["$latestMessageDetails", 0],
               },
            },
         },
      ]);

      return res
         .status(200)
         .json(new ApiResponse(200, chats, "Chats created successfully", 7003));
   } catch (error) {
      throw new ApiError(500, error.message || "Something went wrong");
   }
});

const getIndividualChat = asyncHandler(async (req, res) => {
   const admin = req?.user?._id;

   if (!admin) {
      throw new ApiError(404, "Unauthorized request");
   }

   const chats = await IndividualChat.aggregate([
      {
         $match: {
            $or: [
               { receiver: new mongoose.Types.ObjectId(admin) },
               { admin: new mongoose.Types.ObjectId(admin) },
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
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
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
            localField: "receiver",
            foreignField: "_id",
            as: "receiverUserDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            receiverUserDetails: {
               $arrayElemAt: ["$receiverUserDetails", 0],
            },
         },
      },
      {
         $lookup: {
            from: "individualchatmessages",
            foreignField: "_id",
            localField: "latestMessage",
            as: "latestMessageDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     sender: 1,
                     content: 1,
                     media: 1,
                     mediaType: 1,
                  },
               },
            ],
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
         $lookup: {
            from: "users",
            localField: "latestMessageDetails.sender",
            foreignField: "_id",
            as: "latestMessageDetails.senderDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
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
         $unset: ["admin", "receiver", "latestMessage"],
      },
   ]);

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            chats,
            "Individuals chats retrieved success",
            7000
         )
      );
});

const sendIndividualMessage = asyncHandler(async (req, res) => {
   const { content } = req?.body;

   if (!content) {
      throw new ApiError(401, "Please type a message");
   }

   const admin = req?.user?._id;

   if (!admin) {
      throw new ApiError(404, "Unauthorized request");
   }

   const { chatId } = req?.params;

   if (!chatId) {
      throw new ApiError(405, "ChatId is empty");
   }

   const isChatExist = await IndividualChat.findById(chatId);

   if (!isChatExist) {
      throw new ApiError(400, "Chat doesn't exists");
   }

   const createMsg = await IndividualChatMessage.create({
      chat: chatId,
      content: content,
      sender: admin,
      readBy: isChatExist?.receiver,
   });

   const createdMessage = await IndividualChatMessage.findById(createMsg?._id);

   if (!createdMessage) {
      throw new ApiError(406, "An erorr occured while sending the message");
   }

   isChatExist.latestMessage = createdMessage?._id;

   await isChatExist.save();

   const messages = await IndividualChatMessage.aggregate([
      {
         $match: {
            chat: new mongoose.Types.ObjectId(chatId),
         },
      },
      {
         $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "senderUserDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     fullName: 1,
                     background: 1,
                     email: 1,
                     bio: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            senderUserDetails: {
               $arrayElemAt: ["$senderUserDetails", 0],
            },
         },
      },
      //   {
      //      $lookup: {
      //         from: "individualchats",
      //         localField: "chat",
      //         foreignField: "_id",
      //         as: "chatDetails",
      //         pipeline: [
      //            {
      //               $project: {
      //                  _id: 1,
      //                  chatName: 1,
      //               },
      //            },
      //         ],
      //      },
      //   },
      //   {
      //      $addFields: {
      //         chatDetails: {
      //            $arrayElemAt: ["$chatDetails", 0],
      //         },
      //      },
      //   },
      {
         $unset: ["sender", "chat", "readBy"],
      },
   ]);

   return res
      .status(200)
      .json(new ApiResponse(200, messages, "Message sent", 7008));
});

const getIndividualMessages = asyncHandler(async (req, res) => {
   const { chatId } = req?.params;

   if (!chatId) {
      throw new ApiError(400, "Please provide a chatID");
   }

   const messages = await IndividualChatMessage.aggregate([
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
                     background: 1,
                     bio: 1,
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
            from: "individualchats",
            localField: "chat",
            foreignField: "_id",
            as: "chatDetails",
            pipeline: [
               {
                  $project: {
                     _id: 1,
                     chatName: 1,
                  },
               },
            ],
         },
      },
      {
         $addFields: {
            chatDetails: {
               $arrayElemAt: ["$chatDetails", 0],
            },
         },
      },
      {
         $unset: ["sender", "chat"],
      },
   ]);

   return res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages retrieved success", 8000));
});

export {
   createIndividualChat,
   getIndividualChat,
   sendIndividualMessage,
   getIndividualMessages,
};

import { createSlice } from "@reduxjs/toolkit";
import { IndividualChatDetails } from "../../types/Types";

export const chatCardsSlice = createSlice({
    name: "chatCards",
    initialState: {
        allChatCards: [],
        allGroupChatCards: []
    },
    reducers: {
        saveChatCards: (state, action) => {
            state.allChatCards = action.payload;
        },
        editChat: (state, action) => {
            const findChat = state.allChatCards.find((chat: IndividualChatDetails[0]) => chat?._id === action.payload._id)
            if (findChat) {
                (findChat as IndividualChatDetails[0]).latestMessageDetails.content = action.payload.latestMessageDetails.content;
            }
        },
        appendChat: (state: any, action) => {
            state.allChatCards = [...state.allChatCards, action.payload]
        },
        // Group Chat

        saveGroupChatCards: (state, action) => {
            state.allGroupChatCards = action.payload;
        },
        appendGroupChat: (state: any, action) => {
            state.allGroupChatCards = [...state.allGroupChatCards, action.payload];
        }
    },
});

export const { saveChatCards, editChat, appendChat, saveGroupChatCards, appendGroupChat } = chatCardsSlice.actions;

export default chatCardsSlice.reducer;

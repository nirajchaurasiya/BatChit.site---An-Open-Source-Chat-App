import { createSlice } from "@reduxjs/toolkit";
import { IndividualChatDetails } from "../../types/Types";
// import { Chat } from "../../types/Types";

export const chatCardsSlice = createSlice({
    name: "chatCards",
    initialState: {
        allChatCards: [],
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
        }
    },
});

export const { saveChatCards, editChat } = chatCardsSlice.actions;

export default chatCardsSlice.reducer;

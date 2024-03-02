import { createSlice } from "@reduxjs/toolkit";
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
        // removeChatCards:(state,action)=>{
        //     state.allChatCards = state.allChatCards.filter((chartCard:Chat[0])=>chartCard._id !== action.payload._id)
        // }
    },
});

export const { saveChatCards } = chatCardsSlice.actions;

export default chatCardsSlice.reducer;

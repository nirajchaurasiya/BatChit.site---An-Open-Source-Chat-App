import { createSlice } from "@reduxjs/toolkit";
// import { Chat } from "../../types/Types";

export const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        allMessages: [],
    },
    reducers: {

        appendMessages: (state: any, action) => {
            state.allMessages = [...action.payload, ...state.allMessages];
        },

        saveMessages: (state, action) => {
            state.allMessages = action.payload;
        },

    },
});

export const { saveMessages, appendMessages } = messagesSlice.actions;

export default messagesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
// import { Chat } from "../../types/Types";

export const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        allMessages: [],
    },
    reducers: {
        saveMessages: (state, action) => {
            state.allMessages = action.payload;
        },
    },
});

export const { saveMessages } = messagesSlice.actions;

export default messagesSlice.reducer;

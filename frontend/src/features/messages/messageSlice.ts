import { createSlice } from "@reduxjs/toolkit";
import { Messages } from "../../types/Types";

export const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        allMessages: [],
    },
    reducers: {
        // To concatenate previous messages coming from the infinte scrolling
        appendMessages: (state: any, action) => {
            state.allMessages = [...action.payload, ...state.allMessages];
        },
        // Initially save all the messages when the page loads
        saveMessages: (state, action) => {
            state.allMessages = action.payload;
        },
        // For appending next messages user communicate
        appendNextMessage: (state: any, action) => {
            state.allMessages = [...state.allMessages, ...action.payload]
        },
        saveEditedMessage: (state, action) => {
            const messageToUpdate = state.allMessages.find(field => (field as Messages)._id === action.payload._id);
            if (messageToUpdate) {
                (messageToUpdate as Messages).content = action.payload.content;
            }
        }

    },
});

export const { saveMessages, appendMessages, appendNextMessage, saveEditedMessage } = messagesSlice.actions;

export default messagesSlice.reducer;

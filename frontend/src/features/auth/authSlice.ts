import { Dispatch, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // Import axios for making HTTP requests
import { usersBackendURL } from "../../utils/usersBackendURL";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        loggedInUser: null, // Initially, no user is logged in
    },
    reducers: {
        saveLoggedInUser: (state, action) => {
            state.loggedInUser = action.payload;
        },
        clearLoggedInUser: (state) => {
            state.loggedInUser = null;
        },
    },
});

export const { saveLoggedInUser, clearLoggedInUser } = authSlice.actions;

// Thunk action creator to fetch user data from API
export const login = (access_Token: string) => async (dispatch: Dispatch) => {
    try {
        if (access_Token) {
            const response = await axios.post(`${usersBackendURL}/login-with-token`, {
                headers: {
                    Authorization: `Bearer ${access_Token}`, // Set Authorization header with access token
                },
            });
            const { success, statusCode, data } = response.data
            if (success && statusCode === 200) {
                dispatch(saveLoggedInUser(data?.user));
            }
        }
        else {
            console.error("Error fetching user data:");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};



export default authSlice.reducer;

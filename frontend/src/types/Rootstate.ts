import { GroupChatDetails, IndividualChatDetails, Messages } from "./Types";

export interface RootState {
    auth: {
        loggedInUser: UserType
    };
    chats: {
        allChatCards: IndividualChatDetails,
        allGroupChatCards: GroupChatDetails
    }
    messages: {
        allMessages: Messages[]
    }
}

export interface UserType {
    _id: string;
    email: string;
    fullName: string;
    isActivated: boolean;
    bio?: string
    createdAt: string; // Assuming this is a date string in ISO format
    updatedAt: string; // Assuming this is a date string in ISO format
    __v: number;
}

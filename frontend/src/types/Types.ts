import { Socket } from "socket.io-client";

interface UserDetails {
  _id: string;
  fullName: string;
  bio?: string; // Optional property
  background: string;
  email: string
}


interface LatestMessageDetails {
  _id: string;
  sender: string;
  content: string;
  senderDetails: UserDetails;
  media: string;
  mediaType: string
}

export type IndividualChatDetails = [{
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  adminUserDetails: UserDetails;
  receiverUserDetails: UserDetails;
  latestMessageDetails: LatestMessageDetails;
  isSeen: Boolean
}]


interface ChatDetails {
  _id: string;
  chatName: string;
}

export interface Messages {
  _id: string;
  content: string;
  media?: string
  mediaType?: string
  readBy: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  senderDetails: UserDetails;
  chatDetails: ChatDetails;
  isSeen: Boolean
}

export type LayoutParamsType = {
  home?: boolean;
  search?: boolean;
  groupMessages?: boolean;
  history?: boolean;
  profile?: boolean;
  logout?: boolean;
  message?: boolean;
  isGroup?: boolean;
  userInformation?: boolean;
  blockedAccounts?: boolean;
  deleteAccount?: boolean;
  widthOfWindow?: number;
  socket: Socket | null
};

export type MessageCardType = {
  data: {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;

    adminUserDetails: UserDetails;
    receiverUserDetails: UserDetails;
    latestMessageDetails: LatestMessageDetails;
  }
};

export type HomeParams = LayoutParamsType & {
  children: React.ReactNode;
  chatsCard: IndividualChatDetails | []
};
export type ViewSearchedPersonType = {
  _id: string;
  fullName: string;
  bio: string;
  lastMessage: string;
  lastMessageDate: string;
  email: string
};
export type GroupedMemberType = [
  {
    _id: string;
    fullName: string;
    bio: string;
    email: string
  }
];
export type SearchUserType = [
  {
    _id: string;
    fullName: string;
    bio: string;
    email: string
  }
];
export type GroupedUserType = {
  _id: string;
  fullName: string;
  from: string;
  lastMessage: string;
  lastMessageDate: string;
  bio: string;
  isGroup: boolean;
  admin: string;
  members: GroupedMemberType;
};
// authActionTypes.ts


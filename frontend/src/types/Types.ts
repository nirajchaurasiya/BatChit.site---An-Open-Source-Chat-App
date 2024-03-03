
interface UserDetails {
  _id: string;
  email: string;
  fullName: string;
  background: string
  bio: string
}

export type Chat = [{
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  latestMessageDetails: MessageDetails
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  adminUserDetails: UserDetails;
  userDetails: UserDetails[];
}]
export type SingleChat = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  latestMessageDetails: MessageDetails
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  adminUserDetails: UserDetails;
  userDetails: UserDetails[];
}

export type Messages = [{
  _id: string;
  sender: string;
  content: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  senderDetails: UserDetails;
  readByDetails: UserDetails[];
}]


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
};
interface MessageDetails {
  _id: string;
  sender: string;
  content: string;
  chat: string;
  readBy: {
    _id: string;
    email: string;
    fullName: string;
    background: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  senderDetails: {
    _id: string;
    email: string;
    fullName: string;
    background: string;
  };
}

export type MessageCardType = {
  data: {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    latestMessageDetails: MessageDetails
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    adminUserDetails: UserDetails;
    userDetails: UserDetails[];

  }
};
export type HomeParams = LayoutParamsType & {
  children: React.ReactNode;
  chatsCard: Chat | []
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
  }
];
export type SearchUserType = [
  {
    _id: string;
    fullName: string;
    bio: string;
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


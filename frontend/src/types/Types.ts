interface UserDetails {
  _id: string;
  email: string;
  fullName: string;
}

export type Chat = [{
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  latestMessage: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  adminUserDetails: UserDetails;
  userDetails: UserDetails[];
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

export type MessageCardType = {
  data: {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    latestMessage: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    adminUserDetails: UserDetails;
    userDetails: UserDetails[];
    background: string
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


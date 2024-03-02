import React, { createContext, useState } from "react";

type SearchUser = {
  id: string;
  name: string;
  bio: string;
};

export const SearchUserContext = createContext<{
  searchUser: SearchUser[];
  setSearchUser: React.Dispatch<React.SetStateAction<SearchUser[]>>;
} | null>(null);

const SearchUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchUser, setSearchUser] = useState<SearchUser[]>([]);
  const allValues = { searchUser, setSearchUser };
  return (
    <SearchUserContext.Provider value={allValues}>
      {children}
    </SearchUserContext.Provider>
  );
};

export default SearchUserProvider;

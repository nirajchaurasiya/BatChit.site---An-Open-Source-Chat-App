import axios from "axios";
import { usersBackendURL } from "../utils/usersBackendURL";

export const getSearchedResult = async (query: string) => {

  const searchUser = await axios.get(`${usersBackendURL}/search/${query}`)
  const { data } = searchUser.data
  return data
};

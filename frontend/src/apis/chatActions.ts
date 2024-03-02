import axios from "axios"
import { chatsBackendURL } from "../utils/usersBackendURL"

const default_code = 5000

export const getAllChatCards = async () => {
    const response = await axios.get(`${chatsBackendURL}/get-chats`)
    const { statusCode, data, success, code } = response.data

    if (statusCode === 200 && success) {
        return { success, data, code }
    }

    return { success: false, default_code }

}


export const addChat = async (fullName: string, _id: string) => {
    const access_Token = document.cookie.match('accessToken=')
    const details = {
        chatName: fullName,
        isGroupChat: false,
        users: [`${_id}`]
    }
    const res = await axios.post(`${chatsBackendURL}/create-chat`, details, {
        headers: {
            Authorization: `Bearer ${access_Token}`, // Set Authorization header with access token
        },
    })

    const { success, statusCode, data, code } = res.data

    if (success && statusCode === 200) return { success, data, code }

    return { success: false }
}
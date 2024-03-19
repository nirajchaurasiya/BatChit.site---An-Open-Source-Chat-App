import axios from "axios"
import { chatsBackendURL } from "../utils/usersBackendURL"

const default_code = 5000
const access_Token = document.cookie.match('accessToken=')
const Authorization = {
    headers: {
        Authorization: `Bearer ${access_Token}`,
    },
}

export const getAllChatCards = async () => {
    const response = await axios.get(`${chatsBackendURL}/individual/get-chats`, {
        headers: {
            Authorization: `Bearer ${access_Token}`, // Set Authorization header with access token
        },
    })
    const { statusCode, data, success, code } = response.data

    if (statusCode === 200 && success) {
        return { success, data, code }
    }

    return { success: false, default_code }

}

export const addChat = async (fullName: string, _id: string) => {
    const details = {
        chatName: fullName,
        isGroupChat: false,
        receiver: _id
    }
    const res = await axios.post(`${chatsBackendURL}/individual/create-chat`, details, Authorization)

    const { success, statusCode, data, code } = res.data

    if (success && statusCode === 200) return { success, data, code }

    return { success: false }
}

export const getAllMessagesWithId = async (chatId: string, pageNumber: Number) => {
    const allMessages = await axios.get(`${chatsBackendURL}/individual/get-sliced-messages/${chatId}/${pageNumber}`, Authorization)
    const { statusCode, success, code, } = allMessages.data
    const { messages, totalMessages } = allMessages?.data?.data
    if (success && statusCode === 200) {
        return { success, code, messages, totalMessages }
    }
    return { success: false, }
}

export const editMessage = async (messageId: string, content: string) => {
    try {
        const response = await axios.put(`${chatsBackendURL}/individual/editMessage/${messageId}`, { content: content })
        const { statusCode, success, code, data } = response.data
        if (statusCode === 200 && success) {
            return { success, data, code }
        }
        else {
            return { success: false }
        }
    } catch (error) {
        return { success: false }
    }
}
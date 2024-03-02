import axios from "axios"
import { usersBackendURL } from "./usersBackendURL"
import { getCurrentUser } from "./getCurrentUser"

type EMAIL_DATA_TYPES = "ACCOUNT_ACTIVATION"

// type, to
export const sendEmail = async (type: EMAIL_DATA_TYPES) => {
    try {
        const getUser = await getCurrentUser()
        const { success, statusCode, data } = getUser

        if (!success) {
            return { success: false, msg: 'Please try again!' }
        }
        if (success && statusCode === 200) {
            const response = await axios.post(`${usersBackendURL}/send-activation-email`, { type: type, email: data.email })
            console.log(response.data);
        }

    } catch (error: any) {
        return { success: false, msg: error?.message || 'Something went wrong' }
    }
}

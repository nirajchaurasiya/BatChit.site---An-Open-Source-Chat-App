import axios from "axios";

export const sendFileToServer = async (file: File) => {
    try {
        const fd = new FormData()
        fd.append('fileName', file.name);
        fd.append('imageData', file)
        const response = await axios.post(`http://localhost:4000/api/uploadImage`, fd);
        const { success, url }: { success: boolean, url: string } = response.data
        if (success) {
            return url
        }
        return null
    } catch (error) {
        return null
    }
};

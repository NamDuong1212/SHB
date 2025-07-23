import http from "./http";

export default class UploadChecking {
    static async checkUploadStatus() {
        try {
            const response = await http.get('/upload/status');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
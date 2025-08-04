import http from "@/service/http";

export default class AuthService {

     static async login(account, password) {
        try {
            const response = await http.post(`signin`, { account, password });
            if (!response.data || !response.data.info) {
                throw new Error('Đăng nhập thất bại: Dữ liệu trả về không hợp lệ.');
            }
            return response.data.info;

        } catch (error) {
            console.error("AuthService Login Error:", error);
            throw error;
        }
    }
    static async register(username, email, password) {
        try {
            const response = await http.post(`admin/auth/register`, { username, email, password });
            if (!response.data) {
                throw new Error('Đăng ký thất bại');
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async refreshToken() {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('Không có token để refresh');
        }

        try {
            const response = await http.post(`refresh-token`);
            if (!response.data) {
                throw new Error('Không thể làm mới token');
            }

            const data = response.data; 
            localStorage.setItem('auth_token', data.access_token);
            return data.access_token;
        } catch (error) {
            throw error;
        }
    }

    static async signout() {
        localStorage.removeItem('auth_token');
        // localStorage.removeItem('auth_user_id');
    }
}
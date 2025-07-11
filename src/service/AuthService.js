import http from "@/service/http";

export default class AuthService {

    static async login(username, password) {
        try {
            const response = await http.post(`login`, { username, password });
            if (!response.data) {
                throw new Error('Đăng nhập thất bại');
            }
            const data = response.data;
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('auth_user_id', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    }
    static async register(username, email, password) {
        try {
            const response = await http.post(`register`, { username, email, password });
            console.log(response);
            if (!response.data) {
                throw new Error('Đăng ký thất bại');
            }
            return response;
        } catch (error) {
            throw error;
        }
    }
    // Phương thức để refresh token (nếu có hỗ trợ)
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

            const data = await response.json();
            localStorage.setItem('auth_token', data.token);
            return data.token;
        } catch (error) {
            throw error;
        }
    }
    static async signout() {

    }
}

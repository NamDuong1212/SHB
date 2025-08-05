import http from "@/service/http";
import { useAuthStore } from '@/stores/useAuth';

export default class AuthService {
  static async login(account, password) {
    try {
      const response = await http.post(`signin`, { account, password });
      if (!response.data || !response.data.info) {
        throw new Error('Đăng nhập thất bại: Dữ liệu trả về không hợp lệ.');
      }
      
      const auth = useAuthStore();
      auth.login(response.data.info);
      
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
    const auth = useAuthStore();
    const refreshToken = auth.refresh_token;
    
    if (!refreshToken) {
      throw new Error('Không có refresh token');
    }

    try {
      const response = await http.post(`refresh-token`, {
        refresh_token: refreshToken
      });
      
      if (!response.data) {
        throw new Error('Không thể làm mới token');
      }

      const data = response.data;

      auth.updateTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token || refreshToken
      });
      
      return data.access_token;
    } catch (error) {
      auth.logout();
      throw error;
    }
  }

  static async signout() {
    const auth = useAuthStore();
    auth.logout();

    try {
      await http.post('signout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
  }
}

import { useAuthStore } from '@/stores/useAuth';
import axios from "axios";
const auth = useAuthStore();
const url = import.meta.env.VITE_APP_API;
// import authHeader from '../service/auth-header';

const http = axios.create({
  baseURL: url,
  // timeout: 300000,
});

http.interceptors.request.use(
  (config) => {
    if (!config.url?.includes('login') && !config.url?.includes('register')) {
      config.headers.Authorization = 'Bearer ' + auth.getToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        window.location.href = "/auth/login";
      } else if (status === 403) {
        window.location.href = "/auth/access";
      }

    } else {
      console.error("Lỗi không có response:", error);
    }
    return Promise.reject(error);
  }
);

export default http;

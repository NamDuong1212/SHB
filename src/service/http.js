import { useAuthStore } from '@/stores/useAuth';
import axios from "axios";
const url = import.meta.env.VITE_APP_API;

const http = axios.create({
  baseURL: url,
  // timeout: 300000,
});

http.interceptors.request.use((config) => {
  try {
    const auth = useAuthStore();
    const token = auth.getToken || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const currentPath = window.location.pathname;

      if (status === 401) {
        if (currentPath !== "/auth/login") {
          window.location.href = "/auth/login";
        }
      } else if (status === 403) {
        if (currentPath !== "/auth/access") {
          window.location.href = "/auth/access";
        }
      }
    } else {
      console.error("Lỗi không có response:", error);
    }
    return Promise.reject(error);
  }
);


export default http;

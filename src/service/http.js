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
    const token = auth.getToken(); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    const authDataString = localStorage.getItem('auth_data');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        if (authData.access_token) {
          config.headers.Authorization = `Bearer ${authData.access_token}`;
        }
      } catch (parseError) {
        console.error('Error parsing auth data from localStorage:', parseError);
      }
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
        // Clear auth data on 401
        const auth = useAuthStore();
        auth.logout();
        
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
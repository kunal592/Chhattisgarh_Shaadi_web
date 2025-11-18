import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  withCredentials: true, // ✅ REQUIRED for cookies + refresh
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔍 LOG outgoing requests
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log(
      '➡️ API Request:',
      config.method?.toUpperCase(),
      config.url,
      accessToken ? '(Authenticated)' : '(No Token)',
      config.data ? 'Payload:' : '',
      config.data || ''
    );

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔍 LOG responses + handle auto refresh
api.interceptors.response.use(
  (response) => {
    console.log('⬅️ API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error(
      '❌ API Error:',
      error.response?.status,
      error.config?.url,
      error.response?.data
    );

    const originalRequest = error.config;
    const { refreshToken, setAuth, logout, user } = useAuthStore.getState();

    // 🔁 Auto Refresh Access Token
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        if (user) {
          setAuth({ accessToken, refreshToken: newRefreshToken, user });
        }

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest); // retry request
      } catch (refreshError) {
        logout();

        if (typeof window !== 'undefined') {
          const locale = window.location.pathname.split('/')[1] || 'en';
          window.location.href = `/${locale}/login`;
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

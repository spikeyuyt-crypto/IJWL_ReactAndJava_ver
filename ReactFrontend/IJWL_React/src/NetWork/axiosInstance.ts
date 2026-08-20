import axios from 'axios';
import { useUserStatusStore } from '../stores/useUserStatusStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const publicAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = useUserStatusStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => { return response },

  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await publicAxiosInstance.post('/users/refresh');

        const newAccessToken = response.data.data;

        useUserStatusStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        useUserStatusStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
)

export default axiosInstance;

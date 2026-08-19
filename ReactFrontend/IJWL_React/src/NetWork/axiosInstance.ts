import axios from 'axios';
import { useUserStatusStore } from '../stores/useUserStatusStore';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
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
        const response = await axios.post('http://localhost:8080/users/refresh', {}, { withCredentials: true });

        const newAccessToken = response.data.data;

        useUserStatusStore.getState().setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        useUserStatusStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
  }
)

export default axiosInstance;
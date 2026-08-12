import axios from 'axios';
import { useUserStatusStore } from '../stores/useUserStatusStore';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = useUserStatusStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

export default axiosInstance;
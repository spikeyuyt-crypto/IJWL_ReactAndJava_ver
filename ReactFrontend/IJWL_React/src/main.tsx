import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, Spin, theme } from 'antd';
import "./css/globalCss.css";
import router from './router/index';
import { useUserStatusStore } from './stores/useUserStatusStore';
import axios from 'axios';
import { useEffect, useState } from 'react';
import axiosInstance from './NetWork/axiosInstance';

const themeColorMap: Record<string, string> = {
  violet: '#7C3AED',
  blue: '#3B82F6',
  green: '#10B981',
  orange: '#F59E0B',
};

function AuthInitializer() {
  const accessToken = useUserStatusStore(
    (state) => state.accessToken
  );

  const login = useUserStatusStore(
    (state) => state.login
  );

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 启动流程
  useEffect(() => {
    async function restoreLogin() {
      try {

        let currentAccessToken = accessToken;
        if (!currentAccessToken) {
          const refreshResponse = await axios.post(
            'http://localhost:8080/users/refresh',
            {},
            {
              withCredentials: true,
            }
          );
          
          currentAccessToken = refreshResponse.data.data;

          if (!currentAccessToken) {
            return;
          }

          useUserStatusStore
            .getState()
            .setAccessToken(currentAccessToken);
        }

        const response = await axiosInstance.get(
          '/users/getUserInfoByAccessToken'
        );

        const user = response.data.data;

        login({
          userId: Number(user.userId),
          userName: user.userName,
          backgroundColor: user.backgroundColor,
          fontSize: user.fontSize,
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }

      } finally {
        setIsAuthLoading(false);
      }
    }

    restoreLogin();
  }, []);

  if (isAuthLoading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return null;
}

function AppProvider() {
  const darkMode = useUserStatusStore((state) => state.darkMode);

  const savedTheme = useUserStatusStore(
    (state) => state.user?.backgroundColor
  );

  const themeColor =
    themeColorMap[savedTheme ?? 'violet'] ?? '#7C3AED';

  return (
    <>
      <AuthInitializer />

      <ConfigProvider
        theme={{
          algorithm: darkMode
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,

          token: {
            colorPrimary: themeColor,
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>
);
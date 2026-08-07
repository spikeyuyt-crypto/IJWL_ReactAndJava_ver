import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import "./css/globalCss.css";
import router from './router/index';
import { useUserStatusStore } from './stores/useUserStatusStore';

const themeColorMap: Record<string, string> = {
  violet: '#7C3AED',
  blue: '#3B82F6',
  green: '#10B981',
  orange: '#F59E0B',
};

function AppProvider() {
  const darkMode = useUserStatusStore((state) => state.darkMode);

  const savedTheme = useUserStatusStore(
    (state) => state.user?.backgroundColor
  );

  const themeColor =
    themeColorMap[savedTheme ?? 'violet'] ?? '#7C3AED';

  return (
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
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>
);

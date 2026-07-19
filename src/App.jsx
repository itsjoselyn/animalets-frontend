import './App.css';
import AppRouter from './router/AppRouter';
import { ConfigProvider } from 'antd';
import esES from 'antd/locale/es_ES'; // Optional: Set locale to Spanish

export default function App() {
  return (
    <ConfigProvider
      locale={esES}
      theme={{
        // 1. Override global tokens (Design Tokens)
        token: {
          colorPrimary: '#4caf50', // The Animalets green
          colorLink: '#4caf50',
          borderRadius: 8, // Soften the corners slightly
          fontFamily: "'DM Sans', sans-serif", // Match your existing font
        },
        // 2. Override component specific tokens (Optional)
        components: {
          Button: {
            colorPrimary: '#4caf50',
            algorithm: true, // Enables the dynamic algorithm to calculate hover/active states
          },
          Input: {
            colorBorder: 'rgba(76, 175, 80, 0.2)', // Match your green-tinted borders
            colorPrimary: '#4caf50',
            activeShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)',
          },
          Modal: {
            colorBgElevated: '#ffffff',
          }
        },
      }}
    >
      <AppRouter />
    </ConfigProvider>)
};
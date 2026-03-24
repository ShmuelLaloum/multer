import { ConfigProvider, theme } from "antd";
import ObjectDetails from "./pages/ObjectDetails";
import "./index.module.css";

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#6c5ce7",
          colorBgContainer: "#1c1c2e",
          colorBgElevated: "#1c1c2e",
          colorBorder: "rgba(255, 255, 255, 0.06)",
          colorText: "#e8e8f0",
          colorTextSecondary: "#8888a0",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          borderRadius: 8,
        },
      }}
    >
      <ObjectDetails />
    </ConfigProvider>
  );
}

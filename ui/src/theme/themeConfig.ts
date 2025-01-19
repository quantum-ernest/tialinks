import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#7C3AED",
    colorLink: "#7C3AED",
    borderRadius: 8,
    fontFamily: "Inter, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 50,
    },
    Menu: {
      itemSelectedColor: "#7C3AED",
      itemHeight: 80,
      fontSize: 15,
    },
    Layout: {
      bodyBg: "#f0f2f5",
      headerBg: "#fff",
      siderBg: "#fff",
    },
    Card: {
      borderRadius: 12,
      colorBgContainer: "#fff",
    },
  },
};

export default themeConfig;

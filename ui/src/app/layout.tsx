import { Inter } from "next/font/google";
import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import themeConfig from "@/theme/themeConfig";
import { AuthProvider } from "@/hooks/Auth";
import { NotificationProvider } from "@/utils/notifications";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          <AuthProvider>
            <ConfigProvider theme={themeConfig}>
              <AntdRegistry>{children}</AntdRegistry>
            </ConfigProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}

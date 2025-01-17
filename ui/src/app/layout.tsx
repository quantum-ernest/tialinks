import { Inter } from 'next/font/google'
import { ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import themeConfig from '@/theme/themeConfig'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider theme={themeConfig}>
            <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  )
}

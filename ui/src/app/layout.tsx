import { Inter } from 'next/font/google'
import { ConfigProvider } from 'antd'
import themeConfig from './theme/themeConfig'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>TiaLinks - Open Source URL Shortener</title>
        <meta name="description" content="TiaLinks is an open-source, powerful, and easy-to-use URL shortener for developers and businesses." />
      </head>
      <body className={inter.className}>
        <ConfigProvider theme={themeConfig}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}

'use client'

import { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  BarChartOutlined,
  LinkOutlined,
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons'
import Link from 'next/link'

const { Header, Sider, Content } = Layout

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="p-4">
          <h1 className="text-white text-xl font-bold">TiaLinks</h1>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link href="/dashboard">Overview</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<LinkOutlined />}>
            <Link href="/dashboard/links">Links</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<BarChartOutlined />}>
            <Link href="/dashboard/analytics">Analytics</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<TeamOutlined />}>
            <Link href="/dashboard/team">Team</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<SettingOutlined />}>
            <Link href="/dashboard/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </Header>
        <Content className="m-4 p-4 bg-white rounded-lg">
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

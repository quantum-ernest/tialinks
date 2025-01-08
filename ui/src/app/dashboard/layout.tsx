'use client'

import {useState} from 'react'
import {Layout, Menu, Input, Avatar, Typography} from 'antd'
import {
    DashboardOutlined,
    BarChartOutlined,
    SettingOutlined,
    LinkOutlined,
    UserOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import {MdOutlineCampaign} from "react-icons/md";
import {ImQrcode} from "react-icons/im";
import {getUserObject} from "@/utils/auth";

const {Header, Sider, Content} = Layout
const {Search} = Input
const {Text} = Typography

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    const [collapsed, setCollapsed] = useState(false)
    const userObject = getUserObject()
    const userData = userObject? JSON.parse(userObject): null

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                style={{background: '#fff'}}
                width={250}
            >
                <div className="p-4">
                    <Text strong className="text-xl text-purple-600">TiaLinks</Text>
                </div>
                <Menu
                    theme="light"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={[
                        {
                            key: '1',
                            icon: <DashboardOutlined/>,
                            label: <Link href="/dashboard">Dashboard</Link>,
                        },
                        {
                            key: '2',
                            icon: <LinkOutlined/>,
                            label: <Link href="/dashboard/links">Links</Link>,
                        },
                        {
                            key: '3',
                            icon: <BarChartOutlined/>,
                            label: <Link href="/dashboard/analytics">Analytics</Link>,
                        },
                        {
                            key: '4',
                            icon: <MdOutlineCampaign/>,
                            label: <Link href="/dashboard/campaigns">Campaigns</Link>,
                        },
                        {
                            key: '5',
                            icon: <ImQrcode />,
                            label: <Link href="/dashboard/qrcodes">QR Codes</Link>,
                        },
                        {
                            key: '6',
                            icon: <SettingOutlined/>,
                            label: <Link href="/dashboard/settings">Settings</Link>,
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{
                    padding: '0 16px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Search
                        placeholder="Search or paste URL"
                        style={{width: 300, marginLeft: 20}}
                    />
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Avatar icon={<UserOutlined/>} style={{backgroundColor: '#7C3AED'}}/>
                        <Text style={{marginLeft: 8}}>{userData? userData?.name: userData?.email}</Text>
                    </div>
                </Header>
                <Content style={{margin: '24px 16px', padding: 24, background: '#fff', borderRadius: 8}}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}

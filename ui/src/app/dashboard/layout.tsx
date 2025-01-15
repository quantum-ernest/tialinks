"use client"
import React, {useState, useEffect} from 'react';
import {Layout, Menu, Button, Avatar, Typography, Spin} from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DashboardOutlined,
    LinkOutlined,
    BarChartOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {MdOutlineCampaign} from 'react-icons/md';
import {ImQrcode} from 'react-icons/im';
import {usePathname} from 'next/navigation';
import Link from "next/link";
import {getUserObject, logout} from "@/utils/auth";
import {CiLogout} from "react-icons/ci";
import {useRouter} from "next/navigation";
import {useAuth} from "@/hooks/Auth";
const {Header, Sider, Content} = Layout;
const {Text} = Typography;

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);

    return matches;
}

export default function DashboardLayout({children,}: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);

    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const pathname = usePathname();
    const router = useRouter();
    const {isAuthenticated, checkAuth, setIsAuthenticated} = useAuth();
    useEffect(() => {
        checkAuth();
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        setCollapsed(isSmallScreen);
    }, [isSmallScreen, isAuthenticated]);

    const userObject = getUserObject()
    const userData = userObject ? JSON.parse(userObject) : null
    const toggleSider = () => {
        setCollapsed(!collapsed);
    };

    const handleMenuClick = () => {
        if (isSmallScreen) {
            setCollapsed(true);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        logout()
        router.push('/')
    }

    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined/>,
            label: <Link href="/dashboard">Dashboard</Link>
        },
        {
            key: 'links',
            icon: <LinkOutlined/>,
            label: <Link href="/dashboard/links">Links</Link>,
        },
        {
            key: 'analytics',
            icon: <BarChartOutlined/>,
            label: <Link href="/dashboard/analytics">Analytics</Link>,
        },
        {
            key: 'campaigns',
            icon: <MdOutlineCampaign/>,
            label: <Link href="/dashboard/campaigns">Campaigns</Link>,
        },
        {
            key: 'qrcodes',
            icon: <ImQrcode/>,
            label: <Link href="/dashboard/qrcodes">QR Codes</Link>,
        },
        {
            key: 'settings',
            icon: <SettingOutlined/>,
            label: <Link href="/dashboard/settings">Settings</Link>,
        },
    ];

    return (
        <>
            {!isAuthenticated ? (<Spin size="large" fullscreen/>) :
                <Layout style={{minHeight: '100vh'}}>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        breakpoint="md"
                        collapsedWidth={isSmallScreen ? 0 : 80}
                        style={{
                            overflow: 'auto',
                            position: 'fixed',
                            insetInlineStart: 0,
                            scrollbarWidth: 'thin',
                            scrollbarGutter: 'stable',
                            background: '#fff',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 1001,
                            transition: 'all 0.2s',
                            boxShadow: isSmallScreen ? '2px 0 8px rgba(0,0,0,0.15)' : 'none',
                        }}
                        width={200}
                    >
                        <div style={{
                            height: '64px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#7C3AED',
                        }}>
                            <Link
                                href='/'
                                style={{
                                color: '#fff',
                                margin: 0,
                                fontSize: collapsed && !isSmallScreen ? '24px' : '28px',
                                transition: 'all 0.2s',
                            }}>
                                {collapsed && !isSmallScreen ? 'TL' : 'TiaLinks'}
                            </Link>
                        </div>
                        <Menu
                            theme="light"
                            mode="inline"
                            selectedKeys={[pathname.split('/')[2] || 'dashboard']}
                            items={menuItems}
                            onClick={() => handleMenuClick()}
                            style={{borderRight: 0}}
                        />

                        <Button
                            icon={<CiLogout/>}
                            type='primary'
                            onClick={handleLogout}
                            style={{
                                margin: 0,
                                fontSize: '18px',
                                marginTop: '50px',
                                marginLeft: '16px'
                            }}>
                            {collapsed && !isSmallScreen ? '' : 'Logout'}
                        </Button>
                    </Sider>
                    <Layout style={{marginInlineStart: isSmallScreen ? 'auto' : !collapsed ? 190 : 70}}>
                        <Header style={{
                            padding: '0 16px',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1000,
                            width: '100%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                                onClick={toggleSider}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Avatar icon={<UserOutlined/>} style={{backgroundColor: '#7C3AED'}}/>
                                <Text style={{marginLeft: 8}}>{userData ? userData?.name : userData?.email}</Text>
                            </div>
                        </Header>
                        <Content style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            borderRadius: 8,
                            minHeight: 280,
                        }}>
                            {children}
                        </Content>
                    </Layout>
                    {isSmallScreen && !collapsed && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.45)',
                                zIndex: 1000,
                            }}
                            onClick={toggleSider}
                        />
                    )}
                </Layout>
            }
        </>
    );
}


'use client'

import {useState} from 'react'
import {
    Layout,
    Tooltip,
    Typography,
    Input,
    Button,
    Card,
    Row,
    Col,
    Statistic,
    Space,
    Divider,
    Dropdown,
    message,
    MenuProps, Flex
} from 'antd'
import {
    GithubOutlined,
    LinkOutlined,
    CheckCircleOutlined,
    ThunderboltOutlined,
    LockOutlined,
    UserOutlined,
    DownOutlined,
    LineChartOutlined,
    TeamOutlined,
    QrcodeOutlined,
    ApiOutlined,
    GlobalOutlined,
    DashboardOutlined, CheckOutlined, CopyOutlined
} from '@ant-design/icons'
import '@/app/styles/custom.css'
import {SiOpensourceinitiative} from "react-icons/si";
import {MdOutlineDashboardCustomize, MdOutlineInsights} from "react-icons/md";
import {GrSecure} from "react-icons/gr";
import {TbBrandOpenSource} from "react-icons/tb";

const {Header, Content, Footer} = Layout
const {Title, Paragraph, Text, Link} = Typography
export default function Home() {
    const [url, setUrl] = useState('')
    const [shortUrl, setShortUrl] = useState('')
    const [copied, setCopied] = useState(false)
    const [pendingUrl, setPendingUrl] = useState('')

    const access_token = localStorage.getItem('access_token')
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        message.success('URL copied to clipboard!')
        setTimeout(() => setCopied(false), 3000) // Reset copied state after 3 seconds
    }
    const handleShorten = async () => {
        if (access_token) {
            try {
                console.log(access_token)
                const response = await fetch(apiUrl + '/api/link', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`,
                    },
                    body: JSON.stringify({original_url: url})
                })
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = await response.json()
                setShortUrl(`https://tialinks.com/${data.shortcode}`)
            } catch (error) {
                message.error('Failed to shorten link')
            }
        } else {
            setPendingUrl(url)
            window.location.href = '/login'


        }
    }
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        alert('Click on menu item.',);
        console.log('click', e);
    };
    const items: MenuProps['items'] = [
        {
            label: 'Login/Signup',
            key: 'login',
        },
        {
            label: 'Dashboard',
            key: 'dashboard',
        }
    ]

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (
        <Layout className="min-h-screen">
            <Header className="tialinks-header">
                <Row justify="space-between" align="middle" style={{height: '100%'}}>
                    <Col>
                        <Title level={3} style={{margin: 0, color: '#7C3AED'}}>TiaLinks</Title>
                    </Col>
                    <Col>
                        <Space size="large">
                            <Button type="link" style={{color: '#4B5563'}}>Donate</Button>
                            <Button type="link" style={{color: '#4B5563'}}>API</Button>
                            <Dropdown menu={menuProps}>
                                <Button>
                                    <Space>
                                        <UserOutlined/>
                                        Account
                                    </Space>
                                </Button>
                            </Dropdown>
                            <Button
                                type="primary"
                                icon={<GithubOutlined/>}
                                href="https://github.com/quantum-ernest/tialinks"
                                target="_blank"
                                style={{background: '#7C3AED'}}
                            >
                                Star on GitHub
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Header>

            <Content>
                <div className="tialinks-hero">
                    <Row align="middle" className="w-full max-w-7xl mx-auto">
                        <Col xs={24} lg={12}>
                            <Title style={{fontSize: '48px', marginBottom: '24px', color: '#1F2937'}}>
                                Simplify Your Links with TiaLinks
                            </Title>
                            <Paragraph style={{fontSize: '18px', marginBottom: '32px', color: '#4B5563'}}>
                                An open-source, powerful, and easy-to-use URL shortener for developers and businesses.
                                Track engagement and analyze link performance effortlessly!
                            </Paragraph>
                            <Card
                                style={{
                                    background: 'white',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                                }}
                            >
                                <Input.Search
                                    placeholder="Enter your long URL here"
                                    enterButton="Shorten URL"
                                    addonBefore={<LinkOutlined/>}
                                    size="large"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onSearch={handleShorten}
                                    style={{marginBottom: shortUrl ? '16px' : 0}}
                                />
                                {shortUrl && (
                                    <div style={{marginTop: '16px'}}>
                                        <Title level={4}>Your shortened URL:</Title>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            background: '#F9FAFB',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            marginBottom: '16px'
                                        }}>
                                            <Tooltip title={copied ? "Copied!" : "Click to copy"} placement="top">
                                                <Text style={{
                                                    color: '#7C3AED',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                                      onClick={(e) => {
                                                          e.preventDefault()
                                                          handleCopy()
                                                      }}>
                                                    {shortUrl}
                                                    {copied && <CheckOutlined style={{color: '#10B981'}}/>}
                                                </Text>
                                            </Tooltip>
                                            <Button
                                                type={copied ? "default" : "primary"}
                                                icon={copied ? <CheckOutlined/> : <CopyOutlined/>}
                                                onClick={handleCopy}
                                                style={{
                                                    background: copied ? '#10B981' : '#7C3AED',
                                                    borderColor: copied ? '#10B981' : '#7C3AED',
                                                    color: 'white'
                                                }}
                                            >
                                                {copied ? 'Copied!' : 'Copy'}
                                            </Button>
                                        </div>
                                        <Link href="/dashboard">
                                            <Button
                                                type="default"
                                                icon={<DashboardOutlined/>}
                                                block
                                                style={{
                                                    height: '40px',
                                                    background: '#F3F4F6',
                                                    borderColor: '#E5E7EB',
                                                    color: '#4B5563',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                className="dashboard-button"
                                            >
                                                View Analytics in Dashboard
                                            </Button>
                                        </Link>
                                    </div>
                                )
                                }
                            </Card>
                        </Col>
                        <Col xs={24} lg={12} style={{marginTop: '16px'}}>
                            <img
                                src="image.jpg?height=400&width=400"
                                alt="TiaLinks"
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    margin: '0 auto',
                                    display: 'block',
                                    borderRadius: '12px',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                                }}
                            />
                        </Col>
                    </Row>
                </div>

                <div style={{padding: '80px 0', background: 'white'}}>
                    <div className="max-w-7xl mx-auto px-4">
                        <Title level={2} style={{textAlign: 'center', marginBottom: '64px', color: '#1F2937'}}>
                            Why Choose TiaLinks?
                        </Title>
                        <Row>
                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <LinkOutlined
                                        style={{fontSize: '48px', color: '#7C3AED', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>
                                        URL Shortening
                                    </Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        Create concise, shareable links instantly. Our advanced algorithm ensures unique
                                        and efficient short URLs.
                                    </Paragraph>
                                </Card>
                            </Col>

                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <LineChartOutlined
                                        style={{fontSize: '48px', color: '#10B981', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>
                                        Detailed Analytics
                                    </Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        Gain insights with detailed click analytics and user engagement, including
                                        geographic data, referral sources, etc.
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <QrcodeOutlined
                                        style={{fontSize: '48px', color: '#2C3E50', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>
                                        QR Code Generation
                                    </Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>Automatically generate QR
                                        codes for your shortened links, perfect for print materials and contactless
                                        sharing.
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <ApiOutlined
                                        style={{fontSize: '48px', color: '#1ABC9C', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>
                                        API Access
                                    </Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>Integrate TiaLinks into your
                                        applications with our robust and well-documented API.
                                    </Paragraph>
                                </Card>
                            </Col>

                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <GrSecure style={{fontSize: '48px', color: '#95A5A6', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>Secure &
                                        Reliable</Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        Built with security in mind. Your data is safe and your links are always
                                        accessible.
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <MdOutlineInsights
                                        style={{fontSize: '48px', color: '#F59E0B', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>
                                        User-Based Insights
                                    </Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        See how your links perform across different audiences. </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <TeamOutlined
                                        style={{fontSize: '48px', color: '#FF6F61', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>
                                        Team Collaboration
                                    </Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        Work together seamlessly with team management features and shared link
                                        workspaces. </Paragraph>
                                </Card>
                            </Col>

                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <GlobalOutlined
                                        style={{fontSize: '48px', color: '#3B82F6', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>
                                        Custom Domains
                                    </Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        Use your own domain for branded short links, enhancing trust and recognition
                                        with your audience.(not available!!) </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <TbBrandOpenSource
                                        style={{fontSize: '48px', color: '#FF6F61', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>Free to
                                        Use</Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        Built with security in mind. Your data is safe and your links are always
                                        accessible.
                                    </Paragraph>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div>
                    <Row justify='center'>
                        <Title style={{fontSize: '48px', marginBottom: '24px', color: '#1F2937'}}>
                            Join the Community
                        </Title>
                    </Row>
                    <Flex justify="space-around" align='center'>
                        <Row justify='center'>
                            <Col xs={24} md={12}>
                                <Paragraph style={{fontSize: '18px', marginBottom: '32px', color: '#4B5563'}}>
                                    TiaLinks is open-source and thrives on contributions from passionate developers.
                                </Paragraph>
                                <Text type="secondary">Explore the <Link
                                    href="https://github.com/quantum-ernest/tialinks"
                                    target="_blank">GitHub Repository.</Link></Text>
                            </Col>
                            <Col xs={24} md={12}>
                                <Paragraph style={{fontSize: '18px', marginBottom: '32px', color: '#4B5563'}}>
                                    Report issues, suggest features, or submit pull requests. </Paragraph>
                                <Paragraph style={{fontSize: '18px', marginBottom: '32px', color: '#4B5563'}}>
                                    Built with transparency and collaboration in mind. </Paragraph>
                            </Col>
                        </Row>
                    </Flex>
                </div>
            </Content>

            <Footer className="tialinks-footer">
                <div className="max-w-7xl mx-auto px-4">
                    <Space direction="vertical" size="large" style={{width: '100%', textAlign: 'center'}}>
                        <Space split={<Divider type="vertical"/>} size="large">
                            <Button type="link" style={{color: '#4B5563'}}>Terms of Service</Button>
                            <Button type="link" style={{color: '#4B5563'}}>Privacy Policy</Button>
                            <Button type="link" style={{color: '#4B5563'}}>Contact Us</Button>
                        </Space>
                        <Space size="large">
                            <Text>Built with ❤️ by the open-source community.</Text>
                            <a href="https://github.com/quantum-ernest/tialinks" target="_blank"
                               rel="noopener noreferrer">
                                <GithubOutlined style={{fontSize: '24px', color: '#4B5563'}}/>
                            </a>
                        </Space>
                        <div style={{color: '#6B7280'}}>©2024 TiaLinks. All rights reserved.</div>
                    </Space>
                </div>
            </Footer>
        </Layout>
    )
}

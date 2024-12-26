'use client'

import {useState} from 'react'
import {
    Layout,
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
    UserOutlined, DownOutlined, LineChartOutlined, TeamOutlined
} from '@ant-design/icons'
import './styles/custom.css'
import {SiOpensourceinitiative} from "react-icons/si";
import {MdOutlineDashboardCustomize, MdOutlineInsights} from "react-icons/md";
import {GrSecure} from "react-icons/gr";
import {TbBrandOpenSource} from "react-icons/tb";

const {Header, Content, Footer} = Layout
const {Title, Paragraph, Text, Link} = Typography

export default function Home() {
    const [url, setUrl] = useState('')
    const [shortUrl, setShortUrl] = useState('')

    const handleShorten = () => {
        setShortUrl(`https://tialinks.com/${Math.random().toString(36).substr(2, 6)}`)
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
                            <Button type="link" style={{color: '#4B5563'}}>Features</Button>
                            <Button type="link" style={{color: '#4B5563'}}>About</Button>
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
                                            borderRadius: '8px'
                                        }}>
                                            <a href={shortUrl} target="_blank" rel="noopener noreferrer"
                                               style={{color: '#7C3AED'}}>
                                                {shortUrl}
                                            </a>
                                            <Button
                                                type="primary"
                                                onClick={() => navigator.clipboard.writeText(shortUrl)}
                                                style={{background: '#7C3AED'}}
                                            >
                                                Copy
                                            </Button>
                                        </div>
                                    </div>
                                )}
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
                                    <LineChartOutlined
                                        style={{fontSize: '48px', color: '#10B981', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>
                                        Detailed Analytics
                                    </Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        Track clicks, user engagement, and geographical trends.
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <MdOutlineDashboardCustomize
                                        style={{fontSize: '48px', color: '#10B981', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>
                                        Custom Branding
                                    </Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        Create links that reflect your brand identity.
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
                                    <ThunderboltOutlined
                                        style={{fontSize: '48px', color: '#F59E0B', marginBottom: '24px'}}/>
                                    <Title level={3} style={{marginBottom: '16px', color: '#1F2937'}}>Lightning
                                        Fast</Title>
                                    <Paragraph style={{color: '#6B7280', fontSize: '16px'}}>
                                        Optimized for speed. Shorten URLs instantly and enjoy rapid redirects.
                                    </Paragraph>
                                </Card>
                            </Col>
                            <Col xs={24} md={8} style={{padding: '10px'}}>
                                <Card className="tialinks-feature-card">
                                    <GrSecure style={{fontSize: '48px', color: '#3B82F6', marginBottom: '24px'}}/>
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
                                    <TbBrandOpenSource
                                        style={{fontSize: '48px', color: '#3B82F6', marginBottom: '24px'}}/>
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

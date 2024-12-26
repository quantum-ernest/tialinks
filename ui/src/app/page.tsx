'use client'

import { useState } from 'react'
import { Layout, Typography, Input, Button, Card, Row, Col, Statistic, Space, Divider } from 'antd'
import { GithubOutlined, LinkOutlined, CheckCircleOutlined, ThunderboltOutlined, LockOutlined } from '@ant-design/icons'
import './styles/custom.css'

const { Header, Content, Footer } = Layout
const { Title, Paragraph } = Typography

export default function Home() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')

  const handleShorten = () => {
    setShortUrl(`https://tialinks.com/${Math.random().toString(36).substr(2, 6)}`)
  }

  return (
    <Layout>
      <Header className="tialinks-header" style={{ background: '#fff', padding: '0 50px' }}>
        <Row justify="space-between" align="middle" style={{ height: '100%' }}>
          <Col>
            <Title level={3} style={{ margin: 0, color: '#7C3AED' }}>TiaLinks</Title>
          </Col>
          <Col>
            <Space>
              <Button type="link">Features</Button>
              <Button type="link">About</Button>
              <Button type="link">API</Button>
              <Button type="primary" icon={<GithubOutlined />} href="https://github.com/yourusername/tialinks" target="_blank">
                Star on GitHub
              </Button>
            </Space>
          </Col>
        </Row>
      </Header>
      <Content>
        <div className="tialinks-hero" style={{ padding: '60px 50px' }}>
          <Row gutter={[32, 32]} align="middle">
            <Col xs={24} md={12}>
              <Title>Simplify Your Links with TiaLinks</Title>
              <Paragraph style={{ fontSize: 18 }}>
                An open-source, powerful, and easy-to-use URL shortener for developers and businesses.
              </Paragraph>
              <Card style={{ background: '#f0f0f0', borderColor: '#d9d9d9' }}>
                <Input.Search
                  placeholder="Enter your long URL here"
                  enterButton="Shorten URL"
                  size="large"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onSearch={handleShorten}
                />
                {shortUrl && (
                  <div style={{ marginTop: 16 }}>
                    <Title level={4}>Your shortened URL:</Title>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: 8, borderRadius: 4 }}>
                      <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#7C3AED' }}>
                        {shortUrl}
                      </a>
                      <Button type="primary" onClick={() => navigator.clipboard.writeText(shortUrl)}>
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <img src="/placeholder.svg?height=400&width=400" alt="TiaLinks Illustration" style={{ width: '100%', maxWidth: 400, borderRadius: 8, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
            </Col>
          </Row>
        </div>

        <div style={{ padding: '60px 50px', background: '#fff' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>Why Choose TiaLinks?</Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="tialinks-feature-card">
                <CheckCircleOutlined style={{ fontSize: 48, color: '#10B981', marginBottom: 16 }} />
                <Title level={3}>Open Source</Title>
                <Paragraph>
                  Fully transparent and customizable. Contribute to our GitHub repository and make it your own.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="tialinks-feature-card">
                <ThunderboltOutlined style={{ fontSize: 48, color: '#FBBF24', marginBottom: 16 }} />
                <Title level={3}>Lightning Fast</Title>
                <Paragraph>
                  Optimized for speed. Shorten URLs instantly and enjoy rapid redirects.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="tialinks-feature-card">
                <LockOutlined style={{ fontSize: 48, color: '#3B82F6', marginBottom: 16 }} />
                <Title level={3}>Secure & Reliable</Title>
                <Paragraph>
                  Built with security in mind. Your data is safe and your links are always accessible.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        <div style={{ padding: '60px 50px', background: '#f7f7f7' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>TiaLinks in Numbers</Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card className="tialinks-stats-card">
                <Statistic title="URLs Shortened" value={1000000} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="tialinks-stats-card">
                <Statistic title="Active Users" value={50000} />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="tialinks-stats-card">
                <Statistic title="GitHub Stars" value={1500} />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer className="tialinks-footer" style={{ textAlign: 'center', padding: '24px 50px' }}>
        <Space direction="vertical" size="large">
          <Space split={<Divider type="vertical" />}>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Contact Us</a>
          </Space>
          <Space>
            <a href="https://github.com/yourusername/tialinks" target="_blank" rel="noopener noreferrer">
              <GithubOutlined style={{ fontSize: 24 }} />
            </a>
            <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">
              <LinkOutlined style={{ fontSize: 24 }} />
            </a>
          </Space>
          <div>©2023 TiaLinks. All rights reserved.</div>
        </Space>
      </Footer>
    </Layout>
  )
}

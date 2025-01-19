"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Input,
  Layout,
  Menu,
  Modal,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import {
  ApiOutlined,
  CheckOutlined,
  CopyOutlined,
  DashboardOutlined,
  GithubOutlined,
  GlobalOutlined,
  LineChartOutlined,
  LinkedinOutlined,
  LinkOutlined,
  MenuOutlined,
  QrcodeOutlined,
  TeamOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "@/app/styles/custom.css";
import { MdOutlineInsights } from "react-icons/md";
import { GrSecure } from "react-icons/gr";
import { TbBrandOpenSource } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { setPendingUrl } from "@/utils/pendingUrl";
import { useLinks } from "@/hooks/Links";
import { useNotification } from "@/utils/notifications";
import { useAuthContext } from "@/hooks/Auth";
import { LinkType } from "@/schemas/Link";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import TermsOfService from "@/components/TermsOfService";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text, Link } = Typography;
export default function Home() {
  const { isAuthenticated, checkAuth, setIsAuthenticated, logout } =
    useAuthContext();
  const [url, setUrl] = useState<string | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const { createLink } = useLinks();
  const router = useRouter();
  const { openNotification } = useNotification();
  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    }
  };

  const handleShorten = async () => {
    if (isAuthenticated && url) {
      try {
        const newLink: LinkType | undefined = await createLink(url);
        if (newLink) {
          setShortUrl(newLink.generated_url);
        }
      } catch (error) {
        if (error instanceof Error) {
          openNotification("error", error.message);
        } else {
          openNotification("error", "Unknown error occurred");
          console.log(error);
        }
      }
    } else {
      if (url) {
        setPendingUrl(url);
      }
      router.push("/login");
    }
  };
  const handleMenuClick = (key: string) => {
    switch (key) {
      case "dashboard":
        router.push("/dashboard");
        break;
      case "api":
        router.push("/api");
        break;
      case "donate":
        window.open("#", "_blank");
        break;
      case "login":
        router.push("/login");
        break;
      case "logout":
        logout();
        setIsAuthenticated(false);
        break;
      default:
        break;
    }
  };

  const menuItems = [
    {
      key: "donate",
      label: "Donate",
      onClick: () => handleMenuClick("donate"),
    },
    { key: "api", label: "API", onClick: () => handleMenuClick("api") },
    {
      key: "account",
      label: "Account",
      children: isAuthenticated
        ? [
            {
              label: "Dashboard",
              key: "dashboard",
              onClick: () => handleMenuClick("dashboard"),
            },
            {
              label: "Logout",
              key: "logout",
              onClick: () => handleMenuClick("logout"),
            },
          ]
        : [
            {
              label: "Login/Signup",
              key: "login",
              onClick: () => handleMenuClick("login"),
            },
          ],
    },
  ];
  const [selectedModelView, setSelectedModelView] = useState<string | null>(
    null,
  );
  const [isModelVisible, setIsModalVisible] = useState(false);
  const handleShowModal = (page: string) => {
    setSelectedModelView(page);
    setIsModalVisible(true);
  };
  return (
    <>
      <Layout>
        <Header className="tialinks-header">
          <Row
            justify="space-between"
            align="middle"
            style={{ height: "100%" }}
          >
            <Col>
              <Title level={3} style={{ margin: 0, color: "#7C3AED" }}>
                TiaLinks
              </Title>
            </Col>
            <Col className="desktop-menu">
              <Space size={[16, 8]} wrap>
                <Button
                  type="link"
                  onClick={() => handleMenuClick("donate")}
                  style={{ color: "#4B5563", padding: "4px 8px" }}
                >
                  Donate
                </Button>
                <Button
                  type="link"
                  onClick={() => handleMenuClick("api")}
                  style={{ color: "#4B5563", padding: "4px 8px" }}
                >
                  API
                </Button>
                <Dropdown
                  menu={{
                    items: menuItems.find((item) => item.key === "account")
                      ?.children,
                  }}
                >
                  <Button style={{ padding: "4px 8px" }}>
                    <Space>
                      <UserOutlined />
                      Account
                    </Space>
                  </Button>
                </Dropdown>

                <Button
                  type="primary"
                  icon={<GithubOutlined />}
                  href="https://github.com/quantum-ernest/tialinks"
                  target="_blank"
                  style={{ background: "#7C3AED", padding: "4px 8px" }}
                >
                  Star on GitHub
                </Button>
              </Space>
            </Col>
            <Col className="mobile-menu-toggle">
              <Button
                type="text"
                onClick={toggleMobileMenu}
                icon={<MenuOutlined />}
              />
            </Col>
          </Row>
          {mobileMenuVisible && (
            <div className="mobile-menu">
              <Menu mode="inline" items={menuItems} />
              <Button
                type="primary"
                icon={<GithubOutlined />}
                href="https://github.com/quantum-ernest/tialinks"
                target="_blank"
                style={{
                  background: "#7C3AED",
                  margin: "16px 0",
                  width: "100%",
                }}
              >
                Star on GitHub
              </Button>
            </div>
          )}
        </Header>
        <Content>
          <div className="tialinks-hero">
            <Row align="middle" className="w-full max-w-7xl mx-auto">
              <Col xs={24} lg={12}>
                <Title
                  style={{
                    fontSize: "48px",
                    marginBottom: "24px",
                    color: "#1F2937",
                  }}
                >
                  Simplify Your Links with TiaLinks
                </Title>
                <Paragraph
                  style={{
                    fontSize: "18px",
                    marginBottom: "32px",
                    color: "#4B5563",
                  }}
                >
                  An open-source, powerful, and easy-to-use URL shortener for
                  developers and businesses. Track engagement and analyze link
                  performance effortlessly!
                </Paragraph>
                <Card
                  style={{
                    background: "white",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Input.Search
                    placeholder="Enter your long URL here"
                    enterButton
                    addonBefore={<LinkOutlined />}
                    size="large"
                    value={url ?? ""}
                    onChange={(e) => setUrl(e.target.value)}
                    onSearch={handleShorten}
                    style={{ marginBottom: shortUrl ? "16px" : 0 }}
                  />
                  {shortUrl && (
                    <div style={{ marginTop: "16px" }}>
                      <Title level={4}>Your shortened URL:</Title>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background: "#F9FAFB",
                          padding: "12px",
                          borderRadius: "8px",
                          marginBottom: "16px",
                        }}
                      >
                        <Tooltip
                          title={copied ? "Copied!" : "Click to copy"}
                          placement="top"
                        >
                          <Text
                            style={{
                              color: "#7C3AED",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              handleCopy();
                            }}
                          >
                            {shortUrl}
                            {copied && (
                              <CheckOutlined style={{ color: "#10B981" }} />
                            )}
                          </Text>
                        </Tooltip>
                        <Button
                          type={copied ? "default" : "primary"}
                          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                          onClick={handleCopy}
                          style={{
                            background: copied ? "#10B981" : "#7C3AED",
                            borderColor: copied ? "#10B981" : "#7C3AED",
                            color: "white",
                          }}
                        >
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <Link href="/dashboard">
                        <Button
                          type="default"
                          icon={<DashboardOutlined />}
                          block
                          style={{
                            height: "40px",
                            background: "#F3F4F6",
                            borderColor: "#E5E7EB",
                            color: "#4B5563",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.3s ease",
                          }}
                          className="dashboard-button"
                        >
                          View Analytics in Dashboard
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </Col>
              <Col xs={24} lg={12} style={{ marginTop: "16px" }}>
                <img
                  src="image.jpg?height=400&width=400"
                  alt="TiaLinks"
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    margin: "0 auto",
                    display: "block",
                    borderRadius: "12px",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                />
              </Col>
            </Row>
          </div>
          <div style={{ padding: "80px 0", background: "white" }}>
            <div className="max-w-7xl mx-auto px-4">
              <Title
                level={2}
                style={{
                  textAlign: "center",
                  marginBottom: "64px",
                  color: "#1F2937",
                }}
              >
                Why Choose TiaLinks?
              </Title>
              <Row>
                <Col xs={24} md={8} style={{ padding: "10px" }}>
                  <Card className="tialinks-feature-card">
                    <LinkOutlined
                      style={{
                        fontSize: "48px",
                        color: "#7C3AED",
                        marginBottom: "24px",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ marginBottom: "16px", color: "#1F2937" }}
                    >
                      URL Shortening
                    </Title>
                    <Paragraph style={{ color: "#6B7280", fontSize: "16px" }}>
                      Create concise, shareable links instantly. Our advanced
                      algorithm ensures unique and efficient short URLs.
                    </Paragraph>
                  </Card>
                </Col>

                <Col xs={24} md={8} style={{ padding: "10px" }}>
                  <Card className="tialinks-feature-card">
                    <LineChartOutlined
                      style={{
                        fontSize: "48px",
                        color: "#10B981",
                        marginBottom: "24px",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ marginBottom: "16px", color: "#1F2937" }}
                    >
                      Detailed Analytics
                    </Title>
                    <Paragraph style={{ color: "#6B7280", fontSize: "16px" }}>
                      Gain insights with detailed click analytics and user
                      engagement, including geographic data, referral sources,
                      etc.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8} style={{ padding: "10px" }}>
                  <Card className="tialinks-feature-card">
                    <QrcodeOutlined
                      style={{
                        fontSize: "48px",
                        color: "#2C3E50",
                        marginBottom: "24px",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ marginBottom: "16px", color: "#1F2937" }}
                    >
                      QR Code Generation
                    </Title>
                    <Paragraph style={{ color: "#6B7280", fontSize: "16px" }}>
                      Automatically generate QR codes for your shortened links,
                      perfect for print materials and contactless sharing.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8} style={{ padding: "10px" }}>
                  <Card className="tialinks-feature-card">
                    <ApiOutlined
                      style={{
                        fontSize: "48px",
                        color: "#1ABC9C",
                        marginBottom: "24px",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ marginBottom: "16px", color: "#1F2937" }}
                    >
                      API Access
                    </Title>
                    <Paragraph style={{ color: "#6B7280", fontSize: "16px" }}>
                      Integrate TiaLinks into your applications with our robust
                      and well-documented API.
                    </Paragraph>
                  </Card>
                </Col>

                <Col xs={24} md={8} style={{ padding: "10px" }}>
                  <Card className="tialinks-feature-card">
                    <GrSecure
                      style={{
                        fontSize: "48px",
                        color: "#95A5A6",
                        marginBottom: "24px",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ marginBottom: "16px", color: "#1F2937" }}
                    >
                      Secure & Reliable
                    </Title>
                    <Paragraph style={{ color: "#6B7280", fontSize: "16px" }}>
                      Built with security in mind. Your data is safe and your
                      links are always accessible.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8} style={{ padding: "10px" }}>
                  <Card className="tialinks-feature-card">
                    <MdOutlineInsights
                      style={{
                        fontSize: "48px",
                        color: "#F59E0B",
                        marginBottom: "24px",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ marginBottom: "16px", color: "#1F2937" }}
                    >
                      User-Based Insights
                    </Title>
                    <Paragraph style={{ color: "#6B7280", fontSize: "16px" }}>
                      See how your links perform across different audiences.{" "}
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8} style={{ padding: "10px" }}>
                  <Card className="tialinks-feature-card">
                    <TeamOutlined
                      style={{
                        fontSize: "48px",
                        color: "#FF6F61",
                        marginBottom: "24px",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ marginBottom: "16px", color: "#1F2937" }}
                    >
                      Team Collaboration
                    </Title>
                    <Paragraph style={{ color: "#6B7280", fontSize: "16px" }}>
                      Work together seamlessly with team management features and
                      shared link workspaces.{" "}
                    </Paragraph>
                  </Card>
                </Col>

                <Col xs={24} md={8} style={{ padding: "10px" }}>
                  <Card className="tialinks-feature-card">
                    <GlobalOutlined
                      style={{
                        fontSize: "48px",
                        color: "#3B82F6",
                        marginBottom: "24px",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ marginBottom: "16px", color: "#1F2937" }}
                    >
                      Custom Domains
                    </Title>
                    <Paragraph style={{ color: "#6B7280", fontSize: "16px" }}>
                      Use your own domain for branded short links, enhancing
                      trust and recognition with your audience.(not available!!){" "}
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8} style={{ padding: "10px" }}>
                  <Card className="tialinks-feature-card">
                    <TbBrandOpenSource
                      style={{
                        fontSize: "48px",
                        color: "#FF6F61",
                        marginBottom: "24px",
                      }}
                    />
                    <Title
                      level={3}
                      style={{ marginBottom: "16px", color: "#1F2937" }}
                    >
                      Free to Use
                    </Title>
                    <Paragraph style={{ color: "#6B7280", fontSize: "16px" }}>
                      Built with security in mind. Your data is safe and your
                      links are always accessible.
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
          <div className="join-community-section">
            <Row justify="center">
              <Col xs={24} sm={20} md={18} lg={16} xl={14}>
                <Title level={2} className="join-community-title">
                  Join the Community
                </Title>
              </Col>
            </Row>
            <Row justify="center" gutter={[24, 24]}>
              <Col xs={24} sm={20} md={18} lg={8} xl={7}>
                <Space
                  direction="vertical"
                  size="large"
                  className="join-community-content"
                >
                  <Paragraph>
                    TiaLinks is open-source and thrives on contributions from
                    passionate developers.
                  </Paragraph>
                  <Text type="secondary">
                    Explore the{" "}
                    <a
                      href="https://github.com/quantum-ernest/tialinks"
                      target="_blank"
                    >
                      GitHub Repository.
                    </a>
                  </Text>
                </Space>
              </Col>
              <Col xs={24} sm={20} md={18} lg={8} xl={7}>
                <Space
                  direction="vertical"
                  size="large"
                  className="join-community-content"
                >
                  <Paragraph>
                    Report issues, suggest features, or submit pull requests.
                  </Paragraph>
                  <Paragraph>
                    Built with transparency and collaboration in mind.
                  </Paragraph>
                </Space>
              </Col>
            </Row>
            <Divider style={{ borderColor: "#E5E7EB" }} />
          </div>
        </Content>
        <Footer className="tialinks-footer">
          <div className="max-w-7xl mx-auto px-4">
            <Row gutter={[16, 24]} justify="space-between" align="top">
              <Col xs={24} sm={12} md={8}>
                <Title
                  level={4}
                  style={{ color: "#4B5563", marginBottom: "16px" }}
                >
                  TiaLinks
                </Title>
                <Paragraph style={{ color: "#6B7280" }}>
                  An open-source, powerful, and easy-to-use URL shortener for
                  developers and businesses.
                </Paragraph>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Title
                  level={5}
                  style={{ color: "#4B5563", marginBottom: "16px" }}
                >
                  Quick Links
                </Title>
                <Space direction="vertical" size="middle">
                  <Button
                    type="link"
                    onClick={() => handleShowModal("terms_of_service")}
                    style={{ color: "#4B5563", padding: "0" }}
                  >
                    Terms of Service
                  </Button>
                  <Button
                    type="link"
                    onClick={() => handleShowModal("privacy_policy")}
                    style={{ color: "#4B5563", padding: "0" }}
                  >
                    Privacy Policy
                  </Button>
                </Space>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Title
                  level={5}
                  style={{ color: "#4B5563", marginBottom: "16px" }}
                >
                  Connect with Us
                </Title>
                <Space size="large" wrap>
                  <a
                    href="https://github.com/quantum-ernest/tialinks"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubOutlined
                      style={{ fontSize: "24px", color: "#4B5563" }}
                    />
                  </a>
                  <TwitterOutlined
                    style={{ fontSize: "24px", color: "#4B5563" }}
                  />
                  <LinkedinOutlined
                    style={{ fontSize: "24px", color: "#4B5563" }}
                  />
                </Space>
              </Col>
            </Row>
            <Divider style={{ borderColor: "#E5E7EB" }} />
            <Row justify="space-between" align="middle">
              <Col xs={24} sm={12} style={{ textAlign: "center" }}>
                <a
                  href="https://github.com/quantum-ernest/"
                  target="_blank"
                  style={{ color: "#6B7280" }}
                >
                  Built with ❤️ by Ernest Kwabena Asare.
                </a>
              </Col>
              <Col xs={24} sm={12}>
                <Text style={{ color: "#6B7280" }}>
                  © 2024 TiaLinks. All rights reserved.
                </Text>
              </Col>
            </Row>
          </div>
        </Footer>
        <Modal
          centered
          open={isModelVisible}
          onCancel={() => setIsModalVisible(false)}
          okButtonProps={{ style: { display: "none" } }}
        >
          {selectedModelView === "privacy_policy" ? (
            <PrivacyPolicy />
          ) : (
            <TermsOfService />
          )}
        </Modal>
      </Layout>
    </>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import {
  Card,
  Col,
  Layout,
  Row,
  Spin,
  Statistic,
  Table,
  Typography,
} from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "@/hooks/Dashboard";
import animatedClickIcon from "../../assets/icons/click-Animation.json";
import animatedLinkIcon from "../../assets/icons/link-Animation.json";
import animatedGraphIcon from "../../assets/icons/graph-Animation.json";
import animatedIncreaseIcon from "../../assets/icons/increase-Animation.json";
import Lottie from "lottie-react";
import { useAuthContext } from "@/hooks/Auth";

import { useNotification } from "@/utils/notifications";

const { Content } = Layout;
const { Title } = Typography;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Dashboard() {
  const { isAuthenticated, checkAuth } = useAuthContext();
  const { loading, dashboardData, fetchDashboardData } = useDashboard();
  const { openNotification } = useNotification();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const _fetchData = async () => {
      checkAuth();
      if (isAuthenticated) {
        await fetchDashboardData();
        if (!intervalRef.current) {
          intervalRef.current = setInterval(fetchDashboardData, 5000);
        }
      }
    };

    _fetchData().catch((error) => {
      openNotification("error", error);
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated]);
  return (
    <>
      {!isAuthenticated ? (
        <Spin size="large" fullscreen />
      ) : (
        <Layout>
          <Content style={{ padding: "16px" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card>
                  <Row justify="center" gutter={[16, 16]}>
                    <Col
                      xs={24}
                      sm={24}
                      md={6}
                      lg={6}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Statistic
                        title="Total Links"
                        prefix={
                          <Lottie
                            animationData={animatedLinkIcon}
                            style={{ height: "1.5em", width: "2em" }}
                          />
                        }
                        value={dashboardData?.total_links}
                      />
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={6}
                      lg={6}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Statistic
                        title="Total Clicks"
                        value={dashboardData?.total_clicks}
                        prefix={
                          <Lottie
                            animationData={animatedClickIcon}
                            style={{ height: "1.5em", width: "2em" }}
                          />
                        }
                      />
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={6}
                      lg={6}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Statistic
                        title="Average Clicks per Link"
                        value={dashboardData?.average_clicks}
                        precision={2}
                        prefix={
                          <Lottie
                            animationData={animatedGraphIcon}
                            style={{ height: "1.5em", width: "2em" }}
                          />
                        }
                      />
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={6}
                      lg={6}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Statistic
                        title="Link Click Percentage"
                        value={dashboardData?.link_click_percentage}
                        valueStyle={{ color: "#3f8600" }}
                        prefix={
                          <Lottie
                            animationData={animatedIncreaseIcon}
                            style={{ height: "1.5em", width: "2em" }}
                          />
                        }
                        suffix="%"
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Card>
                  <Title level={4}>Top Performing Links</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData?.top_performing_links}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="shortcode" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="click_count" fill="#82ca9d" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Card>
                  <Title level={4}>Traffic Sources</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData?.top_referring_site.map(
                          (items) => ({
                            ...items,
                            name: items.domain,
                          }),
                        )}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="click_count"
                        label
                      >
                        {dashboardData?.top_referring_site.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Card>
                  <Title level={4}>Top performing Campaigns</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData?.top_referring_campaign.map(
                          (items) => ({
                            ...items,
                            name: items.campaign,
                          }),
                        )}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="click_count"
                        label
                      >
                        {dashboardData?.top_device.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Card>
                  <Title level={4}>Top Locations</Title>
                  <Table
                    dataSource={dashboardData?.top_country.slice(0, 5)}
                    style={{ height: 300 }}
                    loading={loading}
                    columns={[
                      {
                        title: "Country",
                        dataIndex: "country",
                        key: "country",
                      },
                      {
                        title: "Clicks",
                        dataIndex: "click_count",
                        key: "click_count",
                        sorter: (a, b) => a.click_count - b.click_count,
                      },
                    ]}
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col span={24}>
                <Card>
                  <Title level={4}>Click Trends</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData?.monthly_click_trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="click_count"
                        stroke="#8884d8"
                        name="Clicks"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Card>
                  <Title level={4}>Peak Click Times</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData?.monthly_click_trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="click_count" fill="#8884d8" name="Clicks" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Card>
                  <Title level={4}>Clicks by Device</Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData?.top_device.map((items) => ({
                          ...items,
                          name: items.device,
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="click_count"
                        label
                      >
                        {dashboardData?.top_device.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      )}
    </>
  );
}

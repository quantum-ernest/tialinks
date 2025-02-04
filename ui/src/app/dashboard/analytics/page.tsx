"use client";

import React, { useEffect, useState } from "react";
import type { TabsProps } from "antd";
import {
  Card,
  Col,
  DatePicker,
  Layout,
  Row,
  Select,
  Spin,
  Statistic,
  Table,
  Tabs,
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
import { useAnalytics } from "@/hooks/Analytics";
import { useLinks } from "@/hooks/Links";
import dayjs from "dayjs";
import GeographicalMap from "@/components/GeograhicalMap";
import { TopPerformingLinksType } from "@/schemas/Analytics";
import { useAuthContext } from "@/hooks/Auth";
import { useNotification } from "@/utils/notifications";
import { useSearchParams } from "next/navigation";

const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
  "#8dd1e1",
];
const dateFormat = "YYYY-MM-DDTHH:mm:ss";
const EnhancedAnalytics: React.FC = () => {
  const { linkData, fetchLinks } = useLinks();
  const [selectedLink, setSelectedLink] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const { fetchAnalytics, loading, analyticsData } = useAnalytics();
  const { checkAuth, isAuthenticated } = useAuthContext();
  const { openNotification } = useNotification();
  const searchParams = useSearchParams();
  const [queryLinkID, setQueryLinkID] = useState<number | null>(
    Number(searchParams.get("link_id")),
  );
  useEffect(() => {
    const _fetchData = async () => {
      checkAuth();
      if (isAuthenticated) {
        const start_date = dateRange ? dateRange[0] : "2024-12-01T00:00:00";
        const end_date = dateRange
          ? dateRange[1]
          : dayjs(new Date().setFullYear(new Date().getFullYear() + 1)).format(
              dateFormat,
            );
        if (selectedLink) {
          await fetchAnalytics(start_date, end_date, selectedLink);
        } else if (queryLinkID) {
          await fetchAnalytics(start_date, end_date, queryLinkID);
        } else {
          await fetchAnalytics(start_date, end_date);
        }
        await fetchLinks();
      }
    };
    _fetchData().catch((error) => {
      openNotification("error", error);
    });
  }, [selectedLink, queryLinkID, dateRange, isAuthenticated]);

  const handleLinkOnClear = () => {
    setQueryLinkID(0);
    setSelectedLink(null);
  };
  const topPerformingColumns = [
    {
      title: "Short Url",
      dataIndex: "generated_url",
      key: "generated_url",
      render: (text: string) => (
        <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">
          {text?.length > 50 ? text.slice(0, 50) + "..." : text}
        </a>
      ),
    },
    {
      title: "Original URL",
      dataIndex: "original_url",
      key: "original_url",
      render: (text: string) => (
        <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">
          {text?.length > 50 ? text.slice(0, 50) + "..." : text}
        </a>
      ),
    },
    {
      title: "Clicks",
      dataIndex: "click_count",
      key: "click_count",
      sorter: (a: TopPerformingLinksType, b: TopPerformingLinksType) =>
        a.click_count - b.click_count,
    },
    { title: "Campaign", dataIndex: "campaign", key: "campaign" },
  ];

  const geographicalDataColumns = [
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Clicks",
      key: "click_count",
      dataIndex: "click_count",
    },
  ];
  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Link Performance",
      children: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Title level={4}>Top Performing Links</Title>
              <Table
                dataSource={analyticsData?.top_performing_links.slice(0, 10)}
                columns={topPerformingColumns}
                loading={loading}
                scroll={{ x: "max-content" }}
                pagination={false}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} span={12}>
            <Card>
              <Title level={4}>Campaign Performance</Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData?.referring_campaigns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="campaign" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="click_count" fill="#8884d8" name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Traffic Analytics",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Card>
              <Title level={4}>Referred Traffic</Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData?.referring_sites.map((item) => ({
                      ...item,
                      name: item.domain,
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="click_count"
                    name="Clicks"
                    label
                  >
                    {analyticsData?.referring_sites.map((entry, index) => (
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
              <Title level={4}>Traffic Campaigns</Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData?.referring_campaigns}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="click_count"
                    name="Clicks"
                    label
                  >
                    {analyticsData?.referring_campaigns.map((entry, index) => (
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
      ),
    },
    {
      key: "3",
      label: "Technology",
      children: (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8} lg={8}>
            <Card>
              <Title level={4}>Devices</Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData?.devices.map((item) => ({
                      ...item,
                      name: item.device,
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="click_count"
                    name="Clicks"
                    label
                  >
                    {analyticsData?.devices.map((entry, index) => (
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
          <Col xs={24} sm={24} md={8} lg={8}>
            <Card>
              <Title level={4}>Browsers</Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData?.browsers.map((item) => ({
                      ...item,
                      name: item.browser,
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="click_count"
                    name="Clicks"
                    label
                  >
                    {analyticsData?.browsers.map((entry, index) => (
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
          <Col xs={24} sm={24} md={8} lg={8}>
            <Card>
              <Title level={4}>Operating Systems</Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData?.operating_systems.map((item) => ({
                      ...item,
                      name: item.operating_system,
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="click_count"
                    name="Clicks"
                    label
                  >
                    {analyticsData?.operating_systems.map((entry, index) => (
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
      ),
    },
    {
      key: "4",
      label: "Time Analytics",
      children: (
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Title level={4}>Click Trends Over Time</Title>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData?.monthly_click_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="click_count" />
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
      ),
    },
    {
      key: "5",
      label: "Geographical Analytics",
      children: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} lg={6}>
              <Card>
                <Title level={4}>Top Continent</Title>
                <Table
                  dataSource={analyticsData?.geographical_data.continents.slice(
                    0,
                    5,
                  )}
                  style={{ height: 325 }}
                  columns={geographicalDataColumns}
                  pagination={false}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6}>
              <Card>
                <Title level={4}>Top Countries</Title>
                <Table
                  dataSource={analyticsData?.geographical_data.countries.slice(
                    0,
                    5,
                  )}
                  style={{ height: 325 }}
                  columns={geographicalDataColumns}
                  pagination={false}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6}>
              <Card>
                <Title level={4}>Top Regions</Title>
                <Table
                  dataSource={analyticsData?.geographical_data.regions.slice(
                    0,
                    5,
                  )}
                  style={{ height: 325 }}
                  columns={geographicalDataColumns}
                  pagination={false}
                />
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={6}>
              <Card>
                <Title level={4}>Top City</Title>
                <Table
                  dataSource={analyticsData?.geographical_data.cities.slice(
                    0,
                    5,
                  )}
                  style={{ height: 325 }}
                  columns={geographicalDataColumns}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
          <GeographicalMap value={analyticsData?.geographical_data ?? null} />
        </>
      ),
    },
  ];
  return (
    <>
      {!isAuthenticated ? (
        <Spin size="large" fullscreen />
      ) : (
        <Layout>
          <Content style={{ padding: "20px" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card>
                  <Row gutter={[16, 16]} justify="space-between">
                    <Col xs={24} sm={24} md={8} lg={8}>
                      <Select
                        style={{ width: "100%" }}
                        defaultValue={queryLinkID ? queryLinkID : null}
                        placeholder="Select a link"
                        allowClear
                        onClear={handleLinkOnClear}
                        onChange={(value) => setSelectedLink(value)}
                      >
                        {linkData?.map((link) => (
                          <Select.Option key={link.id} value={link.id}>
                            {link.generated_url}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                      <RangePicker
                        style={{ width: "100%" }}
                        showNow
                        format={dateFormat}
                        minDate={dayjs("2024-12-01", dateFormat)}
                        onChange={(value, dateString) => {
                          setDateRange(dateString);
                        }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              <Col xs={24} sm={24} md={6} lg={6}>
                <Card style={{ display: "flex", justifyContent: "center" }}>
                  <Statistic
                    title="Total Clicks"
                    value={analyticsData?.total_clicks}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6}>
                <Card style={{ display: "flex", justifyContent: "center" }}>
                  <Statistic
                    title="Unique Links"
                    value={analyticsData?.total_links}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6}>
                <Card style={{ display: "flex", justifyContent: "center" }}>
                  <Statistic
                    title="Avg Clicks/Active Link"
                    value={analyticsData?.average_clicks_per_active_link}
                    precision={2}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6}>
                <Card style={{ display: "flex", justifyContent: "center" }}>
                  <Statistic
                    title="Active Campaigns"
                    value={analyticsData?.referring_campaigns.length}
                  />
                </Card>
              </Col>
            </Row>
            <Tabs
              defaultActiveKey="1"
              style={{ marginTop: "16px" }}
              items={tabItems}
            />
          </Content>
        </Layout>
      )}
    </>
  );
};

export default EnhancedAnalytics;

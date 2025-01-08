'use client'

import React, {useState, useEffect} from 'react';
import {Layout, Row, Col, Card, Table, Typography, Select, DatePicker, Tabs, Statistic} from 'antd';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Treemap
} from 'recharts';
import {useAnalytics} from "@/hooks/Analytics";
import {useLinks} from "@/hooks/Links";
import dayjs from 'dayjs';
import GeographicalMap from "@/components/GeograhicalMap";


const {Content} = Layout;
const {Title} = Typography;
const {RangePicker} = DatePicker;
const {TabPane} = Tabs;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];
const dateFormat = 'YYYY-MM-DDTHH:mm:ss'
const EnhancedAnalytics: React.FC = () => {
    const {linkData,} = useLinks();
    const [selectedLink, setSelectedLink] = useState<number | null>(null);
    const [dateRange, setDateRange] = useState<[string, string] | null>(null);
    const {contextHolder, fetchAnalytics, loading, analyticsData} = useAnalytics();
    const defaultStartDate = "2024-12-01T00:00:00"
    const defaultEndDate = dayjs(new Date().setFullYear(new Date().getFullYear() + 1)).format(dateFormat);
    useEffect(() => {
        fetchAnalytics(defaultStartDate, defaultEndDate);
        const start_date = dateRange ? dateRange[0] : defaultStartDate;
        const end_date = dateRange ? dateRange[1] : defaultEndDate;
        if (selectedLink) {
            fetchAnalytics(start_date, end_date, selectedLink);
        } else {
            fetchAnalytics(defaultStartDate, defaultEndDate);
        }
    }, [selectedLink, dateRange]);

    const topPerformingColumns = [
        {title: 'Shortcode', dataIndex: 'shortcode', key: 'shortcode'},
        {title: 'Original URL', dataIndex: 'original_url', key: 'original_url'},
        {
            title: 'Clicks',
            dataIndex: 'click_count',
            key: 'click_count',
            sorter: (a, b) => a.click_counnt - b.click_count,
        },
        {title: 'Campaign', dataIndex: 'campaign', key: 'campaign'},
    ]

    const geographicalDataColumns = [
        {title: 'Continent', dataIndex: 'continent', key: 'continent'},
        {title: 'Country', dataIndex: 'country', key: 'country'},
        {title: 'Region', dataIndex: 'region', key: 'region'},
        {title: 'City', dataIndex: 'city', key: 'city'},
        {
            title: 'Clicks',
            dataIndex: 'click_count',
            key: 'click_count',
            sorter: (a, b) => a.clicks - b.clicks
        },
    ]
    return (
        <>
            {contextHolder}
            <Layout>
                <Content style={{padding: '20px'}}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card>
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Select
                                            style={{width: '100%'}}
                                            placeholder="Select a link"
                                            onChange={(value) => setSelectedLink(value)}
                                        >
                                            {linkData?.map((link) => (
                                                <Select.Option key={link.id} value={link.id}>
                                                    {link.shortcode} - {link.original_url}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col span={8}>
                                        <RangePicker
                                            style={{width: '100%'}}
                                            showNow
                                            format={dateFormat}
                                            minDate={dayjs('2024-12-01', dateFormat)}
                                            onChange={(value, dateString) => {
                                                setDateRange(dateString)
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{marginTop: '20px'}}>
                        <Col span={6}>
                            <Card>
                                <Statistic title="Total Clicks" value={analyticsData?.total_clicks}/>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic title="Unique Links" value={analyticsData?.total_links}/>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic
                                    title="Average Clicks per Link"
                                    value={analyticsData?.average_click_per_link}
                                    precision={2}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <Statistic title="Active Campaigns" value={analyticsData?.referring_campaigns.length}/>
                            </Card>
                        </Col>
                    </Row>

                    <Tabs defaultActiveKey="1" style={{marginTop: '20px'}}>
                        <TabPane tab="Link Performance" key="1">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Card>
                                        <Title level={4}>Top Performing Links</Title>
                                        <Table
                                            dataSource={analyticsData?.top_performing_links.slice(0, 10)}
                                            columns={topPerformingColumns}
                                            pagination={false}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card>
                                        <Title level={4}>Campaign Performance</Title>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={analyticsData?.referring_campaigns}>
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis dataKey="campaign"/>
                                                <YAxis/>
                                                <Tooltip/>
                                                <Bar dataKey="click_count" fill="#8884d8"/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="Traffic Analysis" key="2">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Card>
                                        <Title level={4}>Referred Traffic</Title>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={analyticsData?.referring_sites.map((item) => ({
                                                        ...item,
                                                        name: item.domain
                                                    }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="click_count"
                                                    label
                                                >
                                                    {analyticsData?.referring_sites.map((entry, index) => (
                                                        <Cell key={`cell-${index}`}
                                                              fill={COLORS[index % COLORS.length]}/>
                                                    ))}
                                                </Pie>
                                                <Tooltip/>
                                                <Legend/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card>
                                        <Title level={4}>Traffic Mediums</Title>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={mockData.mediums}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label
                                                >
                                                    {mockData.mediums.map((entry, index) => (
                                                        <Cell key={`cell-${index}`}
                                                              fill={COLORS[index % COLORS.length]}/>
                                                    ))}
                                                </Pie>
                                                <Tooltip/>
                                                <Legend/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="Technology" key="3">
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Card>
                                        <Title level={4}>Devices</Title>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={analyticsData?.devices.map((item) => ({
                                                        ...item,
                                                        name: item.device
                                                    }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="click_count"
                                                    label
                                                >
                                                    {mockData.devices.map((entry, index) => (
                                                        <Cell key={`cell-${index}`}
                                                              fill={COLORS[index % COLORS.length]}/>
                                                    ))}
                                                </Pie>
                                                <Tooltip/>
                                                <Legend/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card>
                                        <Title level={4}>Browsers</Title>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={analyticsData?.browsers.map((item) => ({
                                                        ...item,
                                                        name: item.browser
                                                    }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="click_count"
                                                    label
                                                >
                                                    {mockData.browsers.map((entry, index) => (
                                                        <Cell key={`cell-${index}`}
                                                              fill={COLORS[index % COLORS.length]}/>
                                                    ))}
                                                </Pie>
                                                <Tooltip/>
                                                <Legend/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card>
                                        <Title level={4}>Operating Systems</Title>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={analyticsData?.operating_systems.map((item) => ({
                                                        ...item,
                                                        name: item.operating_system
                                                    }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="click_count"
                                                    label
                                                >
                                                    {mockData.operatingSystems.map((entry, index) => (
                                                        <Cell key={`cell-${index}`}
                                                              fill={COLORS[index % COLORS.length]}/>
                                                    ))}
                                                </Pie>
                                                <Tooltip/>
                                                <Legend/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="Geographical Data" key="4">
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Card>
                                        <Title level={4}>Top Locations</Title>
                                        <Table
                                            dataSource={analyticsData?.geographical_data}
                                            columns={geographicalDataColumns}
                                            pagination={false}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card>
                                        <Title level={4}>Geographical Distribution</Title>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <Treemap
                                                data={analyticsData?.geographical_data}
                                                dataKey="click_count"
                                                aspectRatio={4 / 3}
                                                stroke="#fff"
                                                fill="#8884d8"
                                            >
                                                <Tooltip/>
                                            </Treemap>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="Time Analysis" key="5">
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Card>
                                        <Title level={4}>Click Trends Over Time</Title>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={analyticsData?.monthly_click_trend}>
                                                <CartesianGrid strokeDasharray="3 3"/>
                                                <XAxis dataKey="click_count"/>
                                                <YAxis/>
                                                <Tooltip/>
                                                <Legend/>
                                                <Line type="monotone" dataKey="click_count" stroke="#8884d8"/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tab="Domain & Path Analysis" key="6">
                            <GeographicalMap geographicalData={analyticsData?.geographical_data}/>
                        </TabPane>
                    </Tabs>
                </Content>
            </Layout>
        </>

    );
};

export default EnhancedAnalytics;

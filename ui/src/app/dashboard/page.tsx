'use client'

import React, {useEffect} from 'react';
import {Layout, Row, Col, Card, Table, Typography, Statistic, Spin} from 'antd';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import {useDashboard} from "@/hooks/Dashboard";

const {Header, Content} = Layout;
const {Title, Text} = Typography;
import animatedClickIcon from "../../assets/icons/click-Animation.json";
import animatedLinkIcon from "../../assets/icons/link-Animation.json";
import animatedGraphIcon from "../../assets/icons/graph-Animation.json";
import Lottie from "lottie-react";
import {useAuth} from "@/hooks/Auth";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
    const {checkAuth, isAuthenticated} = useAuth();
    const {loading, dashboardData, fetchData, contextHolder} = useDashboard();

    useEffect(() => {
        const isValid = checkAuth();
        if (isValid) {
            fetchData();
            const interval = setInterval(() => {
                fetchData();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, []);

    const peakClickDate = dashboardData?.monthly_click_trend[0]?.month;
    let peakClickDay = ""
    let peakClickMonth = ""
    if (peakClickDate) {
        const peakClickDateNew = new Date(peakClickDate?.split('.')[0]).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
        console.log(peakClickDateNew);
        peakClickDay = peakClickDateNew.substring(0, 2);
        peakClickMonth = peakClickDateNew.substring(peakClickDateNew.indexOf(' '), peakClickDateNew.indexOf(' ', peakClickDateNew.indexOf(' ') + 1))
    }
    return (
        <>
            {contextHolder}
            {!isAuthenticated ? (<Spin size="large" fullscreen/>) :
                <Layout>
                    <Header style={{background: '#fff', padding: '0 20px'}}>
                        <Title level={2}>Link Performance Dashboard</Title>
                    </Header>
                    <Content style={{padding: '20px'}}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Statistic
                                                title="Total Links"
                                                prefix={<Lottie animationData={animatedLinkIcon}
                                                                style={{height: '70px', width: '70px'}}/>}
                                                value={dashboardData?.total_links}/>
                                        </Col>
                                        <Col span={8}>

                                            <Statistic
                                                title="Total Clicks"
                                                value={dashboardData?.total_clicks}
                                                prefix={<Lottie animationData={animatedClickIcon}
                                                                style={{height: '70px', width: '70px'}}/>}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic
                                                title="Average Clicks per Link"
                                                value={dashboardData?.average_clicks_per_link}
                                                precision={2}
                                                prefix={<Lottie animationData={animatedGraphIcon}
                                                                style={{height: '70px', width: '70px'}}/>}

                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]} style={{marginTop: '20px'}}>
                            <Col span={12}>
                                <Card>
                                    <Title level={4}>Top Performing Links</Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={dashboardData?.top_performing_links}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="shortcode"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Bar dataKey="click_count" fill="#82ca9d"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card>
                                    <Title level={4}>Traffic Sources</Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={dashboardData?.top_referring_site.map(items => ({
                                                    ...items,
                                                    name: items.domain
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="click_count"
                                                label
                                            >
                                                {dashboardData?.top_referring_site.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                                ))}
                                            </Pie>
                                            <Tooltip/>
                                            <Legend/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]} style={{marginTop: '20px'}}>
                            <Col span={12}>
                                <Card>
                                    <Title level={4}>Top performing Campaigns</Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={dashboardData?.top_referring_campaign.map(items => ({
                                                    ...items,
                                                    name: items.campaign,
                                                }))}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="click_count"
                                                label
                                            >
                                                {dashboardData?.top_device.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
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
                                    <Title level={4}>Top Locations</Title>
                                    <Table
                                        dataSource={dashboardData?.top_country}
                                        columns={[
                                            {
                                                title: 'Country',
                                                dataIndex: 'country',
                                                key: 'country',
                                            },
                                            {
                                                title: 'Clicks',
                                                dataIndex: 'click_count',
                                                key: 'click_count',
                                                sorter: (a, b) => a.click_count - b.click_count,
                                            },
                                        ]}
                                        pagination={false}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]} style={{marginTop: '20px'}}>
                            <Col span={24}>
                                <Card>
                                    <Title level={4}>Click Trends</Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={dashboardData?.monthly_click_trend}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="month"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Line type="monotone" dataKey="click_count" stroke="#8884d8"/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]} style={{marginTop: '20px'}}>
                            <Col span={12}>
                                <Card>
                                    <Title level={4}>Peak Click Times</Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={dashboardData?.monthly_click_trend}>
                                            <CartesianGrid strokeDasharray="3 3"/>
                                            <XAxis dataKey="month"/>
                                            <YAxis/>
                                            <Tooltip/>
                                            <Legend/>
                                            <Bar dataKey="click_count" fill="#8884d8"/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Title level={4}>Peak Click Information</Title>
                                    <Text strong>Peak Click Day: </Text>
                                    <Text>{peakClickDay}</Text>
                                    <br/>
                                    <Text strong>Peak Click Month: </Text>
                                    <Text>{peakClickMonth}</Text>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card>
                                    <Title level={4}>Clicks by Device</Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={dashboardData?.top_device.map(items => ({
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
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                                ))}
                                            </Pie>
                                            <Tooltip/>
                                            <Legend/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Card>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            }
        </>
    );
}
;

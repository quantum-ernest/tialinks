'use client'

import React, {useEffect} from 'react';
import {Layout, Row, Col, Card, Table, Typography, Statistic, Spin} from 'antd';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import {useDashboard} from "@/hooks/Dashboard";

const {Content} = Layout;
const {Title} = Typography;
import animatedClickIcon from "../../assets/icons/click-Animation.json";
import animatedLinkIcon from "../../assets/icons/link-Animation.json";
import animatedGraphIcon from "../../assets/icons/graph-Animation.json";
import Lottie from "lottie-react";
import {useAuth} from "@/hooks/Auth";

import {displayNotifications} from "@/utils/notifications";
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];


export default function Dashboard() {
    const {checkAuth, isAuthenticated} = useAuth();
    const {loading, dashboardData, fetchData} = useDashboard();
    const {contextHolder, openNotification} = displayNotifications();

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        const _fetchData = async () => {
            checkAuth();
            if (isAuthenticated) {
                await fetchData();
                interval = setInterval( async () => {
                    await fetchData();
                }, 5000);
            }
        }
        _fetchData().catch(error =>{
            openNotification('error', error)
        } );
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        }
    }, [isAuthenticated]);
    return (
        <>
            {contextHolder}
            {!isAuthenticated ? (<Spin size="large" fullscreen/>) :
                <Layout>
                    <Content style={{padding: '16px'}}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Card>
                                    <Row justify='center' gutter={[16, 16]}>
                                        <Col xs={24} sm={24} md={8} lg={8}
                                             style={{display: 'flex', justifyContent: 'center'}}>
                                            <Statistic
                                                title="Total Links"
                                                prefix={<Lottie animationData={animatedLinkIcon}
                                                                style={{height: '1.5em', width: '2em'}}/>}
                                                value={dashboardData?.total_links}/>
                                        </Col>
                                        <Col xs={24} sm={24} md={8} lg={8}
                                             style={{display: 'flex', justifyContent: 'center'}}>
                                            <Statistic
                                                title="Total Clicks"
                                                value={dashboardData?.total_clicks}
                                                prefix={<Lottie animationData={animatedClickIcon}
                                                                style={{height: '1.5em', width: '2em'}}/>}
                                            />
                                        </Col>
                                        <Col xs={24} sm={24} md={8} lg={8}
                                             style={{display: 'flex', justifyContent: 'center'}}>
                                            <Statistic
                                                title="Average Clicks per Link"
                                                value={dashboardData?.average_clicks_per_link}
                                                precision={2}
                                                prefix={<Lottie animationData={animatedGraphIcon}
                                                                style={{height: '1.5em', width: '2em'}}/>}

                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]} style={{marginTop: '20px'}}>
                            <Col xs={24} sm={24} md={12} lg={12}>
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
                            <Col xs={24} sm={24} md={12} lg={12}>
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
                            <Col xs={24} sm={24} md={12} lg={12}>
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
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Card>
                                    <Title level={4}>Top Locations</Title>
                                    <Table
                                        dataSource={dashboardData?.top_country.slice(0, 5)}
                                        style={{height: 325}}
                                        loading={loading}
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
                            <Col xs={24} sm={24} md={12} lg={12}>
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
                            <Col xs={24} sm={24} md={12} lg={12}>
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

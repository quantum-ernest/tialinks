'use client'
//
// import { useState } from 'react'
// import { Card, Row, Col, Typography, Table, Button } from 'antd'
// import { PlusOutlined } from '@ant-design/icons'
// import { QRCode } from 'antd'
// import dynamic from 'next/dynamic'
// import QRCodePopup from '@/components/QRCodePopup'
//
// const { Title, Text } = Typography
//
// // Import LineChart with no SSR
// const LineChart = dynamic(() => import('@/components/LineChart'), {
//   ssr: false,
//   loading: () => <div style={{ height: '400px', background: '#f0f2f5' }} />
// })
//
// export default function DashboardPage() {
//   const [qrCodePopup, setQRCodePopup] = useState({ isOpen: false, value: '' })
//
//   const stats = [
//     { title: 'Links', value: '71' },
//     { title: 'Views', value: '249' },
//     { title: 'Clicks', value: '53' },
//     { title: 'Avg. CTR', value: '21%' },
//     { title: 'Avg. Time', value: '6.37s' },
//   ]
//
//   const recentLinks = [
//     { key: '1', shortLink: 'tialinks.com/abc123', originalLink: 'https://example.com/very/long/url', qrCode: 'https://tialinks.com/abc123', clicks: 1313, status: 'Active', date: 'Oct 10, 2023' },
//     { key: '2', shortLink: 'tialinks.com/def456', originalLink: 'https://another-example.com/long/url', qrCode: 'https://tialinks.com/def456', clicks: 4313, status: 'Inactive', date: 'Oct 08, 2023' },
//     { key: '3', shortLink: 'tialinks.com/ghi789', originalLink: 'https://third-example.com/url', qrCode: 'https://tialinks.com/ghi789', clicks: 1013, status: 'Active', date: 'Oct 01, 2023' },
//   ]
//
//   const columns = [
//     {
//       title: 'Short Link',
//       dataIndex: 'shortLink',
//       key: 'shortLink',
//       render: (text) => <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">{text}</a>,
//     },
//     {
//       title: 'Original Link',
//       dataIndex: 'originalLink',
//       key: 'originalLink',
//       render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
//     },
//     {
//       title: 'QR Code',
//       dataIndex: 'qrCode',
//       key: 'qrCode',
//       render: (text) => (
//         <QRCode
//           value={text}
//           size={32}
//           style={{ cursor: 'pointer' }}
//           onClick={() => setQRCodePopup({ isOpen: true, value: text })}
//         />
//       ),
//     },
//     {
//       title: 'Clicks',
//       dataIndex: 'clicks',
//       key: 'clicks',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (text) => (
//         <Text style={{ color: text === 'Active' ? '#10B981' : '#EF4444' }}>{text}</Text>
//       ),
//     },
//     {
//       title: 'Date',
//       dataIndex: 'date',
//       key: 'date',
//     },
//   ]
//
//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <Title level={2} style={{ margin: 0 }}>Dashboard</Title>
//         <Button type="primary" icon={<PlusOutlined />}>Create New Link</Button>
//       </div>
//
//       <Row gutter={[16, 16]}>
//         {stats.map((stat, index) => (
//           <Col xs={12} sm={8} md={6} lg={4} key={index}>
//             <Card bordered={false} style={{ borderRadius: 8 }}>
//               <Text type="secondary">{stat.title}</Text>
//               <Title level={3} style={{ margin: '8px 0 0' }}>{stat.value}</Title>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//
//       <Card
//         title="Click Analytics"
//         bordered={false}
//         style={{ borderRadius: 8 }}
//       >
//         <div style={{ height: '400px' }}>
//           <LineChart />
//         </div>
//       </Card>
//
//       <Card
//         title="Recent Links"
//         bordered={false}
//         style={{ borderRadius: 8 }}
//       >
//         <Table
//           columns={columns}
//           dataSource={recentLinks}
//           pagination={false}
//         />
//       </Card>
//
//       <QRCodePopup
//         isOpen={qrCodePopup.isOpen}
//         onClose={() => setQRCodePopup({ isOpen: false, value: '' })}
//         value={qrCodePopup.value}
//       />
//     </div>
//   )
// }
//

import React from 'react';
import {Layout, Row, Col, Card, Table, Typography, Statistic, Flex} from 'antd';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard() {
    const {loading, dashboardData, contextHolder} = useDashboard();
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
                                            prefix={<Lottie animationData={animatedLinkIcon} style={{height: '70px', width: '70px'}}/>}
                                            value={dashboardData?.total_links}/>
                                    </Col>
                                    <Col span={8}>

                                        <Statistic
                                            title="Total Clicks"
                                            value={dashboardData?.total_clicks}
                                            prefix={<Lottie animationData={animatedClickIcon} style={{height: '70px', width: '70px'}}/>}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Average Clicks per Link"
                                            value={dashboardData?.average_clicks_per_link}
                                            precision={2}
                                            prefix={<Lottie animationData={animatedGraphIcon} style={{height: '70px', width: '70px'}}/>}

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
        </>
    );
}
;

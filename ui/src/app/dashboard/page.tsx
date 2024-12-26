'use client'

import { Card, Row, Col, Statistic } from 'antd'
import { LinkOutlined, EyeOutlined, UserOutlined, GlobalOutlined } from '@ant-design/icons'
import { Line, LineChart, Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

// Sample data - replace with actual API data
const clickData = [
  { date: '2023-12-20', clicks: 120 },
  { date: '2023-12-21', clicks: 150 },
  { date: '2023-12-22', clicks: 180 },
  { date: '2023-12-23', clicks: 190 },
  { date: '2023-12-24', clicks: 160 },
  { date: '2023-12-25', clicks: 170 },
  { date: '2023-12-26', clicks: 200 },
]

const locationData = [
  { country: 'USA', visits: 1200 },
  { country: 'UK', visits: 900 },
  { country: 'Canada', visits: 800 },
  { country: 'Germany', visits: 600 },
  { country: 'France', visits: 500 },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Links"
              value={1234}
              prefix={<LinkOutlined />}
              valueStyle={{ color: '#7C3AED' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Clicks"
              value={45678}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#3B82F6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Unique Visitors"
              value={12345}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Countries Reached"
              value={45}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Click Traffic Over Time">
            <ChartContainer
              config={{
                clicks: {
                  label: "Clicks",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <LineChart data={clickData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="var(--color-clicks)"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Locations">
            <ChartContainer
              config={{
                visits: {
                  label: "Visits",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <BarChart data={locationData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" />
                <ChartTooltip />
                <Bar dataKey="visits" fill="var(--color-visits)" />
              </BarChart>
            </ChartContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

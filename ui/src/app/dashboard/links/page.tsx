'use client'

import { useState } from 'react'
import { Table, Button, Input, Space, Tag } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

const { Search } = Input

// Sample data - replace with actual API data
const linksData = [
  {
    key: '1',
    originalUrl: 'https://example.com/very/long/url/that/needs/shortening',
    shortUrl: 'tialinks.com/abc123',
    clicks: 1234,
    createdAt: '2023-12-26',
    status: 'active',
  },
  {
    key: '2',
    originalUrl: 'https://another-example.com/long/url/path',
    shortUrl: 'tialinks.com/def456',
    clicks: 567,
    createdAt: '2023-12-25',
    status: 'active',
  },
]

export default function LinksPage() {
  const [searchText, setSearchText] = useState('')

  const columns = [
    {
      title: 'Original URL',
      dataIndex: 'originalUrl',
      key: 'originalUrl',
      ellipsis: true,
    },
    {
      title: 'Short URL',
      dataIndex: 'shortUrl',
      key: 'shortUrl',
      render: (text: string) => (
        <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: 'Clicks',
      dataIndex: 'clicks',
      key: 'clicks',
      sorter: (a: any, b: any) => a.clicks - b.clicks,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: any, b: any) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link">Edit</Button>
          <Button type="link" danger>Delete</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Search
          placeholder="Search links..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Create New Link
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={linksData}
        pagination={{ pageSize: 10 }}
      />
    </div>
  )
}

'use client'

import {useState, useEffect} from 'react'
import {Table, Button, Input, Space, Tag, message, Modal, Form, Flex} from 'antd'
import {SearchOutlined, PlusOutlined} from '@ant-design/icons'
import {SiSimpleanalytics} from "react-icons/si";

const {Search} = Input

interface Link {
    id: number
    original_url: string
    shortcode: string
    count: number
    created_at: string
}

export default function LinksPage() {
    const [searchText, setSearchText] = useState('')
    const [links, setLinks] = useState<Link[]>([])
    const [linkData, setLinkData] = useState([])
    const [loading, setLoading] = useState(false)
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    const accessToken = localStorage.getItem('access_token')
    const [form] = Form.useForm()

    const fetchLinks = async () => {
        setLoading(true)
        try {
            const response = await fetch(apiUrl + '/api/links', {
                method: 'GET',
                headers: {'accept': 'application/json', 'Authorization': `Bearer ${accessToken}`},
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const data = await response.json()
            const formattedData = data.map((link: any) => ({
                ...link,
                created_at: new Date(link.created_at.split('.')[0]).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                }),
            }))
            setLinkData(formattedData)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchLinks()
    }, [])

    const createLink = async (originalUrl: string) => {
        try {
            const accessToken = localStorage.getItem('access_token')
            if (!accessToken) {
                throw new Error('No auth token found')
            }

            const response = await fetch('/api/links', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({original_url: originalUrl})
            })

            if (!response.ok) {
                throw new Error('Failed to create link')
            }

            const newLink = await response.json()
            setLinks([...links, newLink])
            message.success('Link created successfully')
        } catch (error) {
            message.error('Failed to create link')
        }
    }
    const columns = [
        {
            title: 'Original URL',
            dataIndex: 'original_url',
            key: 'original_url',
            ellipsis: true,
        },
        {
            title: 'Short URL',
            dataIndex: 'shortcode',
            key: 'shortcode',
            render: (text: string) => (
                <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: 'Clicks',
            dataIndex: 'count',
            key: 'count',
            sorter: (a: any, b: any) => a.clicks - b.clicks,
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a: any, b: any) => new Date(a.created_at) - new Date(b.created_at),
        },
        // {
        //   title: 'Status',
        //   dataIndex: 'status',
        //   key: 'status',
        //   render: (status: string) => (
        //     <Tag color={status === 'active' ? 'green' : 'red'}>
        //       {status.toUpperCase()}
        //     </Tag>
        //   ),
        // },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space size="middle">
                    <Button type="link" icon={<SiSimpleanalytics color={'#7C3AED'}/>}>Analytics</Button>
                </Space>
            ),
        },
    ]
    // const handleOk = async () => {
    //   try {
    //     const values = await form.validateFields()
    //     await createLink(values.url)
    //     setIsModalVisible(false)
    //     form.resetFields()
    //   } catch (error) {
    //     console.error('Validation failed:', error)
    //   }
    // }
    //
    // const handleCancel = () => {
    //   setIsModalVisible(false)
    //   form.resetFields()
    // }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="space-y-4">
            <Flex justify="space-between">
                <Search
                    placeholder="Search links..."
                    allowClear
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{width: 300}}
                />
                <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>
                    Create New Link
                </Button>
            </Flex>
            <Table
                columns={columns}
                dataSource={linkData.filter((link: any) =>
                    link.original_url.toLowerCase().includes(searchText.toLowerCase()) ||
                    link.shortcode.toLowerCase().includes(searchText.toLowerCase())
                )}
                loading={loading}
                pagination={{pageSize: 10}}
                rowKey="key"
            />

            <Modal
                title="Create New Link"
                open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
            >
                <Form form={form} layout="vertical" name="create_link_form">
                    <Form.Item
                        name="url"
                        label="URL to shorten"
                        rules={[
                            {required: true, message: 'Please input the URL to shorten!'},
                            {type: 'url', message: 'Please enter a valid URL!'}
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

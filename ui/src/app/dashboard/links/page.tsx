'use client'

import {useState, useEffect} from 'react'
import {Table, Button, Input, Space, Tag, message, Modal, Form, Flex} from 'antd'
import {SearchOutlined, PlusOutlined} from '@ant-design/icons'
import {SiSimpleanalytics} from "react-icons/si";
import {useLinks} from "@/hooks/Links"

const {Search} = Input

export default function LinksPage() {
    const {loading, linkData, createLink, contextHolder, openNotification} = useLinks()
    const [searchText, setSearchText] = useState('')
    const [form] = Form.useForm()


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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            await createLink(values.url)
            form.resetFields()
        } catch (error) {
            openNotification('error', error?.message)
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields()

    };
    return (
        <>
            {contextHolder}
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
                    dataSource={linkData?.filter((link: any) =>
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
        </>

    )
}

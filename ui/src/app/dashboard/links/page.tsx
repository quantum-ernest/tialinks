'use client'

import {useState, useEffect} from 'react'
import {Table, Button, Input, Space, Tag, Modal, Form, Flex, Tooltip, Spin} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {SiSimpleanalytics} from "react-icons/si";
import {LinkParams, useLinks} from "@/hooks/Links"
import Image from "next/image";
import {useAuth} from "@/hooks/Auth";
import {displayNotifications} from "@/utils/notifications";

const {Search} = Input

export default function LinksPage() {
    const {loading, linkData, fetchLinks, createLink} = useLinks()
    const [searchText, setSearchText] = useState('')
    const [form] = Form.useForm()
    const columns = [
        {
            title: 'Original URL',
            dataIndex: 'original_url',
            width: 100,
            key: 'original_url',
            ellipsis: {
                showTitle: false,
            },
            render: (original_url: string, record: LinkParams) => (
                <>
                    <Flex align='center'>
                        <Image
                            src={record.favicon_url}
                            width={20}
                            height={20}
                            alt='favicon'
                            style={{marginRight: '5px'}}
                            onError={(event) => {
                                // @ts-ignore
                                event.target.id = "/earth.png";
                                // @ts-ignore
                                event.target.srcset = "/earth.png";
                            }}
                        />
                        <Tooltip placement="topLeft" title={original_url}>
                            {original_url.length > 50 ? original_url.substring(0, 50) + '...' : original_url}
                        </Tooltip>
                    </Flex>
                </>
            )
        },
        {
            title: 'Short URL',
            dataIndex: 'generated_url',
            key: 'generated_url',
            render: (text: string) => (
                <a href={`https://${text}`} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: 'Short Code',
            dataIndex: 'shortcode',
            key: 'shortcode',
        },
        {
            title: 'Clicks',
            dataIndex: 'count',
            key: 'count',
            sorter: (a: LinkParams, b: LinkParams) => a.count - b.count,
        },
        {
            title: 'Created',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'volcano'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            // fixed: 'right',
            render: () => (
                <Space size="middle">
                    <Button type="link" icon={<SiSimpleanalytics color={'#7C3AED'}/>}>Analytics</Button>
                </Space>
            ),
        },
    ]
    const {checkAuth, isAuthenticated} = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {contextHolder, openNotification} = displayNotifications()


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            await createLink(values.url)
            form.resetFields()
        } catch (error) {
            // @ts-ignore
            openNotification('error', error?.message)
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields()

    };
    useEffect(() => {
        const _fetchData = async () => {
            checkAuth();
            if (isAuthenticated) {
                await fetchLinks()
            }
        }
        _fetchData().catch(error => {
            openNotification('error', error)
        });
    }, [])
    return (
        <>
            {contextHolder}
            {!isAuthenticated ? (<Spin size="large" fullscreen/>) : (
                <div className="space-y-4">
                    <Flex justify="space-between" align='center'>
                        <Search
                            placeholder="Search..."
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{width: '40%'}}
                        />
                        <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>Link</Button>
                    </Flex>
                    <Table
                        columns={columns}
                        dataSource={linkData?.filter((link: LinkParams) =>
                            link.original_url.toLowerCase().includes(searchText.toLowerCase()) ||
                            link.shortcode.toLowerCase().includes(searchText.toLowerCase())
                        )}
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            responsive: true,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                        rowKey="key"
                        scroll={{x: 'max-content'}}
                        size="middle"
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
        </>

    )
}

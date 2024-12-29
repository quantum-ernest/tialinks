'use client'
import {useState} from 'react'
import { Button, Input, Modal, Form, Spin, Typography, Flex, Table, Space, Tag, TableProps} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import {useUtm} from '@/hooks/Utm'
import {CiEdit} from "react-icons/ci";
import {UtmParams} from '@/hooks/Utm'

const {Title, Text} = Typography


export default function UtmPage() {
    const {utmList, loading, contextHolder, createUtm, updateUtm} = useUtm()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingUtm, setEditingUtm] = useState<any>(null)
    const [form] = Form.useForm()

    const showModal = (utm?: any) => {
        if (utm) {
            setEditingUtm(utm)
            form.setFieldsValue(utm)
        } else {
            setEditingUtm(null)
            form.resetFields()
        }
        setIsModalVisible(true)
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields()
            if (editingUtm) {
                await updateUtm(editingUtm.id, values)
            } else {
                await createUtm(values)
            }
            setIsModalVisible(false)
            form.resetFields()
        } catch (error) {
            console.error('Validation failed:', error)
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false)
        form.resetFields()
    }

    const columns :TableProps<UtmParams>['columns'] = [
        {
            title: 'Campaign',
            dataIndex: 'campaign',
            key: 'campaign',
            ellipsis: true,
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
        },
        {
            title: 'Medium',
            dataIndex: 'medium',
            key: 'medium',
        },
        {
            title: 'Link Count',
            dataIndex: 'link_count',
            key: 'link_count',
            render: (_, {link_count}) => (
                <Tag color={link_count > 1 ? 'green' : 'volcano'} key={link_count}>
                    {link_count}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record: any) => (
                <Space size="middle">
                    <Button type="text" form={'form'} style={{color: '#7C3AED'}} icon={<CiEdit color={'#7C3AED'}/>}
                            onClick={() => showModal(record)}>Edit</Button>
                </Space>
            ),
        },
    ]
    return (
        <>
            {contextHolder}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Flex justify="space-between" align='center'>
                        <Title level={2}>UTM Management</Title>
                        <Button type="primary" form={'form'} icon={<PlusOutlined/>} onClick={() => showModal()}>
                            Create New UTM
                        </Button>
                    </Flex>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <Spin size="large"/>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={utmList}
                        loading={loading}
                        pagination={{pageSize: 10}}
                        rowKey="key"
                    />
                )}
                <Modal
                    title={editingUtm ? "Edit UTM" : "Create New UTM"}
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Form form={form} layout="vertical" name="utm_form">
                        <Form.Item
                            name="campaign"
                            label="Campaign"
                            rules={[{required: true, message: 'Please input the campaign name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="source"
                            label="Source"
                            rules={[{required: true, message: 'Please input the source!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="medium"
                            label="Medium"
                        >
                            <Input/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </>
    )
}

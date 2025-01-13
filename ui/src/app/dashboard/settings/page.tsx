'use client'

import {useState} from 'react'
import {Card, Form, Input, Button, Typography, Row, Col} from 'antd'
import {getUserObject} from "@/utils/auth";
import {useUser} from "@/hooks/User";

const {Title} = Typography
export default function SettingsPage() {
    const [form] = Form.useForm()
    const {contextHolder, updateUser, loading} = useUser()
    const user = getUserObject()
    const userData = user ? JSON.parse(user) : null
    const onFinish = async ({name}: { name: string }) => {
        console.log('onFinish', name)
        await updateUser(name)
    }
    return (
        <>
            {contextHolder}
            <Row>
                <Col xs={24} sm={12} md={12} lg={12}>
                    <Card>
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={userData}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{required: true, message: 'Please input your name!'}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                            >
                                <Input disabled/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} style={{display: 'block', margin: '0 auto', padding: '10px 20px'}}>
                                    Update Name
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

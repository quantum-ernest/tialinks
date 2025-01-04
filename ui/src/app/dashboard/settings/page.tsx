'use client'

import {useState} from 'react'
import {Card, Form, Input, Button, Typography, message} from 'antd'
import {displayNotifications} from "@/utils/notifications";

const {Title} = Typography
const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
export default function SettingsPage() {
    const {contextHolder, openNotification} = displayNotifications()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const user = localStorage.getItem('user')
    if (!user) {
        // Todo: logout the user or something. work on it later
        return
    }
    const userData = JSON.parse(user)
    const onFinish = async (values: { name: string }) => {
        setLoading(true)
        try {
            const accessToken = localStorage.getItem('access_token')
            const response = await fetch(apiUrl + `/api/user`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
                body: JSON.stringify(values),
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const data = await response.json()
            localStorage.setItem("user", JSON.stringify(data.user));
            openNotification('success', 'User updated successfully.')
        } catch (error: any) {
            openNotification('error', "Failed to update name", error.message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            {contextHolder}
            <div className="space-y-8">
                <Title level={2}>Settings</Title>
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
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update Name
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    )
}

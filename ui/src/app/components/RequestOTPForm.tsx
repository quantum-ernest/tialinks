"use client";
import { Button, Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";

function RequestOTPForm() {
    const onFinish = async (values: { email: string }) => {
        console.log("Form Submitted with Values:", values);

        try {
            const response = await fetch('http://localhost:8004/api/auth/otp/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
            });

            if (!response.ok) {
                throw new Error(`Failed to request OTP: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Form
            name="request_otp_form"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Email is required!' },
                    { type: 'email', message: 'Enter a valid email!' },
                ]}
            >
                <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    allowClear
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Request OTP</Button>
            </Form.Item>
        </Form>
    );
}

export default RequestOTPForm;

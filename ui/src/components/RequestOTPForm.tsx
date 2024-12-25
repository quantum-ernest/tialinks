"use client";
import {Button, Form, Input} from "antd";
import {MailOutlined} from "@ant-design/icons";
import {Email} from "@/components/types";

type SetEmail = {
    setEmail: (email: string) => void;
};

function RequestOTPForm({setEmail}: SetEmail) {
    const onFinish = async (values: Email) => {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
        try {
            const response = await fetch(apiUrl + '/api/auth/otp/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: values.email}),
            });

            if (!response.ok) {
                throw new Error(`Failed to request OTP: ${response.statusText}`);
            }
            setEmail(values.email);
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
                    {required: true, message: 'Email is required!'},
                    {type: 'email', message: 'Enter a valid email!'},
                ]}
            >
                <Input
                    prefix={<MailOutlined/>}
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

'use client'

import {useState} from 'react'
import {Card, Input, Button, Typography, Form, message} from 'antd'
import {MailOutlined, LockOutlined} from '@ant-design/icons'
import {InputOTP} from 'antd-input-otp';
import '../styles/login.css'

const {Title, Text} = Typography
type OTP = string[] | null

export default function LoginPage() {
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const handleEmailSubmit = async () => {
        setLoading(true)

        try {
            // Replace with actual API call
            const response = await fetch(apiUrl + '/api/auth/otp/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email}),
            });

            if (!response.ok) {
                throw new Error(`Failed to request OTP: ${response.statusText}`);
            }
            await new Promise(resolve => setTimeout(resolve, 1000))
            setStep('otp');
            message.success('OTP sent to your email');
        } catch (error) {
            message.error('Failed to send OTP');
            console.error('Error:', error);

        } finally {
            setLoading(false)
        }
    }

    const handleOtpSubmit = async (otp: OTP) => {
        setLoading(true)
        const otpString = otp?.join("");
        if (!otpString) {
            message.error('Invalid otp')
            return
        }
        try {
            const response = await fetch(apiUrl + '/api/auth/otp/email/login', {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({email: email, otp: otpString})
            })
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json()
            localStorage.setItem("access_token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            await new Promise(resolve => setTimeout(resolve, 1000))
            message.success('Login successful')
            window.location.href = '/dashboard'
        } catch (error) {
            message.error('Invalid OTP')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container">
            <Card className="login-card">
                <div className="login-header">
                    <Title level={2} style={{color: 'white', margin: 0}}>TiaLinks</Title>
                </div>
                <div className="login-form">
                    {step === 'email' ? (
                        <Form onFinish={handleEmailSubmit}>
                            <Form.Item
                                name="email"
                                rules={[
                                    {required: true, message: 'Please input your email!'},
                                    {type: 'email', message: 'Please enter a valid email!'}
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined className="site-form-item-icon"/>}
                                    placeholder="Enter your Email"
                                    size="large"
                                    value={email}
                                    allowClear
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="login-input"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={loading}
                                    className="login-button"
                                >
                                    Request OTP
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <Form layout={"vertical"} onFinish={handleOtpSubmit} form={form}>
                            <Form.Item label="Enter OTP" name="otp">
                                <InputOTP autoSubmit={handleOtpSubmit} autoFocus={true} inputType="numeric"/>
                            </Form.Item>
                        </Form>
                )}
        </div>
</Card>
</div>
)
}

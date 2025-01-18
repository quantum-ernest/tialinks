'use client'

import {useState} from 'react'
import {Card, Input, Button, Typography, Form, Flex} from 'antd'
import {MailOutlined} from '@ant-design/icons'
import {InputOTP} from 'antd-input-otp';
import '../styles/login.css'
import {useAuth} from "@/hooks/Auth";
import {useNotification} from "@/utils/notifications";

const {Title} = Typography
type OTP = string[] | null

export default function LoginPage() {
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    const {step, setStep, loading, submitOTP, requestOTP} = useAuth();
    const {openNotification} = useNotification();
    const handleEmailSubmit = async () => {
        await requestOTP(email)
    }

    const handleOtpSubmit = async (otp: OTP) => {
        const otpString = otp?.join("");
        if (!otpString) {
            openNotification('error', "Invalid OTP format.");
            return
        }
        await submitOTP(email, otpString);
    }

    return (
        <>
            <div className="login-container">
                <Card className="login-card">
                    <div className="login-header">
                        <Title level={3} style={{color: 'white', margin: 0}}>TiaLinks</Title>
                    </div>
                    <div className="login-form">
                        {step === 'email' ? (
                            <Form onFinish={handleEmailSubmit}>
                                <Form.Item
                                    name="email"
                                    wrapperCol={{span: 24}}
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
                                        style={{marginTop: '10px'}}
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
                                <Form.Item name="otp">
                                    <InputOTP autoSubmit={handleOtpSubmit} autoFocus={true} inputType="numeric"/>
                                </Form.Item>
                                <Form.Item>
                                    <Flex justify='space-between'>

                                        <Button onClick={() => {
                                            setStep('email')
                                        }}>Change Email</Button>
                                        <Button loading={loading} onClick={handleEmailSubmit}>
                                            Request New OTP
                                        </Button>
                                    </Flex>
                                </Form.Item>
                            </Form>
                        )}
                    </div>
                </Card>
            </div>
        </>

    )
}

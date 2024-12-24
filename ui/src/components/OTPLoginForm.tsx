"use client"
import {Form} from "antd"
import {InputOTP} from 'antd-input-otp';

function OTPLoginForm({email}: { email: string }) {
    const [form] = Form.useForm();
    const handleFinish = async (values: any | null) => {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
        const otp = values?.otp.join("")
        if (!otp) {
            return;
        }
        try {
            const response = await fetch(apiUrl + '/api/auth/otp/email/login', {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({email: email, otp: otp})
            })
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            console.log(response)
        } catch (error) {
            console.error(error)
        }

    };

    return (
        <Form layout={"vertical"} onFinish={handleFinish} form={form}>
            <Form.Item label="Enter OTP" name="otp">
                <InputOTP autoSubmit={form} autoFocus={true} inputType="numeric"/>
            </Form.Item>
        </Form>
    );
}

export default OTPLoginForm;

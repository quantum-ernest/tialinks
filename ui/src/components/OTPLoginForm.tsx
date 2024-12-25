"use client"
import {Form} from "antd"
import {InputOTP} from 'antd-input-otp';
import {Email} from "@/components/types";
import {useState} from "react";

type OTP = {
    otp: string[] | null
}

function OTPLoginForm({email}: Email) {
    const [form] = Form.useForm();
    const [error, setError] = useState<string|null>();
    const handleFinish = async (values: OTP) => {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
        const otp = values?.otp?.join("")
        if (!otp) {
            setError("Invalid OTP");
            return
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
            const data = await response.json()
            localStorage.setItem("access_token", data.token);
            setError(null)
        } catch (error) {
            if (error instanceof Error ){
                setError(error.message);
            }else{
                setError("An unexpected error occurred");
            }
            console.error(error)
        }
    };

    return (
        <Form layout={"vertical"} onFinish={handleFinish} form={form}>
            <Form.Item label="Enter OTP" name="otp">
                <InputOTP autoSubmit={form} autoFocus={true} inputType="numeric"/>
            </Form.Item>
            {error && <p>{error}</p>}
        </Form>
    );
}

export default OTPLoginForm;

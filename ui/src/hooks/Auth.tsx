"use client"
import {useEffect, useState} from "react";
import {displayNotifications} from "@/utils/notifications";
import {isTokenValid, removeToken, setToken, setUserObject} from "@/utils/auth";
import {useRouter} from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const useAuth = () => {
    const {contextHolder, openNotification} = displayNotifications()
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const isValid = isTokenValid();
        setIsAuthenticated(isValid);
        if (!isValid) {
            router.push('/login');
            removeToken();
        }
        return isValid;
    };


    const requestOTP = async (email: string) => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl + '/api/auth/otp/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email}),
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            setStep('otp');
        } catch (error) {
            // @ts-ignore
            openNotification('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    const submitOTP = async (email: string, otp: string) => {
        try {
            setLoading(true);
            const response = await fetch(apiUrl + '/api/auth/otp/email/login', {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({email: email, otp: otp})
            })
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = await response.json()
            setToken(data.token);
            console.log(data.token)
            setUserObject(JSON.stringify(data.user))
            setIsAuthenticated(true);
            router.push('/dashboard');
        } catch (error) {
            // @ts-ignore
            openNotification('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    return {step, setStep, contextHolder, checkAuth, openNotification, isAuthenticated, loading, submitOTP, requestOTP}
}
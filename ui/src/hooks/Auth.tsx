"use client"
import {useEffect, useState} from "react";
import {displayNotifications} from "@/utils/notifications";
import {isTokenValid, removeToken, setToken, setUserObject} from "@/utils/auth";
import {useRouter} from "next/navigation";
import {getPendingUrl} from "@/utils/pendingUrl";
import {useLinks} from "@/hooks/Links";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export const useAuth = () => {
    const {openNotification} = displayNotifications()
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());
    const router = useRouter();
    const {createLink} = useLinks();
    useEffect(() => {
        checkAuth();
    }, [isAuthenticated]);

    const checkAuth = () => {
        const isValidToken = isTokenValid();
        setIsAuthenticated(isValidToken);
        if (!isValidToken) {
            removeToken();
        }
        return isValidToken;
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
        const pendingUrl = getPendingUrl()
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
            setUserObject(JSON.stringify(data.user))
            setIsAuthenticated(true);
            if (pendingUrl) {
                const newLink = await createLink(pendingUrl);
                if (newLink) {
                    openNotification('success', 'Short link generated successfully.', newLink.generated_url)
                }
            }
            router.push('/dashboard');
        } catch (error) {
            // @ts-ignore
            openNotification('error', error.message)
        } finally {
            setLoading(false)
        }
    }

    return {step, setStep, checkAuth, isAuthenticated,setIsAuthenticated, loading, submitOTP, requestOTP}
}
import {useState} from 'react'
import {displayNotifications} from "@/utils/notifications";
import {getToken} from "@/utils/auth";
import {useRouter} from "next/navigation";

interface DashboardPrams {
    total_links: number,
    total_clicks: number,
    average_clicks_per_link: number,
    top_performing_links: {
        link_id: number,
        shortcode: string
        click_count: number
    }[],
    top_referring_campaign: {
        "campaign": string,
        "click_count": number,
    }[],
    top_referring_site: {
        "domain": string,
        "click_count": number,
    }[],
    top_device: {
        "device": string,
        "click_count": number,
    }[],
    top_country: {
        "country": string,
        "click_count": number,
    }[],
    monthly_click_trend: {
        "month": string,
        "click_count": number,
    }[],

}

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

export const useDashboard = () => {
    const {contextHolder, openNotification} = displayNotifications();
    const [loading, setLoading] = useState(false)
    const [dashboardData, setDashboardData] = useState<DashboardPrams[] | null>(null)
    const router = useRouter();
    const token = getToken()
    if (!token) {
        router.push('/login')
    }
    const fetchData = async () => {
        try {
            setLoading(true)
            const token = getToken()
            if (!token) {
                router.push('/login')
            }
            const response = await fetch(apiUrl + '/api/analytics/dashboard', {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`},
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const data: DashboardPrams[] = await response.json()
            setDashboardData(data)
            setLoading(false)
        } catch (error) {
            // @ts-ignore
            openNotification("error", "Unable to get dashboard data", error.message)
        } finally {
            setLoading(false)

        }
    }
    return {loading, fetchData, dashboardData, contextHolder}
}

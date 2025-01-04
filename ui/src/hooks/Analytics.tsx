import {useEffect, useState} from "react";
import {displayNotifications} from "@/utils/notifications";

interface AnalyticsParams {
    total_clicks: number;
    total_links: number;
    average_click_per_link: number;
    top_performing_links: {
        link_id: number,
        shortcode: string,
        click_count: number,
        original_url: string,
        campaign: string,
    }[],
    referring_campaigns: {
        "campaign": string,
        "click_count": number,
    }[],
    referring_sites: {
        "domain": string,
        "click_count": number,
    }[],
    devices: {
        "device": string,
        "click_count": number,
    }[],
    browsers: {
        "browser": string,
        "click_count": number,
    }[],
    operating_systems: {
        "operating_system": string,
        "click_count": number,
    }[],
    geographical_data: {
        "continent": string,
        "country": string,
        "region": string,
        "city": string,
        "click_count": number,
    }[],
    monthly_click_trend: {
        "month": string,
        "click_count": number,
    }[],


}

export const useAnalytics = () => {
    const {openNotification, contextHolder} = displayNotifications()
    const [loading, setLoading] = useState(false)
    const [analyticsData, setAnalyticsData] = useState<AnalyticsParams>()
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

    const fetchAnalytics = async (start_date: string, end_date: string,link_id: number|null = null,) => {
        setLoading(true)
        // start_date = start_date.format("YYYY-MM-DDTHH:mm:ss")
        try {
            const token = localStorage.getItem("access_token")
            if (!token) {
                openNotification("error", "No access token provided")
            }
            const response = await fetch(apiUrl + `/api/analytics?start_date=${start_date}&end_date=${end_date}${link_id ? `&link_id=${link_id}`: ''}`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`},
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const data = await response.json()
            setAnalyticsData(data)
            setLoading(false)
        } catch (error) {
            openNotification("error", "Unable to get analytics data", error.message)
        } finally {
            setLoading(false)
        }
    }
    return {fetchAnalytics, analyticsData, loading, contextHolder}

}

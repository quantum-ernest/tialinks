import {useState} from "react";
import {displayNotifications} from "@/utils/notifications";
import {AnalyticsSchema, AnalyticsType} from "@/schemas/analytics";

export type GeographicalData = Pick<AnalyticsType, 'geographical_data'>
export const useAnalytics = () => {
    const {openNotification, contextHolder} = displayNotifications()
    const [loading, setLoading] = useState(false)
    const [analyticsData, setAnalyticsData] = useState<AnalyticsType>()
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

    const fetchAnalytics = async (start_date: string, end_date: string, link_id: number | null = null,) => {
        setLoading(true)
        try {
            const token = localStorage.getItem("access_token")
            if (!token) {
                openNotification("error", "No access token provided")
            }
            const response = await fetch(apiUrl + `/api/analytics?start_date=${start_date}&end_date=${end_date}${link_id ? `&link_id=${link_id}` : ''}`, {
                method: 'GET',
                headers: {'Authorization': `Bearer ${token}`},
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const data = await response.json()
            const validation = AnalyticsSchema.safeParse(data);
            if (!validation.success) {
              console.error(validation.error.errors);
              throw new Error("API response validation failed");
            }
            setAnalyticsData(data)
            setLoading(false)
        } catch (error) {
            // @ts-expect-error
            openNotification("error", "Unable to get analytics data", error.message)
        } finally {
            setLoading(false)
        }
    }
    return {fetchAnalytics, analyticsData, loading, contextHolder}

}

import {useState, useEffect} from 'react'
import {displayNotifications} from '../utils/notifications'

export interface UtmParams {
    id: number
    campaign: string
    source: string
    medium: string
    link_count: number
}

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
export const useUtm = () => {
    const {contextHolder,openNotification} = displayNotifications()
    const [utmList, setUtmList] = useState<UtmParams[]>([])
    const [loading, setLoading] = useState(true)
    const fetchUtmList = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('access_token')
            if (!token) {
                throw new Error('No auth token found')
            }

            const response = await fetch(apiUrl + '/api/utms', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const data = await response.json()
            setUtmList(data)
        } catch (error: any) {
            openNotification("error", "Failed to fetch UTM list", error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUtmList()
    }, [])

    const createUtm = async (utmParams: Omit<UtmParams, 'id'>) => {
        try {
            const token = localStorage.getItem('access_token')
            if (!token) {
                throw new Error('No auth token found')
            }
            const response = await fetch(apiUrl + '/api/utms', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(utmParams)
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const newUtm = await response.json()
            setUtmList([...utmList, newUtm])
            openNotification("success", "UTM created successfully")
        } catch (error: any) {
            openNotification("error", "Failed to create UTM", error.message)

        }
    }

    const updateUtm = async (id: number, utmParams: Omit<UtmParams, 'id'>) => {
        try {
            const token = localStorage.getItem('access_token')
            if (!token) {
                throw new Error('No auth token found')
            }
            const response = await fetch(apiUrl + `/api/utms/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(utmParams)
            })
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            const updatedUtm = await response.json()
            setUtmList(utmList.map(utm => utm.id === id ? updatedUtm : utm))
        } catch (error: any) {
            openNotification("error", 'Failed to update UTM', error.message)

        }
    }
    return {utmList, loading, contextHolder, fetchUtmList, createUtm, updateUtm}
}

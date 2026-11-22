import api from '../interceptor/api'

export type Notification = {
    id: string
    userId: string
    title: string
    message: string
    type: string
    data: Record<string, unknown> | null
    isRead: boolean
    createdAt: string
    updatedAt: string
}

export type NotificationsResponse = { data: Notification[]; totalCount: number }

export const getNotifications = async (userId: string, page = 1, limit = 100) => {
    const { data } = await api.get<NotificationsResponse>(`/api/notifications/${userId}`, {
        params: { page, limit, sort: 'createdAt', order: 'DESC' },
    })
    return data
}

export const markNotificationRead = async (id: string) => {
    const { data } = await api.put(`/api/notifications/${id}/read`)
    return data
}

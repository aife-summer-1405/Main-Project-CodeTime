import { text, type Raw } from '@/lib/Api/shared'
import { fetchAllPages } from './pagination'

export type AdminNotification = {
    id: string
    userId: string
    title: string
    message: string
    type: string
    isRead: boolean
    offerId: string | null
    createdAt: string | null
}

const toAdminNotification = (raw: Raw): AdminNotification => {
    const data = (raw.data && typeof raw.data === 'object' ? raw.data : {}) as Raw
    const offerId = Number(data.offerId)
    return {
        id: text(raw.id),
        userId: text(raw.userId),
        title: text(raw.title),
        message: text(raw.message),
        type: text(raw.type),
        isRead: Boolean(raw.isRead),
        offerId: Number.isFinite(offerId) ? String(offerId) : null,
        createdAt: text(raw.createdAt) || text(raw.created_at) || null,
    }
}

export const getAllAdminNotifications = async () => {
    const rows = await fetchAllPages('/api/notifications')
    return rows
        .map(toAdminNotification)
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
}

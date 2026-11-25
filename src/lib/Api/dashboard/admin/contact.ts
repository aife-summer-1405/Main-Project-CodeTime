import api from '@/lib/interceptor/api'
import { obj, text, type Raw } from '@/lib/Api/shared'

export type AdminContactMessage = {
    id: string
    title: string
    message: string
    senderName: string
    senderEmail: string
}

export type AdminContactQuery = {
    page: number
    limit: number
    title?: string
}

const SENDER_PATTERN = /^\s*Message From\s*:\s*(.*?)\s*\(([^()]*)\)\s*$/i

const toAdminContactMessage = (raw: Raw): AdminContactMessage => {
    const title = text(raw.title)
    const match = SENDER_PATTERN.exec(title)
    return {
        id: text(raw.id),
        title,
        message: text(raw.message),
        senderName: match ? match[1] : '',
        senderEmail: match ? match[2] : '',
    }
}

export const getAdminContactMessages = async ({ page, limit, title }: AdminContactQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/contact-us', {
        params: { page, limit, sort: 'id', order: 'DESC', ...(title?.trim() ? { title: title.trim() } : {}) },
    })
    const messages = (data.data ?? []).map(toAdminContactMessage)
    return { messages, totalCount: data.totalCount ?? messages.length }
}

export const getAdminContactMessage = async (id: string): Promise<AdminContactMessage> => {
    const { data } = await api.get<Raw>(`/api/contact-us/${encodeURIComponent(id)}`)
    return toAdminContactMessage(obj(data.data ?? data))
}

export const deleteAdminContactMessage = async (id: string) => {
    const { data } = await api.delete(`/api/contact-us/${encodeURIComponent(id)}`)
    return data
}

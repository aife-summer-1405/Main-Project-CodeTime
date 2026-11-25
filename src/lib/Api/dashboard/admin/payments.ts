import api from '@/lib/interceptor/api'
import { obj, text, type Raw } from '@/lib/Api/shared'

export type PaymentStatus = 'pending' | 'completed' | 'failed'

export type AdminPayment = {
    id: string
    userId: string
    bookingId: string | null
    amount: number
    description: string
    status: PaymentStatus
    transactionId: string
    createdAt: string | null
    updatedAt: string | null
}

export type AdminPaymentBody = {
    amount: number
    status: PaymentStatus
    description: string
    transactionId: string
}

export type AdminPaymentsQuery = {
    page: number
    limit: number
    status?: PaymentStatus | ''
    userId?: string
    amount?: string
}

export const paymentStatusOptions: { label: string; value: PaymentStatus }[] = [
    { label: 'تایید شده', value: 'completed' },
    { label: 'در انتظار', value: 'pending' },
    { label: 'ناموفق', value: 'failed' },
]

const paymentStatus = (value: unknown): PaymentStatus => {
    const status = text(value).toLowerCase()
    if (['completed', 'success', 'paid'].includes(status)) return 'completed'
    return ['failed', 'canceled', 'cancelled'].includes(status) ? 'failed' : 'pending'
}

const toAdminPayment = (raw: Raw): AdminPayment => ({
    id: text(raw.id),
    userId: text(raw.userId),
    bookingId: text(raw.bookingId) || null,
    amount: Number(raw.amount) || 0,
    description: text(raw.description),
    status: paymentStatus(raw.status),
    transactionId: text(raw.transactionId),
    createdAt: text(raw.createdAt) || null,
    updatedAt: text(raw.updatedAt) || null,
})

export const getAdminPayments = async ({ page, limit, status, userId, amount }: AdminPaymentsQuery) => {
    const { data } = await api.get<{ data?: Raw[]; totalCount?: number }>('/api/admin/payments', {
        params: {
            page,
            limit,
            sort: 'createdAt',
            order: 'DESC',
            ...(status ? { status } : {}),
            ...(userId ? { userId } : {}),
            ...(amount ? { amount } : {}),
        },
    })
    const payments = (data.data ?? []).map(toAdminPayment)
    return { payments, totalCount: data.totalCount ?? payments.length }
}

export const getAdminPayment = async (id: string): Promise<AdminPayment> => {
    const { data } = await api.get<Raw>(`/api/admin/payments/${encodeURIComponent(id)}`)
    return toAdminPayment(obj(data.payment ?? data.data ?? data))
}

export const updateAdminPayment = async (id: string, body: AdminPaymentBody) => {
    const { data } = await api.put(`/api/admin/payments/${encodeURIComponent(id)}`, body)
    return data
}

export const verifyAdminPayment = async (id: string, token: string) => {
    const { data } = await api.post(`/api/payments/${encodeURIComponent(id)}/verify`, { token })
    return data
}

export const deleteAdminPayment = async (id: string) => {
    const { data } = await api.delete(`/api/admin/payments/${encodeURIComponent(id)}`)
    return data
}

import api from '@/lib/interceptor/api'

export type Payment = {
    id: string
    userId: string
    bookingId: number | null
    amount: string
    description: string
    status: string
    paymentUrl: string
    transactionId: string | null
    createdAt: string | null
    updatedAt: string | null
}

export type PaymentsResponse = { payments: Payment[]; totalCount: number }

export const getPayments = async (page = 1, limit = 100) => {
    const { data } = await api.get<PaymentsResponse>('/api/payments', {
        params: { page, limit, sort: 'createdAt', order: 'DESC' },
    })
    return data
}
export const getPaymentById = async (id: string) => {
    const { data } = await api.get<Payment>(`/api/payments/${id}`)
    return data
}

import api from '@/lib/interceptor/api'
import type { SellerTransaction } from '@/lib/dashboard/seller-data'

export type FinanceDashboard = {
    totalAmount: number
    totalBookings: number
    totalPayments: number
    totalPerviousMonthAmount: number
    totalCurrentMonthAmount: number
}

export async function getFinanceDashboard(): Promise<FinanceDashboard> {
    const res = await api.get('/api/seller/finance/dashboard')
    return res.data
}

export type TransactionStatus = 'paid' | 'pending' | 'failed'
export type TransactionType = 'wallet' | 'booking'

export type FinanceTransaction = {
    id: string
    bookingId: number | null
    amount: number
    description: string
    status: TransactionStatus
    type: TransactionType
    trackingCode: string
    date: string
}

export type FinanceTransactionsResponse = {
    items: FinanceTransaction[]
    totalCount: number
}

export type FinanceTransactionFilters = {
    paymentStatus?: string
    transactionType?: string
}

type RawPayment = {
    id?: string | number
    bookingId?: number | null
    amount?: string | number
    description?: string
    status?: string
    transactionId?: string | null
    createdAt?: string | null
    updatedAt?: string | null
}

const paidStatuses = ['paid', 'success', 'completed', 'confirmed', 'approved', 'verified']
const failedStatuses = ['failed', 'canceled', 'cancelled', 'rejected', 'expired']

const statusOf = (value?: string): TransactionStatus => {
    const v = (value ?? '').toLowerCase()
    if (paidStatuses.includes(v)) return 'paid'
    if (failedStatuses.includes(v)) return 'failed'
    return 'pending'
}

const normalize = (raw: RawPayment): FinanceTransaction => {
    const description = raw.description ?? ''
    return {
        id: String(raw.id ?? ''),
        bookingId: raw.bookingId ?? null,
        amount: Number(raw.amount) || 0,
        description,
        status: statusOf(raw.status),
        type: description.includes('کیف پول') ? 'wallet' : 'booking',
        trackingCode: String(raw.transactionId ?? raw.id ?? ''),
        date: raw.createdAt ?? raw.updatedAt ?? '',
    }
}

export const getSellerTransactions = async (
    page: number,
    limit: number,
    filters: FinanceTransactionFilters = {}
): Promise<FinanceTransactionsResponse> => {
    const params: Record<string, string | number> = { page, limit }
    if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus
    if (filters.transactionType) params.transactionType = filters.transactionType

    const { data } = await api.get<{ data?: RawPayment[]; totalCount?: number }>('/api/seller/finance', { params })

    return {
        items: (data.data ?? []).map(normalize),
        totalCount: data.totalCount ?? 0,
    }
}

export const toSellerTransaction = (t: FinanceTransaction) => t as unknown as SellerTransaction
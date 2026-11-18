import { isAxiosError } from 'axios'
import api from '../interceptor/api'

export interface CreatePaymentBody {
    amount: number
    description: string
    callbackUrl: string
    bookingId: number
}

export interface Payment {
    paymentUrl: string
    transactionId: string | null
    paymentId: string
    amount: string
    status: 'pending' | (string & {})
}

export async function createPayment(body: CreatePaymentBody, signal?: AbortSignal): Promise<Payment> {
    try {
        const { data } = await api.post<Payment>('/api/payments', body, { signal })
        return data
    } catch (e) {
        let message = 'ایجاد پرداخت انجام نشد، دوباره تلاش کن'

        if (isAxiosError(e)) {
            if (e.response?.status === 401) message = 'برای پرداخت باید وارد حساب کاربری شوی'
            else if (e.response?.status === 404) message = 'رزرو مورد نظر پیدا نشد'
            else if (typeof e.response?.data?.message === 'string') message = e.response.data.message
        }

        throw new Error(message)
    }
}
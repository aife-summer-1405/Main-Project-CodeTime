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

interface PayForBookingParams {
    bookingId: number
    amount: number
    description: string
    hotelId: string
    returnPath: string
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

export async function payForBooking(
    { bookingId, amount, description, hotelId, returnPath }: PayForBookingParams,
    signal?: AbortSignal
): Promise<string> {
    const payment = await createPayment(
        {
            bookingId,
            amount,
            description,
            callbackUrl: `${window.location.origin}${returnPath}`,
        },
        signal
    )

    const url = new URL(payment.paymentUrl)
    if (url.origin !== window.location.origin) return payment.paymentUrl

    url.searchParams.set('hotelId', hotelId)
    url.searchParams.set('callback', returnPath)
    return url.pathname + url.search
}
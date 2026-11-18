'use client'

import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import type { Booking } from '@/lib/Api/booking'
import { createPayment } from '@/lib/Api/payment'
import { faNum } from '@/lib/utils/reserve'
import type { ReservationConfirmation, ReserveHotel, Passenger } from '../../types/types'

interface IStep {
    hotel: ReserveHotel
    booking: Booking
    passengers: Passenger[]
    checkIn?: string
    checkOut?: string
}

const ReservePayment = ({ hotel, booking, passengers, checkIn, checkOut }: IStep) => {
    const [loading, setLoading] = useState(false)
    const controller = useRef<AbortController | null>(null)

    useEffect(() => () => controller.current?.abort(), [])

    const pay = async () => {
        if (loading) return
        setLoading(true)
        controller.current = new AbortController()

        const returnUrl = new URL(window.location.href)
        returnUrl.searchParams.set('payment', 'success')
        returnUrl.searchParams.set('bookingId', String(booking.id))

        try {
            const payment = await createPayment(
                {
                    amount: hotel.price,
                    description: `رزرو ${hotel.title}`,
                    callbackUrl: returnUrl.toString(),
                    bookingId: booking.id,
                },
                controller.current.signal
            )

            const confirmation: ReservationConfirmation = {
                bookingId: booking.id,
                hotelId: hotel.id,
                hotelTitle: hotel.title,
                amount: hotel.price,
                checkIn,
                checkOut,
                passengers,
            }
            sessionStorage.setItem(`reserve-confirmation-${booking.id}`, JSON.stringify(confirmation))

            const target = new URL(payment.paymentUrl, window.location.origin)
            const gatewayUrl = target.pathname.startsWith('/mock-payment')
                ? new URL(target.pathname, window.location.origin)
                : target

            if (gatewayUrl.origin === window.location.origin) {
                gatewayUrl.searchParams.set('hotelId', hotel.id)
                gatewayUrl.searchParams.set('callback', `${returnUrl.pathname}${returnUrl.search}`)
            }

            window.location.assign(gatewayUrl.toString())
        } catch (e) {
            if (e instanceof DOMException && e.name === 'AbortError') return
            toast.error(e instanceof Error ? e.message : 'امکان انتقال به درگاه وجود ندارد')
            setLoading(false)
        }
    }

    return (
        <div className='flex w-full min-w-0 flex-col gap-5 sm:gap-6'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='text-sm font-medium text-[#060425] dark:text-white-1'>مبلغ قابل پرداخت</span>
                <span className='text-sm font-bold text-[#0A7FD6] sm:text-base'>{faNum(hotel.price)} تومان</span>
            </div>
            <button type='button' onClick={pay} disabled={loading} className='h-12 w-full cursor-pointer rounded-[16px] bg-[#15977D] text-sm font-medium text-white transition-all duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:h-13 sm:text-base'>
                {loading ? 'در حال انتقال...' : 'پرداخت'}
            </button>
        </div>
    )
}

export default ReservePayment
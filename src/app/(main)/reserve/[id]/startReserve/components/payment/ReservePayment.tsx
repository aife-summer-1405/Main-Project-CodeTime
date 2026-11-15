'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import type { Booking } from '@/lib/Api/booking'
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

    const pay = () => {
        if (loading) return
        setLoading(true)

        const confirmation: ReservationConfirmation = {
            bookingId: booking.id,
            hotelId: hotel.id,
            hotelTitle: hotel.title,
            amount: hotel.price,
            checkIn,
            checkOut,
            passengers,
        }

        try {
            sessionStorage.setItem(`reserve-confirmation-${booking.id}`, JSON.stringify(confirmation))
            const callback = new URL(window.location.href)
            callback.searchParams.set('payment', 'success')
            callback.searchParams.set('bookingId', String(booking.id))

            const paymentUrl = new URL(`/mock-payment/${booking.id}`, window.location.origin)
            paymentUrl.searchParams.set('hotelId', hotel.id)
            paymentUrl.searchParams.set('callback', `${callback.pathname}${callback.search}`)
            window.location.assign(paymentUrl.toString())
        } catch {
            toast.error('امکان انتقال به درگاه  وجود ندارد')
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
                {loading ? 'در حال انتقال...' : 'پرداخت '}
            </button>
        </div>
    )
}

export default ReservePayment

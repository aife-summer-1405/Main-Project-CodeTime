'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import type { ContactFormData } from '@/lib/schemas/reserve'
import { buildBookingBody, createBooking, type Booking } from '@/lib/Api/booking'
import { faNum, toFaDigits } from '@/lib/utils/reserve'
import FormSection from '../FormSection'
import type { Passenger, ReserveHotel, ReserveStepName } from '../../types/types'

interface IStep {
    hotel: ReserveHotel
    passengers: Passenger[]
    contact: ContactFormData
    checkIn?: string
    checkOut?: string
    onBooked: (booking: Booking) => void
    setStep: (step: ReserveStepName) => void
}

const Info = ({ label, value }: { label: string; value: string }) => (
    <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm'>
        <span className='shrink-0 font-medium text-[#060425] dark:text-white-1'>{label}</span>
        <span dir='ltr' className='min-w-0 break-all text-[#777] dark:text-white-1'>{value}</span>
    </div>
)

const ReserveStep2 = ({ hotel, passengers, contact, checkIn, checkOut, onBooked, setStep }: IStep) => {
    const [loading, setLoading] = useState(false)

    const submit = async () => {
        if (!checkIn || !checkOut) {
            toast.error('تاریخ ورود و خروج مشخص نیست')
            return
        }
        if (passengers.length === 0) {
            toast.error('حداقل اطلاعات یک مسافر را وارد کنید')
            return
        }

        setLoading(true)
        try {
            const booking = await toast.promise(
                createBooking(buildBookingBody({
                    houseId: hotel.id,
                    checkIn,
                    checkOut,
                    passengers,
                    email: contact.email,
                    phone: contact.phone,
                })),
                {
                    loading: 'در حال ثبت رزرو...',
                    
                    error: (error: Error) => error.message || 'ثبت رزرو انجام نشد',
                }
            )
            onBooked(booking)
            setStep('payment')
        } catch {
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex w-full min-w-0 flex-col gap-5 sm:gap-6'>
            <FormSection title='اطلاع رسانی سفر'>
                <div className='flex flex-col gap-3'>
                    <Info label='ایمیل' value={contact.email} />
                    <Info label='شماره تماس' value={toFaDigits(contact.phone)} />
                </div>
            </FormSection>

            <hr className='border-[#E0E0E0]' />

            <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='text-sm font-medium text-[#060425] dark:text-white-1'>قیمت هتل</span>
                <span className='text-sm font-bold text-[#0A7FD6] sm:text-base'>{faNum(hotel.price)} تومان</span>
            </div>

            <div className='flex flex-col gap-3 sm:gap-4'>
                <button type='button' onClick={submit} disabled={loading} className='h-12 w-full cursor-pointer rounded-[16px] bg-[#10088F] text-sm font-medium text-white transition-all duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:h-13 sm:text-base'>
                    {loading ? 'در حال ثبت...' : 'پرداخت آنلاین'}
                </button>
                <button type='button' onClick={() => setStep('step1')} disabled={loading} className='h-12 w-full cursor-pointer rounded-[16px] border-2 border-[#10088F] text-sm font-medium text-[#10088F] transition-all duration-300 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white-1 dark:text-white-1 sm:h-13'>
                    مرحله قبل
                </button>
            </div>
        </div>
    )
}

export default ReserveStep2

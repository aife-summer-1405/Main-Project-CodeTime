'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getHotelById, toReserveHotel } from '@/lib/Api/house'
import { faNum } from '@/lib/utils/reserve'
import type { ReserveHotel } from '@/app/(main)/reserve/[id]/startReserve/types/types'

interface IProps {
    id: string
    hotelId: string
    callback: string
}

const MockPayment = ({ id, hotelId, callback }: IProps) => {
    const router = useRouter()
    const [hotel, setHotel] = useState<ReserveHotel | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true
        getHotelById(hotelId)
            .then((data) => { if (active) setHotel(toReserveHotel(data)) })
            .catch(() => { if (active) setError('دریافت اطلاعات هتل با خطا مواجه شد') })
        return () => { active = false }
    }, [hotelId])

    return (
        <main dir='rtl' className='flex min-h-[100dvh] w-full items-center justify-center p-4'>
            <section className='mx-auto flex min-h-[420px] w-full max-w-[420px] flex-col items-center justify-center gap-5 rounded-2xl p-5 text-center shadow-[0_0_10px_0_#005EA41A]'>
                <h1 className='text-lg font-bold text-[#060425] dark:text-white-1'>درگاه پرداخت </h1>
                <p className='text-sm text-[#777]'>شناسه رزرو: {faNum(Number(id))}</p>
                {error ? <p className='text-sm text-red-500'>{error}</p> : !hotel ? <p className='text-sm text-[#777]'>در حال دریافت اطلاعات هتل...</p> : (
                    <>
                        <p className='text-sm font-medium text-[#060425] dark:text-white-1'>{hotel.title}</p>
                        <p className='text-xs text-[#777]'>شناسه هتل: {hotel.id}</p>
                        <p className='text-base font-bold text-[#0A7FD6]'>{faNum(hotel.price)} تومان</p>
                        <div className='flex w-full flex-col gap-3'>
                            <button type='button' onClick={() => router.push(callback)} className='h-12 w-full cursor-pointer rounded-2xl bg-[#15977D] text-sm font-medium text-white transition-all active:scale-[0.97]'>پرداخت موفق </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}

export default MockPayment

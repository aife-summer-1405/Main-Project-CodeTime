import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { isAxiosError } from 'axios'
import ReserveFlow from './ReserveFlow'
import { getHotelById, toReserveHotel } from '@/lib/Api/house'

interface IProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>
}

const loadHotel = async (id: string) => {
    try {
        return toReserveHotel(await getHotelById(id))
    } catch (e) {
        if (isAxiosError(e) && e.response?.status === 404) notFound()
        throw e
    }
}

const ReserveContent = async ({ params, searchParams }: IProps) => {
    const { id } = await params
    const { checkIn, checkOut, guests } = await searchParams

    const hotel = await loadHotel(id)
    const guestCount = Math.min(Math.max(Number(guests) || 1, 1), hotel.capacity)

    return <ReserveFlow hotel={hotel} checkIn={checkIn} checkOut={checkOut} guests={guestCount} />
}

const StartReservePage = (props: IProps) => (
    <Suspense fallback={<div className='min-h-[70dvh]' />}>
        <ReserveContent {...props} />
    </Suspense>
)

export default StartReservePage
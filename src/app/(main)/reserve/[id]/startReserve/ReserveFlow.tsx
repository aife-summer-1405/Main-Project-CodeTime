'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { ContactFormData } from '@/lib/schemas/reserve'
import type { Booking } from '@/lib/Api/booking'
import type { Passenger, ReservationConfirmation, ReserveHotel, ReserveStepName } from './types/types'
import ReserveStepper from './components/ReserveStepper'
import HotelSummary from './components/HotelSummary'
import ReserveStep1 from './components/step1/ReserveStep1'
import ReserveStep2 from './components/step2/ReserveStep2'
import ReservePayment from './components/payment/ReservePayment'
import ReserveStep3 from './components/step3/ReserveStep3'

interface IProps {
    hotel: ReserveHotel
    checkIn?: string
    checkOut?: string
    guests: number
}

const stepperIndex: Record<ReserveStepName, number> = { step1: 1, step2: 2, payment: 3, step3: 4 }

const ReserveFlow = ({ hotel, checkIn, checkOut, guests }: IProps) => {
    const searchParams = useSearchParams()
    const [step, setStep] = useState<ReserveStepName>('step1')
    const [confirmation, setConfirmation] = useState<ReservationConfirmation | null>(null)
    const [passengers, setPassengers] = useState<Passenger[]>([])
    const [contact, setContact] = useState<ContactFormData | null>(null)
    const [booking, setBooking] = useState<Booking | null>(null)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [step])

    useEffect(() => {
        if (searchParams.get('payment') !== 'success') return

        const bookingId = searchParams.get('bookingId')
        if (!bookingId) return

        try {
            const raw = sessionStorage.getItem(`reserve-confirmation-${bookingId}`)
            if (!raw) return
            const saved = JSON.parse(raw) as ReservationConfirmation
            if (saved.bookingId !== Number(bookingId) || saved.hotelId !== hotel.id) return

            setConfirmation(saved)
            setPassengers(saved.passengers)
            setStep('step3')
        } catch {
            sessionStorage.removeItem(`reserve-confirmation-${bookingId}`)
        }
    }, [searchParams, hotel.id])

    return (
        <div className='mx-auto w-full max-w-[1920px] px-4 pb-10 sm:px-6 lg:px-10 xl:px-24'>
            <div className='flex gap-2 pt-4 text-xs font-semibold text-gray-1 sm:text-sm'>
                <Link href='/'>خانه /</Link>
                <Link href='/reserve'>رزرو هتل /</Link>
                <Link href={`/reserve/${hotel.id}`} className='truncate text-[#10088F]'>
                    {hotel.title}
                </Link>
            </div>

            <div dir='rtl' className='mt-6 flex flex-col gap-8 xl:flex-row xl:items-start'>
                <aside className='w-full shrink-0 xl:w-[360px]'>
                    <HotelSummary
                        hotel={hotel}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        total={hotel.price}
                        passengers={step === 'step1' ? undefined : passengers}
                        showChangeHotel={step === 'step1'}
                        showExtraCosts={step === 'step2'}
                        onEditPassengers={step === 'step2' ? () => setStep('step1') : undefined}
                    />
                </aside>

                <main className='mx-auto w-full min-w-0 max-w-[520px] flex-1'>
                    {step === 'step1' && (
                        <ReserveStep1
                            guests={guests}
                            total={hotel.price}
                            passengers={passengers}
                            setPassengers={setPassengers}
                            contact={contact}
                            setContact={setContact}
                            setStep={setStep}
                        />
                    )}
                    {step === 'step2' && contact && (
                        <ReserveStep2
                            hotel={hotel}
                            passengers={passengers}
                            contact={contact}
                            checkIn={checkIn}
                            checkOut={checkOut}
                            onBooked={setBooking}
                            setStep={setStep}
                        />
                    )}
                    {step === 'payment' && booking && (
                        <ReservePayment hotel={hotel} booking={booking} passengers={passengers} checkIn={checkIn} checkOut={checkOut} />
                    )}
                    {step === 'step3' && confirmation && <ReserveStep3 confirmation={confirmation} />}
                </main>

                <ReserveStepper current={stepperIndex[step]} />
            </div>
        </div>
    )
}

export default ReserveFlow

'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ChevronUp, MapPin, Star } from 'lucide-react'
import type { Passenger, ReserveHotel } from '../types/types'
import { faNum, formatFaDate, toFaDigits } from '@/lib/utils/reserve'

interface IProps {
    hotel: ReserveHotel
    checkIn?: string
    checkOut?: string
    total: number
    passengers?: Passenger[]
    showHeading?: boolean
    showChangeHotel?: boolean
    showExtraCosts?: boolean
    onEditPassengers?: () => void
}

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className='flex items-center justify-between gap-3'>
        <span className='text-[15px] font-medium text-[#060425CC] dark:text-white-1'>{label}</span>
        <span className='text-[13px] text-[#777] dark:text-white-1'>{children}</span>
    </div>
)

const Blue = ({ children }: { children: ReactNode }) => (
    <span className='font-bold text-[#0A7FD6]'>{children}</span>
)
const Green = ({ children }: { children: ReactNode }) => (
    <span className='font-bold text-[#15977D]'>{children}</span>
)

const HotelSummary = ({
    hotel,
    checkIn,
    checkOut,
    total,
    passengers,
    showHeading,
    showChangeHotel,
    showExtraCosts,
    onEditPassengers,
}: IProps) => {
    const [open, setOpen] = useState(true)

    const compact = !!passengers
    const oldPrice = hotel.discounted_price
    const hasDiscount = oldPrice !== null && oldPrice > hotel.price
    const percent = hasDiscount
        ? Math.round((1 - hotel.price / oldPrice) * 100)
        : 0

    const title = (
        <div className={`flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 ${compact ? '' : 'justify-center'}`}>
            <h2 className='min-w-0 break-words text-base font-bold leading-7 text-[#060425] dark:text-white-1 sm:text-xl'>
                {hotel.title}
            </h2>

            <div className='flex shrink-0 items-center gap-1'>
                <span className='text-xs font-medium text-[#777]'>
                    {hotel.rating}
                </span>
                <Star size={16} className='shrink-0  text-[#FFB400]' />
            </div>
        </div>
    )

    const address = (
        <p className='flex min-w-0 items-start gap-1 text-sm leading-6 text-[#060425CC] dark:text-white-1'>
            <MapPin size={18} className='mt-0.5 shrink-0' />
            <span className={`min-w-0 break-words [overflow-wrap:anywhere] ${compact ? 'line-clamp-2' : ''}`}>
                {hotel.address}
            </span>
        </p>
    )

    return (
        <div className='flex w-full min-w-0 flex-col gap-5'>
            {showHeading && (
                <h2 className='text-base font-bold text-[#0887CA]'>
                    مشخصات هتل
                </h2>
            )}

            {compact ? (
                <div className='flex w-full min-w-0 items-center gap-3 sm:gap-4'>
                    <img
                        src={hotel.image}
                        alt={hotel.title}
                        className='h-[110px] w-[140px] shrink-0 rounded-[20px] bg-[#E0E0E0] object-cover sm:h-[150px] sm:w-[200px]'
                    />

                    <div className='flex min-w-0 flex-1 flex-col gap-2 sm:gap-3'>
                        {title}
                        {address}
                    </div>
                </div>
            ) : (
                <>
                    <img
                        src={hotel.image}
                        alt={hotel.title}
                        className='aspect-[8/5] w-full rounded-3xl bg-[#E0E0E0] object-cover'
                    />

                    <div className='flex min-w-0 flex-col gap-3'>
                        {title}
                        {address}
                    </div>
                </>
            )}

            <div className='flex flex-col gap-4'>
                <Row label='تاریخ ورود به هتل'>
                    {formatFaDate(checkIn)}
                </Row>

                <Row label='تاریخ خروج از هتل'>
                    {formatFaDate(checkOut)}
                </Row>

                <Row label='قیمت با تخفیف'>
                    <span className='flex items-center gap-3'>
                        {hasDiscount && (
                            <>
                                <span className='text-xs text-[#777] line-through decoration-red-500'>
                                    {faNum(oldPrice)} تومان
                                </span>

                                <span className='rounded-md bg-[#F4003E] px-2 py-1 text-xs font-bold text-white'>
                                    %{faNum(percent)}
                                </span>
                            </>
                        )}

                        <span className='text-sm'>
                            <Blue>{faNum(hotel.price)} تومان</Blue>
                        </span>
                    </span>
                </Row>
            </div>

            <div className='my-2 flex w-full items-center justify-center sm:my-3.5'>
                <div className='h-0.5 w-[90%] bg-[linear-gradient(90deg,#F5F5F5,#060425,#F5F5F5)] opacity-50' />
            </div>

            {showChangeHotel && (
                <Link
                    href='/reserve'
                    className='flex h-11 items-center justify-center rounded-lg border border-[#0887CA] text-sm font-medium text-[#0887CA] transition-all duration-300 active:scale-[0.9]'
                >
                    تغییر هتل
                </Link>
            )}

            {passengers && (
                <section className='flex flex-col gap-5'>
                    <button
                        type='button'
                        onClick={() => setOpen((o) => !o)}
                        className='flex w-full items-center justify-between'
                    >
                        <span className='text-base font-bold text-[#0887CA]'>
                            مشخصات مسافران{' '}
                            <span className='font-medium text-[#777]'>
                                ( {faNum(passengers.length)} مسافر )
                            </span>
                        </span>

                        <ChevronUp
                            size={20}
                            className={`text-[#0887CA] transition-transform duration-300 ${open ? '' : 'rotate-180'}`}
                        />
                    </button>

                    {open && (
                        <div className='flex flex-col gap-6 px-4'>
                            {passengers.map((p) => (
                                <div key={p.id} className='flex flex-col gap-4'>
                                    {showExtraCosts && (
                                        <Row label='بازه سنی'>بزرگسال</Row>
                                    )}

                                    <Row label='نام و نام خانوادگی'>
                                        {p.fullName}
                                    </Row>

                                    <Row label='جنسیت'>
                                        {p.gender === 'male' ? 'مرد' : 'زن'}
                                    </Row>

                                    <Row label='کد ملی/ شماره پاسپورت'>
                                        <Green>{toFaDigits(p.nationalId)}</Green>
                                    </Row>

                                    <Row label='تاریخ تولد'>
                                        {p.birthDate}
                                    </Row>

                                    {showExtraCosts && (
                                        <Row label='خدمات'>-</Row>
                                    )}

                                    {showExtraCosts && (
                                        <Row label='مبلغ خدمات'>-</Row>
                                    )}

                                    <Row label='قیمت'>
                                        <Blue>
                                            {faNum(Math.round(total / passengers.length))} تومان
                                        </Blue>
                                    </Row>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {onEditPassengers && (
                <div className='cursor-pointer px-4'>
                    <button
                        type='button'
                        onClick={onEditPassengers}
                        className='h-12 w-full cursor-pointer rounded-[16px] bg-[#10088F] text-sm font-medium text-white transition-all duration-300 active:scale-[0.9]'
                    >
                        ویرایش مسافران
                    </button>
                </div>
            )}

            {showExtraCosts && (
                <>
                    <div className='my-2 flex w-full items-center justify-center sm:my-3.5'>
                        <div className='h-0.5 w-[90%] bg-[linear-gradient(90deg,#F5F5F5,#060425,#F5F5F5)] opacity-50' />
                    </div>

                    <section className='flex flex-col gap-3'>
                        <h3 className='text-base font-bold text-[#0887CA]'>
                            هزینه جانبی
                        </h3>

                        <p className='text-xs leading-7 text-[#777]'>
                            هزینه جانبی برای این رزرو ثبت نشده است.
                        </p>
                    </section>
                </>
            )}
        </div>
    )
}

export default HotelSummary

'use client'

import Link from 'next/link'
import { ExternalLink, MapPin, Star } from 'lucide-react'
import SafeImage from '@/functions/safeImage'
import { fa, faDate, faTime, toFaDigits } from '@/lib/format'
import type { AdminBooking } from '@/lib/Api/dashboard/admin/bookings'
import type { BookingHouse } from '@/lib/Api/dashboard/admin/houses'
import { bookingStatusOptions } from '@/lib/dashboard/seller-data'
import { transactionLabel } from '@/lib/Api/dashboard/common/transactions'
import Modal from '../../components/Modal'

type Props = {
    booking: AdminBooking | null
    loading: boolean
    house: BookingHouse | null
    houseLoading: boolean
    onClose: () => void
}

const NO_INFO = 'اطلاعاتی وجود ندارد'

const head = 'grid items-center gap-3 rounded-2xl bg-[#E6F1F6] px-4 py-3 text-[11px] text-[#55536D] dark:bg-[#1C1C1C] dark:text-[#A1A1AA]'
const row =
    'grid items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[11px] text-[#060425] shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212] dark:text-white'

const cols = { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }

const day = (value?: string | null) => (value && /^\d{4}-\d{2}-\d{2}/.test(value) ? faDate(value) : value || NO_INFO)

const genderLabel = (gender: string) => (gender === 'female' ? 'خانم' : gender === 'male' ? 'آقا' : NO_INFO)

export function HouseSkeleton() {
    return (
        <div className='flex gap-4'>
            <div className='h-24 w-32 shrink-0 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700' />
            <div className='flex flex-1 flex-col gap-3'>
                <div className='h-5 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                <div className='h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                <div className='h-4 w-1/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
            </div>
        </div>
    )
}

export function HouseCard({ house }: { house: BookingHouse }) {
    const features = [
        house.rooms ? `${fa(house.rooms)} خواب` : '',
        house.bathrooms ? `${fa(house.bathrooms)} حمام` : '',
        house.parking ? `${fa(house.parking)} پارکینگ` : '',
        house.capacity ? `ظرفیت ${fa(house.capacity)} نفر` : '',
    ].filter(Boolean)

    return (
        <div className='flex flex-col gap-3 sm:flex-row'>
            <SafeImage src={house.photos[0] ?? null} className='h-28 w-full shrink-0 rounded-2xl object-cover sm:w-40' />

            <div className='flex min-w-0 flex-1 flex-col gap-2'>
                <h4 className='flex items-center gap-2 text-sm font-bold text-[#060425] dark:text-white'>
                    <span className='truncate'>{house.title || NO_INFO}</span>
                    {house.rate > 0 && (
                        <span className='flex shrink-0 items-center gap-0.5 text-[11px] font-normal'>
                            {fa(house.rate)}
                            <Star size={14} color='#EDB305' />
                        </span>
                    )}
                </h4>

                <p className='flex items-center gap-1.5 text-[11px] text-[#55536D] dark:text-[#A1A1AA]'>
                    <MapPin size={14} className='shrink-0' />
                    <span className='truncate'>{house.address || NO_INFO}</span>
                </p>

                <p className='flex flex-wrap gap-x-3 text-[10px] text-[#8A8997]'>
                    {[house.category, transactionLabel(house.transactionType), ...features].filter((item) => item && item !== '—').map((item) => (
                        <span key={item}>{item}</span>
                    ))}
                </p>

                <div className='flex flex-wrap items-center justify-between gap-2'>
                    <strong className='text-xs text-[#0087CA]'>
                        {house.price ? `${fa(house.discountedPrice ?? house.price)} تومان` : NO_INFO}
                    </strong>
                    <Link href={`/reserve/${house.id}`} className='flex items-center gap-1 text-[11px] text-[#0087CA] transition hover:opacity-80'>
                        مشاهده ملک
                        <ExternalLink size={13} />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function AdminBookingDetailModal({ booking, loading, house, houseLoading, onClose }: Props) {
    const dates = booking?.reservedDates ?? []

    const info = booking
        ? [
              { label: 'کد رزرو', value: toFaDigits(booking.id) },
              { label: 'شناسه کاربر', value: toFaDigits(booking.userId) },
              { label: 'شناسه ملک', value: toFaDigits(booking.houseId) },
              { label: 'وضعیت', value: bookingStatusOptions.find((o) => o.value === booking.status)?.label ?? booking.status },
              { label: 'تاریخ ورود', value: day(dates[0]) },
              { label: 'تاریخ خروج', value: day(dates[dates.length - 1]) },
              { label: 'ایمیل', value: booking.sharedEmail || NO_INFO, ltr: true },
              { label: 'موبایل', value: booking.sharedMobile || NO_INFO, ltr: true },
              { label: 'زمان ثبت', value: booking.createdAt ? `${faDate(booking.createdAt)} - ${faTime(booking.createdAt)}` : NO_INFO },
              { label: 'آخرین بروزرسانی', value: booking.updatedAt ? `${faDate(booking.updatedAt)} - ${faTime(booking.updatedAt)}` : NO_INFO },
          ]
        : []

    return (
        <Modal open={!!booking} onClose={onClose} title='جزئیات رزرو' className='max-w-2xl'>
            {booking && (
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'>
                        <h4 className='text-xs font-bold text-[#060425] dark:text-white'>اطلاعات ملک</h4>
                        {houseLoading ? (
                            <HouseSkeleton />
                        ) : house ? (
                            <HouseCard house={house} />
                        ) : (
                            <p className='py-4 text-center text-[11px] text-[#8A8997]'>اطلاعات ملک در دسترس نیست</p>
                        )}
                    </div>

                    <div className='grid gap-3 sm:grid-cols-2'>
                        {info.map(({ label, value, ltr }) => (
                            <div key={label} className='flex min-w-0 flex-col gap-1 rounded-2xl bg-white px-4 py-3 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'>
                                <span className='text-[10px] text-[#8A8997]'>{label}</span>
                                {loading ? (
                                    <span className='h-4 w-2/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                                ) : (
                                    <span dir={ltr ? 'ltr' : undefined} className={`truncate text-xs font-bold text-[#060425] dark:text-white ${ltr ? 'text-right' : ''}`}>
                                        {value}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-col gap-3'>
                        <h4 className='text-xs font-bold text-[#060425] dark:text-white'>مسافران</h4>
                        <div className='overflow-x-auto'>
                            <div className='flex min-w-[460px] flex-col gap-3'>
                                <div style={cols} className={head}>
                                    <span>نام</span>
                                    <span>جنسیت</span>
                                    <span>کد ملی</span>
                                    <span>تاریخ تولد</span>
                                </div>

                                {booking.travelers.length ? (
                                    booking.travelers.map((t, i) => (
                                        <div key={`${t.nationalId}-${i}`} style={cols} className={row}>
                                            <span className='truncate'>{`${t.firstName} ${t.lastName}`.trim() || NO_INFO}</span>
                                            <span>{genderLabel(t.gender)}</span>
                                            <span>{t.nationalId ? toFaDigits(t.nationalId) : NO_INFO}</span>
                                            <span>{day(t.birthDate)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className={`${row} justify-center text-center text-[#8A8997]`}>{NO_INFO}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    )
}

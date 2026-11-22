'use client'

import { useState } from 'react'
import { Calendar, MapPin, Send, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import SafeImage from '@/functions/safeImage'
import { fa, faDate, faTime } from '@/lib/format'
import type { DetailedBooking } from '@/lib/dashboard/bookingsApi'
import Modal from '../../components/Modal'

export type BookingModalName = 'details' | 'travelers' | 'payments' | 'changes' | null

type Props = {
    booking: DetailedBooking | null
    modal: BookingModalName
    loading?: boolean
    onChange: (modal: BookingModalName) => void
    onReceipt: (booking: DetailedBooking, paymentId: string) => void
}

const NO_INFO = 'اطلاعاتی وجود ندارد'

const head = 'grid items-center gap-3 rounded-2xl bg-[#E6F1F6] px-4 py-3 text-[11px] text-[#55536D] dark:bg-[#1C1C1C] dark:text-[#A1A1AA]'
const row =
    'grid items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[11px] text-[#060425] shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212] dark:text-white'

const navButton =
    'h-11 min-w-0 flex-1 cursor-pointer rounded-xl bg-[#10088F] px-2 text-xs text-white transition active:scale-[0.95] dark:bg-[#0087CA]'

const hasText = (v?: string | null) => !!v && v.trim().length > 0
const validDate = (v?: string | null) => !!v && !Number.isNaN(new Date(v).getTime())

function EmptyRow() {
    return <div className={`${row} justify-center text-center text-[#8A8997]`}>{NO_INFO}</div>
}

function Skeleton() {
    return (
        <div className='flex flex-col gap-3'>
            {[0, 1, 2].map((i) => (
                <div key={i} className='h-11 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-700' />
            ))}
        </div>
    )
}

function PhotoGallery({ photos, fallback }: { photos: string[]; fallback: string }) {
    const list = photos.length ? photos : fallback ? [fallback] : []
    const [active, setActive] = useState(0)
    const src = list[active] ?? list[0]

    return (
        <div className='flex shrink-0 flex-col gap-2 sm:w-52'>
            {src ? (
                <SafeImage src={src} className='h-36 w-full rounded-2xl object-cover' />
            ) : (
                <div className='flex h-36 w-full items-center justify-center rounded-2xl bg-[#E6F1F6] text-[11px] text-[#8A8997] dark:bg-[#1C1C1C]'>
                    {NO_INFO}
                </div>
            )}
            {list.length > 1 && (
                <div className='flex gap-2'>
                    {list.slice(0, 4).map((p, i) => (
                        <button
                            key={p}
                            type='button'
                            onClick={() => setActive(i)}
                            className={`h-10 flex-1 cursor-pointer overflow-hidden rounded-lg border-2 transition ${i === active ? 'border-[#0087CA]' : 'border-transparent opacity-70'
                                }`}
                        >
                            <SafeImage src={p} className='h-full w-full object-cover' />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function BookingModals({ booking, modal, loading = false, onChange, onReceipt }: Props) {
    const close = () => onChange(null)
    const back = () => onChange('details')
    const gridCols = (n: number) => ({ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` })

    return (
        <>
            <Modal open={modal === 'details' && !!booking} onClose={close} className='max-w-xl'>
                {booking && (
                    <div className='flex flex-col gap-4'>
                        <div dir='ltr' className='flex flex-col-reverse gap-4 sm:flex-row'>
                            <div dir='rtl' className='flex min-w-0 flex-1 flex-col gap-2.5'>
                                {loading ? (
                                    <div className='flex flex-col gap-3'>
                                        <div className='h-6 w-3/4 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                                        <div className='h-4 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                                        <div className='h-4 w-2/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                                        <div className='h-4 w-1/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                                    </div>
                                ) : (
                                    <>
                                        <h3 className='flex items-center gap-1.5 text-base font-bold text-[#060425] dark:text-white'>
                                            {hasText(booking.title) ? booking.title : NO_INFO}
                                            {booking.rating > 0 && (
                                                <span className='flex items-center gap-0.5 text-[11px] text-[#222]'>
                                                    {fa(booking.rating)}
                                                    <Star size={15} color='#EDB305' />
                                                </span>
                                            )}
                                        </h3>

                                        <p className='flex items-center gap-1.5 text-[11px] text-[#060425] dark:text-white'>
                                            <MapPin size={15} className='shrink-0' />
                                            {hasText(booking.address) ? booking.address : NO_INFO}
                                        </p>

                                        <p className='flex items-center gap-1.5 text-[10px] text-[#8A8997]'>
                                            <Calendar size={15} className='shrink-0' />
                                            {validDate(booking.checkIn) && validDate(booking.checkOut)
                                                ? `${faDate(booking.checkIn)} تا ${faDate(booking.checkOut)}`
                                                : NO_INFO}
                                        </p>

                                        <p className='flex flex-wrap gap-x-3 text-[10px] text-[#55536D] dark:text-[#A1A1AA]'>
                                            {booking.features?.length
                                                ? booking.features.map((f) => <span key={f}>{f}</span>)
                                                : NO_INFO}
                                        </p>

                                        <p className='text-[11px] flex items-center gap-2.5'>
                                            <span className='text-[#55536D] dark:text-[#A1A1AA]'>قیمت خرید </span>
                                            {booking.propertyPrice > 0 ? (
                                                <strong className='text-[#0087CA]'>{fa(booking.propertyPrice)} تومان</strong>
                                            ) : (
                                                <span className='text-[#8A8997]'>{NO_INFO}</span>
                                            )}
                                        </p>
                                    </>
                                )}
                            </div>

                            <PhotoGallery key={booking.id} photos={booking.photos ?? []} fallback={booking.image} />
                        </div>

                        <div>
                            <h4 className='mb-2 text-xs font-bold text-[#060425] dark:text-white'>توضیحات بیشتر</h4>
                            {loading ? (
                                <div className='h-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                            ) : (
                                <p className='text-[11px] leading-6 text-[#777] dark:text-[#A1A1AA]'>
                                    {hasText(booking.description) ? booking.description : NO_INFO}
                                </p>
                            )}
                        </div>

                        <div className='flex flex-wrap items-center gap-2'>
                            <span className='text-[11px] font-bold text-[#060425] dark:text-white'>برچسب ها</span>
                            {loading ? (
                                <div className='h-6 w-40 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700' />
                            ) : booking.tags?.length ? (
                                booking.tags.map((tag) => (
                                    <span key={tag} className='rounded-full bg-[#0887CA] px-3 py-1 text-[10px] text-white'>
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <span className='text-[10px] text-[#8A8997]'>{NO_INFO}</span>
                            )}
                        </div>

                        <div className='flex gap-3'>
                            <button type='button' className={navButton} onClick={() => onChange('travelers')}>
                                مسافر ها
                            </button>
                            <button type='button' className={navButton} onClick={() => onChange('payments')}>
                                پرداخت ها
                            </button>
                            <button type='button' className={navButton} onClick={() => onChange('changes')}>
                                تاریخچه تغییرات
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal open={modal === 'travelers' && !!booking} onClose={back} title='جزئیات مسافران' className='max-w-xl'>
                {booking && (
                    <div className='flex flex-col gap-3 overflow-x-auto'>
                        <div className='flex min-w-[420px] flex-col gap-3'>
                            <div style={gridCols(4)} className={head}>
                                <span>نام</span>
                                <span>جنسیت</span>
                                <span>شماره تماس</span>
                                <span className='text-center'>ارسال پیام</span>
                            </div>

                            {loading ? (
                                <Skeleton />
                            ) : booking.travelers?.length ? (
                                booking.travelers.map((t, i) => (
                                    <div key={`${t.name}-${i}`} style={gridCols(4)} className={row}>
                                        <span className='truncate'>{hasText(t.name) ? t.name : NO_INFO}</span>
                                        <span>{t.gender === 'female' ? 'خانم' : t.gender === 'male' ? 'آقا' : NO_INFO}</span>
                                        {hasText(t.phone) ? (
                                            <span dir='ltr' className='text-right'>
                                                {t.phone}
                                            </span>
                                        ) : (
                                            <span className='text-[#8A8997]'>{NO_INFO}</span>
                                        )}
                                        <button
                                            type='button'
                                            aria-label='ارسال پیام'
                                            disabled={!hasText(t.phone)}
                                            onClick={() => toast.success('پیام برای مسافر ارسال شد')}
                                            className='mx-auto cursor-pointer text-[#15977D] transition active:scale-[0.9] disabled:cursor-not-allowed disabled:opacity-40'
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <EmptyRow />
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            <Modal open={modal === 'payments' && !!booking} onClose={back} title='لیست پرداختی ها' className='max-w-2xl'>
                {booking && (
                    <div className='overflow-x-auto'>
                        <div className='flex min-w-[520px] flex-col gap-3'>
                            <div style={gridCols(5)} className={head}>
                                <span>تاریخ</span>
                                <span>زمان</span>
                                <span>شماره پیگیری</span>
                                <span>مبلغ</span>
                                <span />
                            </div>

                            {booking.payments?.length ? (
                                booking.payments.map((p) => (
                                    <div key={p.id} style={gridCols(5)} className={row}>
                                        <span>{validDate(p.date) ? faDate(p.date) : NO_INFO}</span>
                                        <span>{validDate(p.date) ? faTime(p.date) : NO_INFO}</span>
                                        <span>{hasText(p.trackingCode) ? p.trackingCode : NO_INFO}</span>
                                        <strong className='text-[#0087CA]'>{p.amount ? fa(p.amount) : NO_INFO}</strong>
                                        <button
                                            type='button'
                                            onClick={() => onReceipt(booking, p.id)}
                                            className='cursor-pointer text-[#0087CA] underline'
                                        >
                                            مشاهده رسید
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <EmptyRow />
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            <Modal open={modal === 'changes' && !!booking} onClose={back} title='تاریخچه تغییرات' className='max-w-xl'>
                {booking && (
                    <div className='flex flex-col gap-3 overflow-x-auto'>
                        <div className='flex min-w-[360px] flex-col gap-3'>
                            <div style={gridCols(3)} className={head}>
                                <span>تاریخ</span>
                                <span>زمان</span>
                                <span>نوع تغییر</span>
                            </div>

                            {booking.changes?.length ? (
                                booking.changes.map((c) => (
                                    <div key={c.id} style={gridCols(3)} className={row}>
                                        <span>{validDate(c.date) ? faDate(c.date) : NO_INFO}</span>
                                        <span>{validDate(c.date) ? faTime(c.date) : NO_INFO}</span>
                                        <span>{hasText(c.type) ? c.type : NO_INFO}</span>
                                    </div>
                                ))
                            ) : (
                                <EmptyRow />
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    )
}
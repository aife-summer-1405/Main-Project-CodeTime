'use client'

import Modal from '../../components/Modal'
import { fa } from '@/lib/format'
import type { Reservation } from '@/lib/Api/dashboard/buyer/bookings'

type Props = { reservation: Reservation | null; onClose: () => void }

const statusLabel = { success: 'تایید شده', pending: 'در انتظار', cancel: 'لغو شده' }

const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

const Row = ({ label, value }: { label: string; value: string }) => (
    <div className='flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 text-xs shadow-[0px_0px_6px_0px_#0887CA1A] dark:bg-[#1C1C1C]'>
        <span className='shrink-0 text-[#8A8997]'>{label}</span>
        <strong className='text-left text-[#060425] dark:text-white'>{value}</strong>
    </div>
)

export default function ReservationDetailModal({ reservation, onClose }: Props) {
    return (
        <Modal open={!!reservation} onClose={onClose} title='جزئیات رزرو' className='max-w-md'>
            {reservation && (
                <div className='flex flex-col gap-3'>
                    <Row label='اقامتگاه' value={reservation.title} />
                    <Row label='تاریخ ورود' value={formatDate(reservation.checkIn)} />
                    <Row label='تاریخ خروج' value={formatDate(reservation.checkOut)} />
                    <Row label='مبلغ' value={reservation.price > 0 ? `${fa(reservation.price)} تومان` : '—'} />
                    <Row label='وضعیت' value={statusLabel[reservation.group]} />
                    {reservation.mobile && <Row label='شماره تماس' value={reservation.mobile} />}
                    {reservation.email && <Row label='ایمیل' value={reservation.email} />}

                    {reservation.travelers.length > 0 && (
                        <div className='mt-1 flex flex-col gap-2'>
                            <p className='text-xs font-bold text-[#0087CA]'>مسافران</p>
                            {reservation.travelers.map((t, i) => (
                                <Row
                                    key={`${t.nationalId}-${i}`}
                                    label={t.gender === 'female' ? 'خانم' : 'آقا'}
                                    value={`${t.name}${t.nationalId ? ` - ${t.nationalId}` : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Modal>
    )
}

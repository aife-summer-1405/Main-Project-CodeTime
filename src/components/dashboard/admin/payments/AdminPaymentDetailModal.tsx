'use client'

import { useEffect, useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import { faDate, faTime, toFaDigits } from '@/lib/format'
import { getAdminBooking, type AdminBooking } from '@/lib/Api/dashboard/admin/bookings'
import { getAdminPayment, paymentStatusOptions, type AdminPayment } from '@/lib/Api/dashboard/admin/payments'
import { getAdminUserById, type AdminUser } from '@/lib/Api/dashboard/admin/users'
import { getBookingHouse, type BookingHouse } from '@/lib/Api/dashboard/admin/houses'
import { bookingStatusOptions } from '@/lib/dashboard/seller-data'
import Modal from '../../components/Modal'
import RoleBadge from '../RoleBadge'
import { HouseCard, HouseSkeleton } from '../bookings/AdminBookingDetailModal'
import { toman } from './paymentColumns'

type Props = { payment: AdminPayment | null; onClose: () => void }

const NO_INFO = 'اطلاعاتی وجود ندارد'

const card = 'flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'
const title = 'text-xs font-bold text-[#060425] dark:text-white'

const stamp = (value: string | null) => (value ? `${faDate(value)} - ${faTime(value)}` : NO_INFO)

function Cell({ label, value, loading, ltr }: { label: string; value: string; loading?: boolean; ltr?: boolean }) {
    return (
        <div className='flex min-w-0 flex-col gap-1 rounded-2xl bg-white px-4 py-3 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'>
            <span className='text-[10px] text-[#8A8997]'>{label}</span>
            {loading ? (
                <span className='h-4 w-2/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
            ) : (
                <span dir={ltr ? 'ltr' : undefined} className={`truncate text-xs font-bold text-[#060425] dark:text-white ${ltr ? 'text-right' : ''}`}>
                    {value}
                </span>
            )}
        </div>
    )
}

function UserSkeleton() {
    return (
        <div className='flex items-center gap-3'>
            <div className='h-12 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700' />
            <div className='flex flex-1 flex-col gap-2'>
                <div className='h-4 w-1/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                <div className='h-3 w-1/2 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
            </div>
        </div>
    )
}

function UserInfo({ user }: { user: AdminUser }) {
    return (
        <div className='flex items-center gap-3'>
            <span className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E6F1F6] text-sm font-bold text-[#0069A6] dark:bg-[#1C1C1C]'>
                {user.profilePicture ? <img src={user.profilePicture} alt='' className='h-full w-full object-cover' /> : user.firstName[0] ?? ''}
            </span>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <div className='flex items-center gap-2'>
                    <strong className='truncate text-xs text-[#060425] dark:text-white'>{user.fullName || NO_INFO}</strong>
                    <RoleBadge role={user.role} />
                </div>
                <span className='flex items-center gap-1.5 text-[11px] text-[#55536D] dark:text-[#A1A1AA]'>
                    <Mail size={13} className='shrink-0' />
                    <span dir='ltr' className='truncate'>
                        {user.email || NO_INFO}
                    </span>
                </span>
                <span className='flex items-center gap-1.5 text-[11px] text-[#55536D] dark:text-[#A1A1AA]'>
                    <Phone size={13} className='shrink-0' />
                    <span dir='ltr' className='truncate'>
                        {user.phoneNumber || NO_INFO}
                    </span>
                </span>
            </div>
        </div>
    )
}

export default function AdminPaymentDetailModal({ payment, onClose }: Props) {
    const [full, setFull] = useState<AdminPayment | null>(null)
    const [user, setUser] = useState<AdminUser | null>(null)
    const [userLoading, setUserLoading] = useState(false)
    const [booking, setBooking] = useState<AdminBooking | null>(null)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [house, setHouse] = useState<BookingHouse | null>(null)
    const [houseLoading, setHouseLoading] = useState(false)

    useEffect(() => {
        setFull(payment)
        setUser(null)
        setBooking(null)
        setHouse(null)
        if (!payment) return

        let active = true
        setUserLoading(true)
        setBookingLoading(!!payment.bookingId)
        setHouseLoading(!!payment.bookingId)

        getAdminPayment(payment.id)
            .then((found) => active && setFull(found))
            .catch(() => undefined)

        getAdminUserById(payment.userId)
            .then((found) => active && setUser(found))
            .catch(() => active && setUser(null))
            .finally(() => active && setUserLoading(false))

        if (payment.bookingId) {
            getAdminBooking(payment.bookingId)
                .then((found) => {
                    if (!active) return
                    setBooking(found)
                    return getBookingHouse(found.houseId).then((h) => active && setHouse(h))
                })
                .catch(() => undefined)
                .finally(() => {
                    if (!active) return
                    setBookingLoading(false)
                    setHouseLoading(false)
                })
        }

        return () => {
            active = false
        }
    }, [payment])

    const data = full ?? payment
    const dates = booking?.reservedDates ?? []

    const info = data
        ? [
              { label: 'کد پرداخت', value: toFaDigits(data.id) },
              { label: 'وضعیت', value: paymentStatusOptions.find((o) => o.value === data.status)?.label ?? data.status },
              { label: 'مبلغ', value: toman(data.amount) },
              { label: 'شماره پیگیری', value: data.transactionId || NO_INFO, ltr: !!data.transactionId },
              { label: 'زمان ثبت', value: stamp(data.createdAt) },
              { label: 'آخرین بروزرسانی', value: stamp(data.updatedAt) },
          ]
        : []

    return (
        <Modal open={!!payment} onClose={onClose} title='جزئیات پرداخت' className='max-w-2xl'>
            {data && (
                <div className='flex flex-col gap-5'>
                    <div className='grid gap-3 sm:grid-cols-2'>
                        {info.map(({ label, value, ltr }) => (
                            <Cell key={label} label={label} value={value} ltr={ltr} />
                        ))}
                    </div>

                    <div className='flex flex-col gap-1 rounded-2xl bg-white px-4 py-3 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'>
                        <span className='text-[10px] text-[#8A8997]'>بابت</span>
                        <p className='text-xs font-bold leading-6 text-[#060425] dark:text-white'>{data.description || NO_INFO}</p>
                    </div>

                    <div className={card}>
                        <h4 className={title}>اطلاعات کاربر</h4>
                        {userLoading ? (
                            <UserSkeleton />
                        ) : user ? (
                            <UserInfo user={user} />
                        ) : (
                            <p className='py-4 text-center text-[11px] text-[#8A8997]'>{`اطلاعات کاربر ${toFaDigits(data.userId)} در دسترس نیست`}</p>
                        )}
                    </div>

                    <div className={card}>
                        <h4 className={title}>اطلاعات رزرو</h4>
                        {!data.bookingId ? (
                            <p className='py-4 text-center text-[11px] text-[#8A8997]'>این پرداخت به رزروی متصل نیست</p>
                        ) : bookingLoading ? (
                            <HouseSkeleton />
                        ) : booking ? (
                            <>
                                <div className='grid gap-3 sm:grid-cols-2'>
                                    <Cell label='کد رزرو' value={toFaDigits(booking.id)} />
                                    <Cell label='وضعیت رزرو' value={bookingStatusOptions.find((o) => o.value === booking.status)?.label ?? booking.status} />
                                    <Cell label='تاریخ ورود' value={dates[0] ? faDate(dates[0]) : NO_INFO} />
                                    <Cell label='تاریخ خروج' value={dates.length ? faDate(dates[dates.length - 1]) : NO_INFO} />
                                </div>
                                {houseLoading ? <HouseSkeleton /> : house && <HouseCard house={house} />}
                            </>
                        ) : (
                            <p className='py-4 text-center text-[11px] text-[#8A8997]'>{`اطلاعات رزرو ${toFaDigits(data.bookingId)} در دسترس نیست`}</p>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowUpLeft, CalendarX } from 'lucide-react'
import { BookingsSummary, getDashboardSummary } from '@/lib/dashboard/dashboardApi'

const icon = (src: string) => <img src={src} alt='' className='h-[18px] w-[18px]' />

const stats: { key: keyof BookingsSummary; label: string; icon: React.ReactNode }[] = [
    { key: 'bookingCount', label: 'کل رزروها', icon: icon('/images/clipboard_8342237 1.png') },
    { key: 'conformedBookings', label: 'رزروهای تایید شده', icon: icon('/images/calendar_5069292 1.png') },
    { key: 'pendingBookings', label: 'رزروهای انتظار', icon: icon('/images/loading_6250505 1.png') },
    { key: 'canceledBookings', label: 'رزروهای لغو شده', icon: <CalendarX size={18} className='text-[#10088F] dark:text-[#38A9E0]' /> },
]

const card = 'flex h-[100px] flex-col items-center justify-center gap-1.5 rounded-xl text-center'

export default function StatCards() {
    const [summary, setSummary] = useState<BookingsSummary | null>(null)

    useEffect(() => {
        getDashboardSummary()
            .then(data => setSummary(data.bookings))
            .catch(() => toast.error('دریافت آمار داشبورد با خطا مواجه شد'))
    }, [])

    return (
        <div className='mx-1.5 grid grid-cols-2 gap-3 sm:grid-cols-5'>
            {stats.map(({ key, label, icon }) => (
                <div key={key} className={`${card} shadow-[0px_0px_4px_0px_#005EA433] dark:border-[#2A2A2A] bg-[#F5F5F5] dark:bg-[#121212]`}>
                    {icon}
                    <span className='text-sm leading-none text-[#10088F] dark:text-[#38A9E0]'>{label}</span>
                    <strong className='text-xl leading-none text-[#10088F] dark:text-[#38A9E0]'>
                        {summary ? summary[key].toLocaleString('fa-IR') : '-'}
                    </strong>
                </div>
            ))}

            <Link
                href='/dashboard/reservations'
                className={`${card} col-span-2 border-[#0887CA80] border-2 dark:bg-[#0B2230] transition dark:hover:bg-[#0F2D40] sm:col-span-1`}
            >
                <ArrowUpLeft size={16} className='text-[#0087CA]' />
                <span className='text-sm text-[#55536D] dark:text-[#A1A1AA]'>مشاهده همه</span>
                <strong className='text-xl leading-none text-[#10088F] dark:text-[#38A9E0]'>{summary?.bookingCount}</strong>
            </Link>
        </div>
    )
}
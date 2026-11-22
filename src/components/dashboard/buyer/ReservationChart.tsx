'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { fa } from '@/lib/format'
import { getDashboardSummary, type BookingsSummary } from '@/lib/dashboard/dashboardApi'

export default function BookingsChart() {
    const [summary, setSummary] = useState<BookingsSummary | null>(null)

    useEffect(() => {
        getDashboardSummary()
            .then((data) => setSummary(data.bookings))
            .catch(() => toast.error('دریافت نمودار رزروها با خطا مواجه شد'))
    }, [])

    const chartData = summary
        ? [
              { status: 'تایید شده', count: summary.conformedBookings },
              { status: 'در انتظار', count: summary.pendingBookings },
              { status: 'لغو شده', count: summary.canceledBookings },
          ]
        : []

    return (
        <section className='flex min-h-[300px] flex-col rounded-2xl bg-[#F5F5F5] p-4 shadow-[0px_0px_4px_0px_#005EA433] dark:border-[#2A2A2A] dark:bg-[#121212]'>
            <h3 className='text-xs font-bold'>نمودار رزرو ها</h3>

            {!summary && <div className='mt-4 h-40 animate-pulse rounded-xl bg-[#E9EEF1] dark:bg-[#1C1C1C]' />}

            {summary && (
                <>
                    <div dir='ltr' className='mt-4 h-[200px] w-full'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 8 }}>
                                <CartesianGrid vertical={false} strokeOpacity={0.3} />
                                <XAxis dataKey='status' tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10 }} />
                                <Tooltip
                                    cursor={false}
                                    formatter={(v) => [fa(Number(v)), 'تعداد رزرو']}
                                    contentStyle={{ borderRadius: 12, fontSize: 11 }}
                                />
                                <Area dataKey='count' type='monotone' stroke='#0887CA' fill='#0887CA' fillOpacity={0.4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <p className='mt-auto pt-3 text-[11px] text-[#8A8997]'>
                        مجموع رزروها: <strong className='text-[#10088F] dark:text-[#38A9E0]'>{fa(summary.bookingCount)}</strong>
                    </p>
                </>
            )}
        </section>
    )
}

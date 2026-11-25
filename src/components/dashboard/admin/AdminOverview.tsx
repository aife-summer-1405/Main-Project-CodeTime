'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { faDate } from '@/lib/format'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getAdminBookings, type AdminBooking } from '@/lib/Api/dashboard/admin/bookings'
import { getAdminDashboard, type AdminSummary } from '@/lib/Api/dashboard/admin/summary'
import { getAdminUsers, type AdminUser } from '@/lib/Api/dashboard/admin/users'
import { AdminOverviewSkeleton } from '@/components/skeletons/DashboardSkeletons'
import PageTitle from '../common/PageTitle'
import DataList, { type Column } from '../common/DataList'
import AdminStatCards from './AdminStatCards'
import RoleBadge from './RoleBadge'
import UserCell from './UserCell'
import { bookingColumns } from './bookings/bookingColumns'

const PREVIEW_COUNT = 5

const columns: Column<AdminUser>[] = [
    { key: 'user', header: 'کاربر', width: '1.6fr', render: (u) => <UserCell user={u} /> },
    { key: 'email', header: 'ایمیل', width: '2fr', render: (u) => <span className='block truncate'>{u.email}</span> },
    { key: 'role', header: 'نقش', width: '1fr', render: (u) => <RoleBadge role={u.role} /> },
    { key: 'createdAt', header: 'تاریخ عضویت', width: '1.2fr', render: (u) => <span>{faDate(u.createdAt)}</span> },
]

export default function AdminOverview() {
    const [summary, setSummary] = useState<AdminSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState<AdminUser[]>([])
    const [usersLoading, setUsersLoading] = useState(true)
    const [bookings, setBookings] = useState<AdminBooking[]>([])
    const [bookingsLoading, setBookingsLoading] = useState(true)

    useEffect(() => {
        getAdminDashboard()
            .then(setSummary)
            .catch((e) => toast.error(getErrorMessage(e, 'دریافت آمار داشبورد با خطا مواجه شد')))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        getAdminUsers({ page: 1, limit: PREVIEW_COUNT })
            .then((res) => setUsers(res.users))
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت لیست کاربران')))
            .finally(() => setUsersLoading(false))
    }, [])

    useEffect(() => {
        getAdminBookings({ page: 1, limit: PREVIEW_COUNT })
            .then((res) => setBookings(res.bookings))
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت رزروها')))
            .finally(() => setBookingsLoading(false))
    }, [])

    if (loading) return <AdminOverviewSkeleton />

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>داشبورد</PageTitle>

            <AdminStatCards
                users={summary?.totalUsers ?? 0}
                houses={summary?.totalHouses ?? 0}
                bookings={summary?.totalBookings ?? 0}
                rating={summary?.averageRating ?? 0}
            />

            <section className='flex min-w-0 flex-col'>
                <div className='mx-1.5 flex items-center justify-between'>
                    <h3 className='text-xs font-bold text-[#060425] dark:text-white'>آخرین کاربران</h3>
                    <Link href='/dashboard/users' className='text-[11px] text-[#0087CA] transition hover:opacity-80'>
                        مشاهده همه
                    </Link>
                </div>

                <DataList columns={columns} rows={users} rowKey={(u) => u.id} loading={usersLoading} emptyText='کاربری یافت نشد' />
            </section>

            <section className='flex min-w-0 flex-col'>
                <div className='mx-1.5 flex items-center justify-between'>
                    <h3 className='text-xs font-bold text-[#060425] dark:text-white'>آخرین رزروها</h3>
                    <Link href='/dashboard/reservations' className='text-[11px] text-[#0087CA] transition hover:opacity-80'>
                        مشاهده همه
                    </Link>
                </div>

                <DataList columns={bookingColumns} rows={bookings} rowKey={(b) => b.id} loading={bookingsLoading} emptyText='رزروی یافت نشد' />
            </section>
        </div>
    )
}

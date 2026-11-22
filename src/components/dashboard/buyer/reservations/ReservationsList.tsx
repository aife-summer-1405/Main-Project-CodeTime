'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import SafeImage from '@/functions/safeImage'
import { fa } from '@/lib/format'
import { getErrorMessage, getUserId } from '@/lib/dashboard/dashboardApi'
import { getCustomerBookings, type BookingGroup, type Reservation } from '@/lib/dashboard/bookingsApi'
import ListToolbar from '../../common/ListToolbar'
import FilterSelect from '../../common/FilterSelect'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ReservationDetailModal from './ReservationDetailModal'

const PAGE_SIZE = 10

const statusOptions: { label: string; value: BookingGroup }[] = [
    { label: 'تایید شده', value: 'success' },
    { label: 'در انتظار', value: 'pending' },
    { label: 'لغو شده', value: 'cancel' },
]

const statusIcon: Record<BookingGroup, string> = {
    success: '/images/success.png',
    pending: '/images/Frame 24.png',
    cancel: '/images/Frame 25.png',
}

const statusAlt: Record<BookingGroup, string> = { success: 'تایید شده', pending: 'در انتظار', cancel: 'لغو شده' }

const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

const formatTime = (iso: string | null) =>
    iso ? new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '—'

export default function ReservationsList() {
    const router = useRouter()
    const [items, setItems] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [detail, setDetail] = useState<Reservation | null>(null)

    useEffect(() => {
        const userId = getUserId()
        if (!userId) {
            setLoading(false)
            return
        }
        getCustomerBookings(userId)
            .then((res) => setItems(res.reservations))
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت رزروها')))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = query.trim()
        return items.filter((r) => (!q || r.title.includes(q)) && (!status || r.group === status))
    }, [items, query, status])

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const current = Math.min(page, pages)
    const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

    const columns: Column<Reservation>[] = [
        {
            key: 'title',
            header: 'نام اقامتگاه',
            width: '2fr',
            render: (r) => (
                <div className='flex min-w-0 items-center gap-2'>
                    <SafeImage src={r.image} className='h-8 w-8 shrink-0 rounded-md object-cover' />
                    <span className='truncate'>{r.title}</span>
                </div>
            ),
        },
        { key: 'checkIn', header: 'تاریخ ورود', width: '1.2fr', render: (r) => <span>{formatDate(r.checkIn)}</span> },
        { key: 'checkOut', header: 'تاریخ خروج', width: '1.2fr', render: (r) => <span>{formatDate(r.checkOut)}</span> },
        { key: 'time', header: 'زمان ثبت', width: '0.7fr', render: (r) => <span>{formatTime(r.createdAt)}</span> },
        {
            key: 'price',
            header: 'قیمت',
            width: '1.2fr',
            render: (r) => <span className='font-bold text-[#0087CA]'>{r.price > 0 ? `${fa(r.price)} تومان` : '—'}</span>,
        },
        {
            key: 'status',
            header: 'وضعیت',
            width: '0.7fr',
            render: (r) => <img src={statusIcon[r.group]} alt={statusAlt[r.group]} className='h-5 w-5 object-contain' />,
        },
    ]

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست رزرو های شما'
                count={filtered.length}
                query={query}
                searchPlaceholder='نام اقامتگاه مورد نظر ....'
                onQueryChange={(v) => {
                    setQuery(v)
                    setPage(1)
                }}
            >
                <FilterSelect
                    label='وضعیت رزرو'
                    value={status}
                    options={statusOptions}
                    onChange={(v) => {
                        setStatus(v)
                        setPage(1)
                    }}
                />
            </ListToolbar>

            <DataList
                columns={columns}
                rows={visible}
                rowKey={(r) => r.id}
                loading={loading}
                emptyText='هنوز رزروی ثبت نکرده‌اید'
                actions={(r) => (
                    <RowMenu
                        items={[
                            { label: 'جزئیات', icon: <Info size={16} />, variant: 'primary', onClick: () => setDetail(r) },
                            ...(r.houseId
                                ? [{ label: 'مشاهده ملک', icon: <ExternalLink size={16} />, onClick: () => router.push(`/reserve/${r.houseId}`) }]
                                : []),
                        ]}
                    />
                )}
            />

            <Pagination page={current} total={pages} onChange={setPage} />

            <ReservationDetailModal reservation={detail} onClose={() => setDetail(null)} />
        </div>
    )
}

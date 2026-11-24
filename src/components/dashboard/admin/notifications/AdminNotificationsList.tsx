'use client'

import { useEffect, useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { faDate, toFaDigits } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { getAllAdminNotifications, type AdminNotification } from '@/lib/dashboard/adminContentApi'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import FilterModal, { type FilterField, type FilterValues } from '../../common/FilterModal'
import { PaymentUser } from '../payments/paymentColumns'
import useUsers from '../payments/useUsers'
import { normalizeText } from '../searchText'
import AdminNotificationDetailModal from './AdminNotificationDetailModal'
import { notificationTypeLabel } from './notificationType'

const PAGE_SIZE = 10

const filterFields: FilterField[] = [
    {
        key: 'status',
        label: 'وضعیت',
        options: [
            { label: 'خوانده شده', value: 'read' },
            { label: 'خوانده نشده', value: 'unread' },
        ],
    },
    { key: 'userId', label: 'شناسه کاربر', type: 'number' },
]

export default function AdminNotificationsList() {
    const [all, setAll] = useState<AdminNotification[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<FilterValues>({})
    const [filterOpen, setFilterOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [detail, setDetail] = useState<AdminNotification | null>(null)

    const filtered = useMemo(() => {
        const needle = normalizeText(search)
        return all.filter(
            (item) =>
                (!needle || normalizeText(item.title).includes(needle) || normalizeText(item.message).includes(needle)) &&
                (!filters.status || (filters.status === 'read') === item.isRead) &&
                (!filters.userId || item.userId === filters.userId.trim())
        )
    }, [all, search, filters])

    const total = filtered.length
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const currentPage = Math.min(page, pages)
    const items = useMemo(() => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [filtered, currentPage])

    const users = useUsers([...items.map((item) => item.userId), ...(detail ? [detail.userId] : [])])

    const columns = useMemo<Column<AdminNotification>[]>(
        () => [
            { key: 'id', header: 'کد اعلان', width: '0.6fr', render: (n) => <span>{toFaDigits(n.id)}</span> },
            { key: 'user', header: 'گیرنده', width: '1.4fr', render: (n) => <PaymentUser id={n.userId} user={users[n.userId]} /> },
            {
                key: 'title',
                header: 'عنوان',
                width: '1.5fr',
                render: (n) => (
                    <span title={n.title} className='block truncate'>
                        {n.title || '—'}
                    </span>
                ),
            },
            {
                key: 'message',
                header: 'متن اعلان',
                width: '2.4fr',
                render: (n) => (
                    <span title={n.message} className='block truncate'>
                        {n.message || '—'}
                    </span>
                ),
            },
            { key: 'type', header: 'نوع', width: '0.7fr', render: (n) => <span>{notificationTypeLabel(n.type)}</span> },
            {
                key: 'status',
                header: 'وضعیت',
                width: '0.9fr',
                render: (n) => (
                    <span
                        className={`w-fit rounded-full px-2.5 py-1 text-[10px] ${n.isRead ? 'bg-[#E6F6EC] text-[#12A150] dark:bg-[#1C1C1C]' : 'bg-[#FFF3E0] text-[#FF6B00] dark:bg-[#1C1C1C]'}`}
                    >
                        {n.isRead ? 'خوانده شده' : 'خوانده نشده'}
                    </span>
                ),
            },
            { key: 'date', header: 'تاریخ', width: '1fr', render: (n) => <span>{faDate(n.createdAt)}</span> },
        ],
        [users]
    )

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(query)
            setPage(1)
        }, 400)
        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        let active = true

        getAllAdminNotifications()
            .then((list) => active && setAll(list))
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست اعلان ها')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [])

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست اعلان ها'
                count={total}
                query={query}
                onQueryChange={setQuery}
                searchPlaceholder='عنوان یا متن اعلان ...'
                onFilterClick={() => setFilterOpen(true)}
                filterCount={Object.values(filters).filter(Boolean).length}
            />

            <DataList
                columns={columns}
                rows={items}
                rowKey={(n) => n.id}
                loading={loading}
                emptyText='اعلانی یافت نشد'
                actions={(n) => <RowMenu items={[{ label: 'مشاهده جزئیات', icon: <Info size={16} />, variant: 'primary', onClick: () => setDetail(n) }]} />}
            />

            <Pagination page={currentPage} total={pages} onChange={setPage} />

            <FilterModal
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                fields={filterFields}
                values={filters}
                onApply={(values) => {
                    setFilters(values)
                    setPage(1)
                }}
            />

            <AdminNotificationDetailModal notification={detail} user={detail ? users[detail.userId] : undefined} onClose={() => setDetail(null)} />
        </div>
    )
}

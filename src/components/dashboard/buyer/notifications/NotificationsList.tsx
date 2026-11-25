'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getUserId } from '@/lib/Api/dashboard/common/user'
import { getNotifications, markNotificationRead, type Notification } from '@/lib/Api/dashboard/buyer/notifications'
import ListToolbar from '../../common/ListToolbar'
import FilterSelect from '../../common/FilterSelect'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import ConfirmModal from '../../common/ConfirmModal'

const PAGE_SIZE = 10

const statusOptions = [
    { label: 'خوانده نشده', value: 'unread' },
    { label: 'خوانده شده', value: 'read' },
]

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' })

const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })

const badge = 'inline-flex h-6 items-center gap-1 rounded-full px-3 text-[10px] font-bold whitespace-nowrap transition'

export default function NotificationsList() {
    const [items, setItems] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [marking, setMarking] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    useEffect(() => {
        const userId = getUserId()
        if (!userId) {
            setLoading(false)
            return
        }
        getNotifications(userId)
            .then((res) => setItems(res.data))
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت اعلان‌ها')))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(
        () => items.filter((n) => !status || n.isRead === (status === 'read')),
        [items, status]
    )
    const unread = filtered.filter((n) => !n.isRead)

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const current = Math.min(page, pages)
    const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

    const markRead = async (ids: string[]) => {
        await Promise.all(ids.map(markNotificationRead))
        setItems((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n)))
    }

    const markOne = async (id: string) => {
        try {
            await markRead([id])
        } catch (e) {
            toast.error(getErrorMessage(e, 'انجام نشد'))
        }
    }

    const markAll = async () => {
        if (!unread.length) {
            setConfirmOpen(false)
            return
        }
        setMarking(true)
        try {
            await markRead(unread.map((n) => n.id))
            toast.success('همه اعلان‌ها خوانده شد')
        } catch (e) {
            toast.error(getErrorMessage(e, 'انجام نشد'))
        } finally {
            setMarking(false)
            setConfirmOpen(false)
        }
    }

    const columns: Column<Notification>[] = [
        {
            key: 'message',
            header: 'اعلان',
            width: '3fr',
            render: (n) => (
                <p title={n.message} className={`truncate ${n.isRead ? '' : 'font-bold text-[#060425] dark:text-white'}`}>
                    {n.message || n.title}
                </p>
            ),
        },
        { key: 'date', header: 'تاریخ', width: '1.1fr', render: (n) => <span>{formatDate(n.createdAt)}</span> },
        { key: 'time', header: 'زمان', width: '0.7fr', render: (n) => <span>{formatTime(n.createdAt)}</span> },
        {
            key: 'status',
            header: '',
            width: '2fr',
            render: (n) =>
                n.isRead ? (
                    <span className={`${badge} bg-[#060425CC] text-white`}>
                        <Check size={12} />  خوانده شد
                    </span>
                ) : (
                    <button
                        type='button'
                        onClick={() => markOne(n.id)}
                        className={`${badge} cursor-pointer bg-[#05ED6A] text-[#060425] active:scale-[0.95]`}
                    >
                        <Check size={12} />   علامت گذاری به عنوان خوانده شد
                    </button>
                ),
        },
    ]

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar title='لیست اعلان های شما' count={filtered.length}>
                <FilterSelect
                    label='وضعیت اعلان'
                    value={status}
                    options={statusOptions}
                    onChange={(v) => {
                        setStatus(v)
                        setPage(1)
                    }}
                />
                <button
                    type='button'
                    disabled={marking || !unread.length}
                    onClick={() => setConfirmOpen(true)}
                    className='h-12 cursor-pointer rounded-2xl bg-[#10088F] px-5 text-sm text-white transition active:scale-[0.95] disabled:cursor-default disabled:opacity-50 dark:bg-[#0087CA]'
                >
                    علامت گذاری به عنوان خوانده شد
                </button>
            </ListToolbar>

            <DataList columns={columns} rows={visible} rowKey={(n) => n.id} loading={loading} emptyText='اعلانی وجود ندارد' />

            <Pagination page={current} total={pages} onChange={setPage} />

            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={markAll}
                title='خوانده شد'
                message='آیا مطمئنی که میخوای همه مطالب سایت را به عنوان خوانده شده علامت بزنی؟'
                icon={<Check size={34} strokeWidth={1.5} className='text-[#0087CA]' />}
                confirmClassName='bg-[#15977D]'
                loading={marking}
            />
        </div>
    )
}
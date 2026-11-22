'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { fa } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { getPayments, type Payment } from '@/lib/dashboard/paymentsApi'
import ListToolbar from '../../common/ListToolbar'
import FilterSelect from '../../common/FilterSelect'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import PaymentDetailsModal from './PaymentDetailModal'

const PAGE_SIZE = 10

const statusOptions = [
    { label: 'تایید شده', value: 'completed' },
    { label: 'در انتظار', value: 'pending' },
    { label: 'ناموفق', value: 'failed' },
]

const typeOptions = [
    { label: 'رزرو', value: 'booking' },
    { label: 'شارژ کیف پول', value: 'wallet' },
]

const typeOf = (p: Payment) => (p.bookingId || p.description?.startsWith('رزرو') ? 'booking' : 'wallet')

const statusIcon = (status: string) => {
    if (['completed', 'success', 'paid'].includes(status)) return '/images/success.png'
    if (['failed', 'cancelled', 'canceled'].includes(status)) return '/images/Frame 25.png'
    return '/images/Frame 24.png'
}

const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'

const formatTime = (iso: string | null) =>
    iso ? new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '—'

export default function PaymentsList() {
    const [items, setItems] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('')
    const [type, setType] = useState('')
    const [page, setPage] = useState(1)
    const [detailId, setDetailId] = useState<string | null>(null)
    const closeDetails = useCallback(() => setDetailId(null), [])

    useEffect(() => {
        getPayments()
            .then((res) => setItems(res.payments))
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت پرداخت‌ها')))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(
        () => items.filter((p) => (!status || p.status === status) && (!type || typeOf(p) === type)),
        [items, status, type]
    )

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const current = Math.min(page, pages)
    const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

    const columns: Column<Payment>[] = [
        { key: 'date', header: 'تاریخ', width: '1.2fr', render: (p) => <span>{formatDate(p.createdAt)}</span> },
        { key: 'time', header: 'زمان', width: '0.7fr', render: (p) => <span>{formatTime(p.createdAt)}</span> },
        { key: 'tracking', header: 'شماره پیگیری', width: '1.4fr', render: (p) => <span className='font-bold'>{p.transactionId ?? '—'}</span> },
        { key: 'amount', header: 'مبلغ', width: '1.3fr', render: (p) => <span className='font-bold text-[#0087CA]'>{fa(Number(p.amount))} تومان</span> },
        { key: 'status', header: 'وضعیت پرداخت', width: '1fr', render: (p) => <img src={statusIcon(p.status)} alt={p.status} className='h-5 w-5 object-contain' /> },
        { key: 'type', header: 'نوع تراکنش', width: '1fr', render: (p) => <span className='font-bold text-[#060425] dark:text-white'>{typeOf(p) === 'booking' ? 'رزرو' : 'شارژ کیف پول'}</span> },
    ]

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar title='لیست تراکنش های شما' count={filtered.length}>
                <FilterSelect
                    label='وضعیت پرداخت'
                    value={status}
                    options={statusOptions}
                    onChange={(v) => {
                        setStatus(v)
                        setPage(1)
                    }}
                />
                <FilterSelect
                    label='نوع تراکنش'
                    value={type}
                    options={typeOptions}
                    onChange={(v) => {
                        setType(v)
                        setPage(1)
                    }}
                />
            </ListToolbar>

            <DataList
                columns={columns}
                rows={visible}
                rowKey={(p) => p.id}
                loading={loading}
                emptyText='تراکنشی یافت نشد'
                actionsWidth='100px'
                actions={(p) => (
                    <button type='button' onClick={() => setDetailId(p.id)} className='cursor-pointer whitespace-nowrap text-[11px] text-[#0087CA] transition active:scale-[0.9]'>
                        مشاهده جزئیات
                    </button>
                )}
            />

            <Pagination page={current} total={pages} onChange={setPage} />

            <PaymentDetailsModal paymentId={detailId} onClose={closeDetails} />
        </div>
    )
}
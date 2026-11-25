'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Ban, Info, Play } from 'lucide-react'
import toast from 'react-hot-toast'
import { fa, faDate, faTime } from '@/lib/format'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getUserId } from '@/lib/Api/dashboard/common/user'
import {
    cancelBooking,
    continueBooking,
    getFullBookingDetail,
    type DetailedBooking,
} from '@/lib/Api/dashboard/common/bookings'
import { getSellerBookings } from '@/lib/Api/dashboard/seller/bookings'
import { toReceiptPayment, type SellerBooking } from '@/lib/dashboard/seller-data'
import type { Payment } from '@/lib/Api/dashboard/buyer/payments'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu, { type MenuItem } from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import ReceiptModal from '../../buyer/payments/ReceiptModal'
import StatusIcon from '../StatusIcon'
import BookingFilterModal, { countBookingFilters, emptyBookingFilters } from './BookingFilterModal'
import BookingModals, { type BookingModalName } from './BookingModals'

const PAGE_SIZE = 10

const statusKind = { confirmed: 'success', pending: 'pending', canceled: 'cancel' } as const
const payKind = { paid: 'success', unpaid: 'cancel' } as const

type ActionType = 'continue' | 'cancel'

const actionTexts: Record<ActionType, { title: string; message: string; note?: string }> = {
    continue: { title: 'ادامه رزرو', message: 'آیا از ادامه این رزرو مطمئنی؟' },
    cancel: { title: 'لغو رزرو', message: 'آیا از لغو این رزرو مطمئنی؟', note: 'مسافر از لغو رزرو مطلع می‌شود.' },
}

const actionIcons = {
    continue: <Play size={36} className='text-[#0087CA]' />,
    cancel: <Ban size={36} className='text-[#FF6B00]' />,
}

export default function SellerBookingsList() {
    const [items, setItems] = useState<SellerBooking[]>([])
    const [loading, setLoading] = useState(true)
    const [acting, setActing] = useState(false)
    const [detailLoading, setDetailLoading] = useState(false)
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState(emptyBookingFilters)
    const [page, setPage] = useState(1)
    const [filterOpen, setFilterOpen] = useState(false)
    const [selected, setSelected] = useState<DetailedBooking | null>(null)
    const [modal, setModal] = useState<BookingModalName>(null)
    const [pending, setPending] = useState<{ type: ActionType; booking: SellerBooking } | null>(null)
    const [receipt, setReceipt] = useState<Payment | null>(null)

    const load = useCallback(() => {
        const userId = getUserId()
        if (!userId) {
            setLoading(false)
            return
        }
        setLoading(true)
        getSellerBookings(userId)
            .then(setItems)
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت رزروها')))
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const filtered = useMemo(() => {
        const q = query.trim()
        return items.filter((b) => {
            const day = b.checkIn.slice(0, 10)
            return (
                (!q || b.title.includes(q) || b.travelers.some((t) => t.name.includes(q))) &&
                (!filters.status || b.status === filters.status) &&
                (!filters.from || day >= filters.from) &&
                (!filters.to || day <= filters.to)
            )
        })
    }, [items, query, filters])

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const current = Math.min(page, pages)
    const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

    const openDetails = (booking: SellerBooking) => {
        setSelected(booking)
        setModal('details')
        setDetailLoading(true)
        getFullBookingDetail(booking)
            .then((full) => setSelected((cur) => (cur?.id === booking.id ? full : cur)))
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت جزئیات رزرو')))
            .finally(() => setDetailLoading(false))
    }

    const closeModal = (name: BookingModalName) => {
        setModal(name)
        if (!name) {
            setSelected(null)
            setDetailLoading(false)
        }
    }

    const applyAction = async () => {
        if (!pending || acting) return
        setActing(true)
        try {
            if (pending.type === 'cancel') await cancelBooking(pending.booking.id)
            else await continueBooking(pending.booking.id)
            toast.success(pending.type === 'cancel' ? 'رزرو لغو شد' : 'رزرو ادامه یافت')
            setPending(null)
            load()
        } catch (e) {
            toast.error(getErrorMessage(e, pending.type === 'cancel' ? 'لغو رزرو انجام نشد' : 'ادامه رزرو انجام نشد'))
        } finally {
            setActing(false)
        }
    }

    const menuFor = (b: SellerBooking): MenuItem[] => [
        ...(b.status === 'canceled'
            ? [{ label: 'ادامه رزرو', icon: <Play size={16} />, onClick: () => setPending({ type: 'continue' as const, booking: b }) }]
            : []),
        ...(b.status === 'pending'
            ? [{ label: 'لغو رزرو', icon: <Ban size={16} />, variant: 'warning' as const, onClick: () => setPending({ type: 'cancel' as const, booking: b }) }]
            : []),
        { label: 'جزئیات', icon: <Info size={16} />, variant: 'primary', onClick: () => openDetails(b) },
    ]

    const columns: Column<SellerBooking>[] = [
        {
            key: 'title',
            header: 'نام ملک',
            width: '1.6fr',
            render: (b) => (
                <div className='flex min-w-0 items-center gap-2'>
                    <span className='truncate'>{b.title}</span>
                </div>
            ),
        },
        {
            key: 'traveler',
            header: 'اطلاعات مسافر',
            width: '1.6fr',
            render: (b) => (
                <span className='block truncate'>
                    {b.travelers[0]?.name}
                    {b.travelers.length > 1 && ` ، +${fa(b.travelers.length - 1)} نفر`}
                </span>
            ),
        },
        { key: 'date', header: 'تاریخ رزرو', width: '1.1fr', render: (b) => <span>{faDate(b.checkIn)}</span> },
        { key: 'time', header: 'زمان رزرو', width: '0.7fr', render: (b) => <span>{faTime(b.createdAt)}</span> },
        { key: 'amount', header: 'مبلغ', width: '1.1fr', render: (b) => <span className='font-bold text-[#0087CA]'>{fa(b.amount)} تومان</span> },
        { key: 'status', header: 'وضعیت رزرو', width: '0.8fr', render: (b) => <StatusIcon kind={statusKind[b.status]} /> },
        { key: 'payment', header: 'وضعیت پرداخت', width: '0.8fr', render: (b) => <StatusIcon kind={payKind[b.payment]} /> },
    ]

    const action = pending ? actionTexts[pending.type] : null

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست رزرو های مشتریان'
                count={filtered.length}
                query={query}
                searchPlaceholder='نام مسافر مورد نظر ....'
                onQueryChange={(v) => {
                    setQuery(v)
                    setPage(1)
                }}
                onFilterClick={() => setFilterOpen(true)}
                filterCount={countBookingFilters(filters)}
            />

            <DataList
                columns={columns}
                rows={visible}
                rowKey={(b) => b.id}
                loading={loading}
                emptyText='رزروی یافت نشد'
                actions={(b) => <RowMenu items={menuFor(b)} />}
            />

            <Pagination page={current} total={pages} onChange={setPage} />

            <BookingFilterModal
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                values={filters}
                onApply={(v) => {
                    setFilters(v)
                    setPage(1)
                }}
            />

            <BookingModals
                booking={selected}
                modal={modal}
                loading={detailLoading}
                onChange={closeModal}
                onReceipt={(booking, paymentId) => {
                    const payment = booking.payments.find((p) => p.id === paymentId)
                    if (payment) setReceipt(toReceiptPayment(payment, `رزرو ${booking.title}`))
                }}
            />

            <ReceiptModal payment={receipt} onClose={() => setReceipt(null)} />

            <ConfirmModal
                open={!!pending}
                onClose={() => setPending(null)}
                onConfirm={applyAction}
                loading={acting}
                icon={pending ? actionIcons[pending.type] : undefined}
                title={action?.title ?? ''}
                message={action?.message ?? ''}
                note={action?.note}
            />
        </div>
    )
}
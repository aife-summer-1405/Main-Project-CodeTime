'use client'

import { useEffect, useState } from 'react'
import { Ban, Info, Pencil, Play, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { cancelBooking, continueBooking } from '@/lib/Api/dashboard/common/bookings'
import { bookingStatusOptions } from '@/lib/dashboard/seller-data'
import {
    deleteAdminBooking,
    getAdminBooking,
    getAdminBookings,
    type AdminBooking,
    type BookingStatus,
} from '@/lib/Api/dashboard/admin/bookings'
import { getBookingHouse, type BookingHouse } from '@/lib/Api/dashboard/admin/houses'
import ListToolbar from '../../common/ListToolbar'
import DataList from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu, { type MenuItem } from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import FilterModal, { type FilterField, type FilterValues } from '../../common/FilterModal'
import { bookingColumns } from './bookingColumns'
import AdminBookingDetailModal from './AdminBookingDetailModal'
import AdminBookingEditModal from './AdminBookingEditModal'

const PAGE_SIZE = 10

const filterFields: FilterField[] = [
    { key: 'status', label: 'وضعیت رزرو', options: bookingStatusOptions },
    { key: 'userId', label: 'شناسه کاربر', type: 'number' },
    { key: 'houseId', label: 'شناسه ملک', type: 'number' },
]

type ActionType = 'continue' | 'cancel' | 'delete'

const actions: Record<ActionType, { title: string; message: string; note?: string; success: string; failure: string }> = {
    continue: { title: 'ادامه رزرو', message: 'آیا از ادامه این رزرو مطمئنی؟', success: 'رزرو ادامه یافت', failure: 'ادامه رزرو انجام نشد' },
    cancel: {
        title: 'لغو رزرو',
        message: 'آیا از لغو این رزرو مطمئنی؟',
        note: 'مسافر از لغو رزرو مطلع می‌شود.',
        success: 'رزرو لغو شد',
        failure: 'لغو رزرو انجام نشد',
    },
    delete: {
        title: 'حذف رزرو',
        message: 'آیا از حذف این رزرو مطمئنی؟',
        note: 'امکان بازگشت پس از حذف وجود ندارد!',
        success: 'رزرو با موفقیت حذف شد',
        failure: 'حذف رزرو انجام نشد',
    },
}

const actionIcons = {
    continue: <Play size={36} className='text-[#0087CA]' />,
    cancel: <Ban size={36} className='text-[#FF6B00]' />,
    delete: <Trash2 size={36} className='text-[#ED053F]' />,
}

export default function AdminBookingsList() {
    const [items, setItems] = useState<AdminBooking[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<FilterValues>({})
    const [filterOpen, setFilterOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [detail, setDetail] = useState<AdminBooking | null>(null)
    const [detailLoading, setDetailLoading] = useState(false)
    const [house, setHouse] = useState<BookingHouse | null>(null)
    const [houseLoading, setHouseLoading] = useState(false)
    const [editing, setEditing] = useState<AdminBooking | null>(null)
    const [pending, setPending] = useState<{ type: ActionType; booking: AdminBooking } | null>(null)
    const [acting, setActing] = useState(false)

    useEffect(() => {
        let active = true
        setLoading(true)

        getAdminBookings({
            page,
            limit: PAGE_SIZE,
            status: (filters.status as BookingStatus) || '',
            userId: filters.userId,
            houseId: filters.houseId,
        })
            .then((res) => {
                if (!active) return
                setItems(res.bookings)
                setTotal(res.totalCount)
            })
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت رزروها')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [page, filters, reloadKey])

    const reload = () => setReloadKey((key) => key + 1)
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const openDetails = (booking: AdminBooking) => {
        setDetail(booking)
        setDetailLoading(true)
        setHouse(null)
        setHouseLoading(true)
        getBookingHouse(booking.houseId)
            .then((found) => setHouse(found))
            .catch(() => setHouse(null))
            .finally(() => setHouseLoading(false))
        getAdminBooking(booking.id)
            .then((full) => setDetail((current) => (current?.id === booking.id ? full : current)))
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت جزئیات رزرو')))
            .finally(() => setDetailLoading(false))
    }

    const applyAction = async () => {
        if (!pending || acting) return
        const { type, booking } = pending
        setActing(true)
        try {
            if (type === 'cancel') await cancelBooking(booking.id)
            else if (type === 'continue') await continueBooking(booking.id)
            else await deleteAdminBooking(booking.id)
            toast.success(actions[type].success)
            setPending(null)
            if (type === 'delete' && items.length === 1 && page > 1) setPage(page - 1)
            else reload()
        } catch (e) {
            toast.error(getErrorMessage(e, actions[type].failure))
        } finally {
            setActing(false)
        }
    }

    const menuFor = (booking: AdminBooking): MenuItem[] => [
        { label: 'جزئیات', icon: <Info size={16} />, variant: 'primary', onClick: () => openDetails(booking) },
        { label: 'ویرایش', icon: <Pencil size={16} />, onClick: () => setEditing(booking) },
        ...(booking.status === 'canceled'
            ? [{ label: 'ادامه رزرو', icon: <Play size={16} />, onClick: () => setPending({ type: 'continue' as const, booking }) }]
            : []),
        ...(booking.status === 'pending'
            ? [{ label: 'لغو رزرو', icon: <Ban size={16} />, variant: 'warning' as const, onClick: () => setPending({ type: 'cancel' as const, booking }) }]
            : []),
        { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setPending({ type: 'delete', booking }) },
    ]

    const action = pending ? actions[pending.type] : null

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست رزروها'
                count={total}
                onFilterClick={() => setFilterOpen(true)}
                filterCount={Object.values(filters).filter(Boolean).length}
            />

            <DataList
                columns={bookingColumns}
                rows={items}
                rowKey={(b) => b.id}
                loading={loading}
                emptyText='رزروی یافت نشد'
                actions={(b) => <RowMenu items={menuFor(b)} />}
            />

            <Pagination page={Math.min(page, pages)} total={pages} onChange={setPage} />

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

            <AdminBookingDetailModal
                booking={detail}
                loading={detailLoading}
                house={house}
                houseLoading={houseLoading}
                onClose={() => setDetail(null)}
            />
            <AdminBookingEditModal booking={editing} onClose={() => setEditing(null)} onSaved={reload} />

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

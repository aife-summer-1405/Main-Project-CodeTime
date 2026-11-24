'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ExternalLink, Pencil, Star, Store, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import SafeImage from '@/functions/safeImage'
import { fa, faDate } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { deleteAdminHouse, getAdminHouses, type AdminHouse } from '@/lib/dashboard/adminApi'
import { transactionLabel } from '@/lib/dashboard/sellerHousesApi'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import FilterModal, { type FilterField, type FilterValues } from '../../common/FilterModal'
import AdminHouseEditModal from './AdminHouseEditModal'

const PAGE_SIZE = 10

const filterFields: FilterField[] = [
    { key: 'sellerId', label: 'شناسه فروشنده', type: 'number' },
    { key: 'price', label: 'قیمت ( تومان )', type: 'number' },
]

const columns: Column<AdminHouse>[] = [
    {
        key: 'title',
        header: 'نام اقامتگاه',
        width: '2fr',
        render: (h) => (
            <div className='flex min-w-0 items-center gap-2'>
                <SafeImage src={h.photos[0] ?? null} className='h-8 w-10 shrink-0 rounded-md object-cover' />
                <div className='flex min-w-0 flex-col'>
                    <span title={h.title} className='truncate'>
                        {h.title}
                    </span>
                    {h.category && <span className='truncate text-[11px] opacity-60'>{h.category}</span>}
                </div>
            </div>
        ),
    },
    { key: 'seller', header: 'فروشنده', width: '1.2fr', render: (h) => <span className='block truncate'>{h.sellerName || '—'}</span> },
    {
        key: 'price',
        header: 'قیمت',
        width: '1.4fr',
        render: (h) =>
            h.discountedPrice != null ? (
                <div className='flex flex-col leading-tight'>
                    <span className='font-bold text-[#0087CA]'>{fa(h.discountedPrice)} تومان</span>
                    <span className='text-[11px] text-red-600 line-through'>{fa(h.price)} تومان</span>
                </div>
            ) : (
                <span className='font-bold text-[#0087CA]'>{fa(h.price)} تومان</span>
            ),
    },
    {
        key: 'rate',
        header: 'امتیازات',
        width: '0.8fr',
        render: (h) => (
            <span className='flex items-center gap-1'>
                <Star size={14} color='#060425' />
                {fa(h.rate)}
            </span>
        ),
    },
    { key: 'transaction', header: 'نوع معامله', width: '0.9fr', render: (h) => <span>{transactionLabel(h.transactionType)}</span> },
    { key: 'updated', header: 'آخرین بروزرسانی', width: '1.2fr', render: (h) => <span>{faDate(h.lastUpdated)}</span> },
]

export default function AdminHousesList() {
    const router = useRouter()
    const [items, setItems] = useState<AdminHouse[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState<FilterValues>({})
    const [filterOpen, setFilterOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [editing, setEditing] = useState<AdminHouse | null>(null)
    const [target, setTarget] = useState<AdminHouse | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        let active = true
        setLoading(true)

        getAdminHouses({ page, limit: PAGE_SIZE, sellerId: filters.sellerId, price: filters.price })
            .then((res) => {
                if (!active) return
                setItems(res.houses)
                setTotal(res.totalCount)
            })
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست املاک')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [page, filters, reloadKey])

    const reload = () => setReloadKey((key) => key + 1)
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))

    const confirmDelete = async () => {
        if (!target || deleting) return
        setDeleting(true)
        try {
            await deleteAdminHouse(target.id)
            toast.success('ملک با موفقیت حذف شد')
            setTarget(null)
            if (items.length === 1 && page > 1) setPage(page - 1)
            else reload()
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف ملک انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست املاک'
                count={total}
                onFilterClick={() => setFilterOpen(true)}
                filterCount={Object.values(filters).filter(Boolean).length}
            />

            <DataList
                columns={columns}
                rows={items}
                rowKey={(h) => h.id}
                loading={loading}
                emptyText='ملکی یافت نشد'
                actions={(h) => (
                    <RowMenu
                        items={[
                            { label: 'مشاهده ملک', icon: <ExternalLink size={16} />, variant: 'primary', onClick: () => router.push(`/reserve/${h.id}`) },
                            { label: 'ویرایش', icon: <Pencil size={16} />, onClick: () => setEditing(h) },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(h) },
                        ]}
                    />
                )}
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

            <AdminHouseEditModal house={editing} onClose={() => setEditing(null)} onSaved={reload} />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Store size={36} className='text-[#0087CA]' />}
                title='حذف ملک'
                message='آیا از حذف ملک مورد نظر مطمئنی؟'
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}

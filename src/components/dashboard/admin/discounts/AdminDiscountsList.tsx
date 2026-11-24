'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { fa, faDate, toFaDigits } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { deleteAdminDiscount, getAllAdminDiscounts, type AdminDiscount } from '@/lib/dashboard/adminContentApi'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import FilterModal, { type FilterField, type FilterValues } from '../../common/FilterModal'
import { normalizeText } from '../searchText'
import AdminDiscountFormModal from './AdminDiscountFormModal'
import useHouseTitles from './useHouseTitles'

const PAGE_SIZE = 10

const filterFields: FilterField[] = [
    {
        key: 'status',
        label: 'وضعیت',
        options: [
            { label: 'فعال', value: 'active' },
            { label: 'منقضی شده', value: 'expired' },
        ],
    },
    { key: 'houseId', label: 'شناسه ملک', type: 'number' },
]

const isExpired = (discount: AdminDiscount) => !!discount.validUntil && new Date(discount.validUntil).getTime() < Date.now()

export default function AdminDiscountsList() {
    const [all, setAll] = useState<AdminDiscount[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [search, setSearch] = useState('')
    const [filters, setFilters] = useState<FilterValues>({})
    const [filterOpen, setFilterOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [reloadKey, setReloadKey] = useState(0)
    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<AdminDiscount | null>(null)
    const [target, setTarget] = useState<AdminDiscount | null>(null)
    const [deleting, setDeleting] = useState(false)

    const filtered = useMemo(() => {
        const needle = normalizeText(search)
        return all.filter(
            (item) =>
                (!needle || normalizeText(item.code).includes(needle)) &&
                (!filters.status || (filters.status === 'expired') === isExpired(item)) &&
                (!filters.houseId || item.houseId === filters.houseId.trim())
        )
    }, [all, search, filters])

    const total = filtered.length
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
    const currentPage = Math.min(page, pages)
    const items = useMemo(() => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [filtered, currentPage])

    const houses = useHouseTitles(items.map((item) => item.houseId))

    const columns = useMemo<Column<AdminDiscount>[]>(
        () => [
            { key: 'id', header: 'کد', width: '0.5fr', render: (d) => <span>{toFaDigits(d.id)}</span> },
            { key: 'code', header: 'کد تخفیف', width: '1.2fr', render: (d) => <span dir='ltr' className='block truncate text-right font-bold text-[#0087CA]'>{d.code || '—'}</span> },
            {
                key: 'house',
                header: 'ملک',
                width: '2fr',
                render: (d) => {
                    const title = houses[d.houseId]
                    if (title === undefined) return <span className='h-4 w-28 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                    return (
                        <div className='flex min-w-0 flex-col'>
                            <span title={title ?? undefined} className='truncate'>
                                {title || `ملک ${toFaDigits(d.houseId)}`}
                            </span>
                            <span className='text-[11px] opacity-60'>شناسه {toFaDigits(d.houseId)}</span>
                        </div>
                    )
                },
            },
            { key: 'percentage', header: 'درصد تخفیف', width: '0.9fr', render: (d) => <span>{fa(d.percentage)}٪</span> },
            { key: 'until', header: 'تاریخ انقضا', width: '1.1fr', render: (d) => <span>{faDate(d.validUntil)}</span> },
            {
                key: 'status',
                header: 'وضعیت',
                width: '0.8fr',
                render: (d) => {
                    const expired = isExpired(d)
                    return (
                        <span
                            className={`w-fit rounded-full px-2.5 py-1 text-[10px] ${expired ? 'bg-[#FDE8EC] text-[#ED053F] dark:bg-[#1C1C1C]' : 'bg-[#E6F6EC] text-[#12A150] dark:bg-[#1C1C1C]'}`}
                        >
                            {expired ? 'منقضی شده' : 'فعال'}
                        </span>
                    )
                },
            },
        ],
        [houses]
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
        setLoading(true)

        getAllAdminDiscounts()
            .then((list) => active && setAll(list))
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست کدهای تخفیف')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [reloadKey])

    const reload = () => setReloadKey((key) => key + 1)

    const openForm = (discount: AdminDiscount | null) => {
        setEditing(discount)
        setFormOpen(true)
    }

    const confirmDelete = async () => {
        if (!target || deleting) return
        setDeleting(true)
        try {
            await deleteAdminDiscount(target.id)
            toast.success('کد تخفیف با موفقیت حذف شد')
            setTarget(null)
            reload()
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف کد تخفیف انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست کدهای تخفیف'
                count={total}
                query={query}
                onQueryChange={setQuery}
                searchPlaceholder='کد تخفیف مورد نظر ...'
                onFilterClick={() => setFilterOpen(true)}
                filterCount={Object.values(filters).filter(Boolean).length}
            >
                <button
                    type='button'
                    onClick={() => openForm(null)}
                    className='flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#10088F] px-5 text-sm text-white transition active:scale-[0.95] dark:bg-[#0087CA]'
                >
                    <Plus size={18} />
                    افزودن کد تخفیف جدید
                </button>
            </ListToolbar>

            <DataList
                columns={columns}
                rows={items}
                rowKey={(d) => d.id}
                loading={loading}
                emptyText='کد تخفیفی یافت نشد'
                actions={(d) => (
                    <RowMenu
                        items={[
                            { label: 'ویرایش', icon: <Pencil size={16} />, variant: 'primary', onClick: () => openForm(d) },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(d) },
                        ]}
                    />
                )}
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

            <AdminDiscountFormModal open={formOpen} discount={editing} onClose={() => setFormOpen(false)} onSaved={reload} />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف کد تخفیف'
                message={target ? `آیا از حذف کد ${target.code} مطمئنی؟` : ''}
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}

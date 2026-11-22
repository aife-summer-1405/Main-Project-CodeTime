'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExternalLink, Pencil, Plus, Star, Store, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import SafeImage from '@/functions/safeImage'
import { fa, faDate } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import {
    deleteSellerHouse,
    getSellerHouses,
    transactionLabel,
    transactionOptions,
    type SellerHouse,
} from '@/lib/dashboard/sellerHousesApi'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import ConfirmModal from '../../common/ConfirmModal'
import PropertyFilterModal, {
    countPropertyFilters,
    emptyPropertyFilters,
    priceBounds,
} from './PropertyFilterModal'

const PAGE_SIZE = 10

const unique = (values: string[]) => [...new Set(values.filter(Boolean))].map((v) => ({ label: v, value: v }))

export default function PropertiesList() {
    const router = useRouter()
    const [items, setItems] = useState<SellerHouse[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [search, setSearch] = useState('')
    const [priceCeiling, setPriceCeiling] = useState(0)
    const [knownTypes, setKnownTypes] = useState<string[]>([])
    const [filters, setFilters] = useState(emptyPropertyFilters)
    const [page, setPage] = useState(1)
    const [filterOpen, setFilterOpen] = useState(false)
    const [target, setTarget] = useState<SellerHouse | null>(null)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setSearch(query.trim()), 400)
        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        let active = true
        setLoading(true)

        getSellerHouses({
            transactionType: filters.transaction,
            search,
            minPrice: filters.low,
            maxPrice: filters.high ?? undefined,
        })
            .then((res) => {
                if (!active) return
                setItems(res.houses)
                setPriceCeiling((prev) => Math.max(prev, ...res.houses.map((h) => h.price)))
                setKnownTypes((prev) => [...new Set([...prev, ...res.houses.map((h) => h.category).filter(Boolean)])])
            })
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت لیست املاک')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [filters.transaction, filters.low, filters.high, search])

    const typeOptions = useMemo(() => unique(knownTypes), [knownTypes])
    const { max, step } = useMemo(() => priceBounds([priceCeiling, filters.low]), [priceCeiling, filters.low])

    const filtered = useMemo(
        () => (filters.type ? items.filter((h) => h.category === filters.type) : items),
        [items, filters.type]
    )

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const current = Math.min(page, pages)
    const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

    const confirmDelete = async () => {
        if (!target || deleting) return
        setDeleting(true)
        try {
            await deleteSellerHouse(target.id)
            setItems((prev) => prev.filter((h) => h.id !== target.id))
            toast.success('ملک با موفقیت حذف شد')
            setTarget(null)
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف ملک انجام نشد'))
        } finally {
            setDeleting(false)
        }
    }

    const columns: Column<SellerHouse>[] = [
        {
            key: 'title',
            header: 'نام اقامتگاه',
            width: '2fr',
            render: (h) => (
                <div className='flex min-w-0 items-center gap-2'>
                    <SafeImage src={h.photo} className='h-8 w-10 shrink-0 rounded-md object-cover' />
                    <div className='flex min-w-0 flex-col'>
                        <span title={h.title} className='truncate'>
                            {h.title}
                        </span>
                        {h.category && <span className='truncate text-[11px] opacity-60'>{h.category}</span>}
                    </div>
                </div>
            ),
        },
        {
            key: 'price',
            header: 'قیمت',
            width: '1.4fr',
            render: (h) =>
                h.discountedPrice != null ? (
                    <div className='flex flex-col leading-tight'>
                        <span className='font-bold text-[#0087CA]'>{fa(h.discountedPrice)} تومان</span>
                        <span className='text-[11px] text-red-600 line-through '>{fa(h.price)} تومان</span>
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
                    {h.rate.toLocaleString('fa-IR')}
                </span>
            ),
        },
        {
            key: 'transaction',
            header: 'نوع معامله',
            width: '0.9fr',
            render: (h) => <span>{transactionLabel(h.transactionType)}</span>,
        },
        {
            key: 'updated',
            header: 'آخرین بروزرسانی',
            width: '1.2fr',
            render: (h) => <span>{h.lastUpdated ? faDate(h.lastUpdated) : '—'}</span>,
        },
    ]

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست املاک من'
                count={filtered.length}
                query={query}
                onQueryChange={(v) => {
                    setQuery(v)
                    setPage(1)
                }}
                onFilterClick={() => setFilterOpen(true)}
                filterCount={countPropertyFilters(filters)}
            />

            <DataList
                columns={columns}
                rows={visible}
                rowKey={(h) => h.id}
                loading={loading}
                emptyText='هنوز ملکی ثبت نکرده‌اید'
                actions={(h) => (
                    <RowMenu

                        items={[
                            {
                                label: 'مشاهده ملک',
                                icon: <ExternalLink size={16} />,
                                variant: 'primary',
                                onClick: () => router.push(`/reserve/${h.id}`),
                            },
                            {
                                label: 'ویرایش',
                                icon: <Pencil size={16} />,

                                onClick: () => router.push(`/dashboard/properties/${h.id}/edit`),
                            },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(h) },
                        ]}
                    />
                )}
            />

            <div className='flex flex-wrap items-center justify-between gap-3'>
                <Link
                    href='/dashboard/properties/new'
                    className='flex h-10 items-center gap-2 rounded-xl border-[1.5px] border-[#10088F] px-6 text-sm text-[#10088F] transition active:scale-[0.95] dark:border-[#38A9E0] dark:text-[#38A9E0]'
                >
                    <Plus size={17} />
                    افزودن ملک
                </Link>
                <div className='flex-1'>
                    <Pagination page={current} total={pages} onChange={setPage} />
                </div>
            </div>

            <PropertyFilterModal
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                values={filters}
                onApply={(v) => {
                    setFilters(v)
                    setPage(1)
                }}
                typeOptions={typeOptions}
                transactionOptions={transactionOptions}
                maxPrice={max}
                step={step}
            />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmDelete}
                loading={deleting}
                icon={<Store size={36} className='text-[#0087CA]' />}
                title='حذف ملک'
                message='آیا از حذف ملک مورد نظر مطمئنی؟؟'
                note='امکان بازگشت پس از حذف وجود ندارد!'
            />
        </div>
    )
}
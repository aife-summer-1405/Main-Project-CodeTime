'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import SafeImage from '@/functions/safeImage'
import { fa } from '@/lib/format'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getUserId } from '@/lib/Api/dashboard/common/user'
import { getFavorites, removeFavorite, type Favorite } from '@/lib/Api/dashboard/buyer/favorites'
import ListToolbar from '../../common/ListToolbar'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import RowMenu from '../../common/RowMenu'
import FilterModal, { type FilterField, type FilterValues } from '../../common/FilterModal'
import ConfirmModal from '../../common/ConfirmModal'

const PAGE_SIZE = 10

const priceOptions = [500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000, 1000000000, 10000000000].map((p) => ({
    value: String(p),
    label: `${fa(p)} تومان`,
}))

const filterFields: FilterField[] = [
    { key: 'destination', label: 'مقصد' },
    { key: 'minPrice', label: 'حداقل قیمت', options: priceOptions },
    { key: 'maxPrice', label: 'حداکثر قیمت', options: priceOptions },
]

export const favoriteColumns: Column<Favorite>[] = [
    {
        key: 'title',
        header: 'نام اقامتگاه',
        width: '2fr',
        render: ({ house }) => (
            <div className='flex min-w-0 items-center gap-2'>
                <SafeImage src={house.photos?.[0]} className='h-8 w-8 shrink-0 rounded-md object-cover' />
                <span className='truncate'>{house.title}</span>
            </div>
        ),
    },
    {
        key: 'price',
        header: 'قیمت کل',
        width: '1fr',
        render: ({ house }) => {
            const price = Number(house.price)
            return <span className='font-bold text-[#0087CA]'>{price > 0 ? `${fa(price)} تومان` : '—'}</span>
        },
    },
    {
        key: 'address',
        header: 'آدرس',
        width: '2fr',
        render: ({ house }) => (
            <div className='flex items-center gap-1.5 font-bold text-[#060425] dark:text-white'>
                <MapPin size={15} className='shrink-0' />
                <p className='truncate'>{house.address}</p>
            </div>
        ),
    },
]

export default function FavoritesList() {
    const router = useRouter()
    const [items, setItems] = useState<Favorite[]>([])
    const [loading, setLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [filters, setFilters] = useState<FilterValues>({})
    const [page, setPage] = useState(1)
    const [filterOpen, setFilterOpen] = useState(false)
    const [target, setTarget] = useState<Favorite | null>(null)
    const [removing, setRemoving] = useState(false)

    useEffect(() => {
        const userId = getUserId()
        if (!userId) {
            setLoading(false)
            return
        }
        getFavorites(userId)
            .then((res) => setItems(res.data))
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت علاقه‌مندی‌ها')))
            .finally(() => setLoading(false))
    }, [])

    const filtered = useMemo(() => {
        const q = query.trim()
        const destination = filters.destination?.trim()
        const min = filters.minPrice ? Number(filters.minPrice) : null
        const max = filters.maxPrice ? Number(filters.maxPrice) : null

        return items.filter(({ house }) => {
            const price = Number(house.price)
            return (
                (!q || house.title.includes(q)) &&
                (!destination || house.address.includes(destination)) &&
                (min === null || price >= min) &&
                (max === null || price <= max)
            )
        })
    }, [items, query, filters])

    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const current = Math.min(page, pages)
    const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
    const filterCount = Object.values(filters).filter(Boolean).length

    const confirmRemove = async () => {
        if (!target) return
        setRemoving(true)
        try {
            await removeFavorite(target.id)
            setItems((prev) => prev.filter((i) => i.id !== target.id))
            toast.success('از علاقه‌مندی‌ها حذف شد')
            setTarget(null)
        } catch (e) {
            toast.error(getErrorMessage(e, 'حذف انجام نشد'))
        } finally {
            setRemoving(false)
        }
    }

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <ListToolbar
                title='لیست رزروهای ذخیره شده'
                count={filtered.length}
                query={query}
                onQueryChange={(v) => {
                    setQuery(v)
                    setPage(1)
                }}
                onFilterClick={() => setFilterOpen(true)}
                filterCount={filterCount}
            />

            <DataList
                columns={favoriteColumns}
                rows={visible}
                rowKey={(r) => r.id}
                loading={loading}
                emptyText='هنوز ملکی به علاقه‌مندی‌ها اضافه نکرده‌اید'
                actions={(row) => (
                    <RowMenu
                        items={[
                            { label: 'رزرو', icon: <Plus size={16} />, variant: 'primary', onClick: () => router.push(`/reserve/${row.house_id}`) },
                            { label: 'حذف', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => setTarget(row) },
                        ]}
                    />
                )}
            />

            <Pagination page={current} total={pages} onChange={setPage} />

            <FilterModal
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                fields={filterFields}
                values={filters}
                onApply={(v) => {
                    setFilters(v)
                    setPage(1)
                }}
            />

            <ConfirmModal
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={confirmRemove}
                loading={removing}
                icon={<Trash2 size={36} className='text-[#ED053F]' />}
                title='حذف از علاقه‌مندی‌ها'
                message='مطمئنی میخوای این ملک رو حذف کنی؟'
            />
        </div>
    )
}
'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Pagination from '@/components/dashboard/common/Pagination'
import { categoryLabel } from '@/lib/Api/blog'
import type { RentQuery } from '@/lib/Api/rent'
import {
    FILTER_KEYS,
    PAGE_LIMIT,
    RANGE_GROUPS,
    SORT_OPTIONS,
    TYPE_OPTIONS,
    transactionTypeParam,
    typeTitle,
    type RangeKey,
    type RentFilters,
} from './constants'
import { useRentCategories, useRentHouses, useRentLocations } from './hooks/use-rent-houses'
import RentActiveFilters, { type Chip } from './rent-active-filters'
import RentBreadcrumb, { type Crumb } from './rent-breadcrumb'
import RentCategories from './rent-categories'
import RentList from './rent-list'
import RentRangeFilters from './rent-range-filters'
import RentSearchBar from './rent-search-bar'

const numeric = (value: string | null) => {
    const n = Number(value)
    return value && Number.isFinite(n) && n > 0 ? String(n) : ''
}

const oneOf = (value: string | null, allowed: { value: string }[]) =>
    allowed.some((o) => o.value === value) ? (value as string) : ''

export default function RentPage() {
    const router = useRouter()
    const pathname = usePathname()
    const sp = useSearchParams()

    const filters = useMemo<RentFilters>(
        () => ({
            q: sp.get('q')?.trim() ?? '',
            sort: oneOf(sp.get('sort'), SORT_OPTIONS),
            location: sp.get('location') ?? '',
            type: oneOf(sp.get('type'), TYPE_OPTIONS),
            category: sp.get('category') ?? '',
            minArea: numeric(sp.get('minArea')),
            maxArea: numeric(sp.get('maxArea')),
            minPrice: numeric(sp.get('minPrice')),
            maxPrice: numeric(sp.get('maxPrice')),
            minRent: numeric(sp.get('minRent')),
            maxRent: numeric(sp.get('maxRent')),
            page: Math.max(1, Number(sp.get('page')) || 1),
        }),
        [sp]
    )

    const [text, setText] = useState(filters.q)

    const update = useCallback(
        (patch: Partial<Record<keyof RentFilters, string | undefined>>) => {
            const next = new URLSearchParams(sp.toString())
            Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
            if (!('page' in patch)) next.delete('page')
            const s = next.toString()
            router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false })
        },
        [sp, router, pathname]
    )

    useEffect(() => {
        if (text.trim() === filters.q) return
        const t = setTimeout(() => update({ q: text.trim() || undefined }), 400)
        return () => clearTimeout(t)
    }, [text, filters.q, update])

    const { categories, loading: categoriesLoading } = useRentCategories()
    const locations = useRentLocations()

    const query = useMemo<RentQuery>(
        () => ({
            page: filters.page,
            limit: PAGE_LIMIT,
            search: filters.q,
            transactionType: transactionTypeParam(filters.type),
            sort: filters.sort,
            location: filters.location,
            category: filters.category,
            minArea: filters.minArea,
            maxArea: filters.maxArea,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minRent: filters.minRent,
            maxRent: filters.maxRent,
        }),
        [filters]
    )

    const { houses, total, loading, error, retry } = useRentHouses(query)
    const totalPages = Math.ceil(total / PAGE_LIMIT)

    useEffect(() => {
        if (!loading && !error && totalPages > 0 && filters.page > totalPages) update({ page: undefined })
    }, [loading, error, totalPages, filters.page, update])

    const changePage = (p: number) => {
        update({ page: p === 1 ? undefined : String(p) })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const resetAll = () => {
        setText('')
        router.replace(pathname, { scroll: false })
    }

    const clear = (key: keyof RentFilters) => {
        if (key === 'q') setText('')
        update({ [key]: undefined })
    }

    const hrefFor = (params: Record<string, string>) => {
        const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
        return s ? `${pathname}?${s}` : pathname
    }

    const title = typeTitle(filters.type)
    const categoryName = filters.category ? categoryLabel(filters.category) : ''

    const crumbs: Crumb[] = [
        { label: 'خانه', href: '/' },
        { label: title, href: hrefFor({ type: filters.type }) },
    ]
    if (categoryName) {
        crumbs.push({
            label: `${title} ${categoryName}‌ها`,
            href: hrefFor({ type: filters.type, category: filters.category }),
        })
    }
    if (filters.location) {
        crumbs.push({ label: `${title}${categoryName ? ` ${categoryName}` : ''} ${filters.location}` })
    }

    const chips: Chip[] = []
    if (filters.q) chips.push({ key: 'q', label: `«${filters.q}»`, onRemove: () => clear('q') })
    if (filters.category) chips.push({ key: 'category', label: categoryName, onRemove: () => clear('category') })
    if (filters.location) chips.push({ key: 'location', label: filters.location, onRemove: () => clear('location') })
    if (filters.type) chips.push({ key: 'type', label: title, onRemove: () => clear('type') })
    RANGE_GROUPS.forEach((group) => {
        ;([
            [group.minKey, group.minTitle],
            [group.maxKey, group.maxTitle],
        ] as const).forEach(([key, label]) => {
            const value = filters[key]
            if (value) chips.push({ key, label: `${label}: ${group.format(Number(value))}`, onRemove: () => clear(key) })
        })
    })

    const rangeValues = {
        minArea: filters.minArea,
        maxArea: filters.maxArea,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRent: filters.minRent,
        maxRent: filters.maxRent,
    } satisfies Record<RangeKey, string>

    const hasFilters = FILTER_KEYS.some((key) => Boolean(filters[key]))

    return (
        <div className='mx-auto flex w-full max-w-[1920px] flex-col gap-5 px-4 pb-12 pt-4 sm:gap-6 sm:px-6 lg:px-10 xl:px-24'>
            <RentBreadcrumb items={crumbs} />

            <RentSearchBar
                text={text}
                onText={setText}
                sort={filters.sort}
                location={filters.location}
                type={filters.type}
                locationOptions={locations.map((l) => l.name)}
                onChange={(key, value) => update({ [key]: value || undefined })}
            />

            <RentCategories
                categories={categories}
                loading={categoriesLoading}
                active={filters.category}
                onSelect={(name) => update({ category: name || undefined })}
            />

            <div className='relative z-20'>
                <RentRangeFilters values={rangeValues} onChange={(key, value) => update({ [key]: value || undefined })} />
            </div>

            <RentActiveFilters chips={chips} onClear={resetAll} />

            <RentList
                houses={houses}
                loading={loading}
                error={error}
                onRetry={retry}
                onReset={resetAll}
                hasFilters={hasFilters}
            />

            {!loading && !error && <Pagination page={filters.page} total={totalPages} onChange={changePage} />}
        </div>
    )
}

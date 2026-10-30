'use client'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import FilterDrawer, { Filters } from '@/components/reserve/filters/FilterDrawer'
import NavigationBar from '@/components/reserve/hotels/NavigationBar'
import Toolbar from '@/components/reserve/hotels/ToolBar'
import HotelList from '@/components/reserve/hotels/HotelList'
import MapPanel from '@/components/reserve/map/MapPanel'
import { useHotels } from '@/components/reserve/hotels/hooks/useHotels'

const one = (v: string | null) => (v ? [v] : [])

const Content = () => {
    const router = useRouter()
    const pathname = usePathname()
    const sp = useSearchParams()

    const [filterOpen, setFilterOpen] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const query = sp.get('q') ?? ''
    const [text, setText] = useState(query)

    const filters = useMemo<Filters>(
        () => ({
            destination: one(sp.get('destination')),
            sort: one(sp.get('sort')),
            minPrice: one(sp.get('minPrice')),
            maxPrice: one(sp.get('maxPrice')),
            rooms: one(sp.get('rooms')),
            bathrooms: one(sp.get('bathrooms')),
            toilets: one(sp.get('toilets')),
            parking: one(sp.get('parking')),
        }),
        [sp]
    )

    const update = useCallback(
        (patch: Record<string, string | undefined>) => {
            const next = new URLSearchParams(sp.toString())
            Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
            const s = next.toString()
            router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false })
        },
        [sp, router, pathname]
    )

    useEffect(() => {
        if (text === query) return
        const t = setTimeout(() => update({ q: text.trim() || undefined }), 400)
        return () => clearTimeout(t)
    }, [text, query, update])

    const { hotels, loading, error } = useHotels(filters, query)

    const activeId = hotels.some((h) => h.id === selectedId) ? selectedId : null
    const selectedHotel = hotels.find((h) => h.id === activeId)

    const select = (id: number) => {
        const next = id === activeId ? null : id
        setSelectedId(next)
        if (next !== null && window.matchMedia('(max-width: 1023px)').matches) setShowMap(true)
    }

    const applyFilters = (f: Filters) =>
        update({
            destination: f.destination[0],
            sort: f.sort[0],
            minPrice: f.minPrice[0],
            maxPrice: f.maxPrice[0],
            rooms: f.rooms[0],
            bathrooms: f.bathrooms[0],
            toilets: f.toilets[0],
            parking: f.parking[0],
        })

    const resetAll = () => {
        setText('')
        router.replace(pathname, { scroll: false })
    }

    return (
        <div className='w-full max-w-[1920px] mx-auto pt-4 flex flex-col lg:flex-row h-[calc(100dvh-79px)]'>
            <div
                className={`${showMap ? 'hidden' : 'flex'} lg:flex lg:pl-4 w-full lg:flex-1 min-w-0 flex-1 min-h-0 flex-col gap-4 lg:gap-5 items-center`}
            >
                <NavigationBar hotelTitle={selectedHotel?.title} />

                <Toolbar
                    query={text}
                    onQueryChange={setText}
                    onOpenFilters={() => setFilterOpen(true)}
                    onShowMap={() => setShowMap(true)}
                />

                <HotelList
                    hotels={hotels}
                    loading={loading}
                    error={error}
                    selectedId={activeId}
                    onSelect={select}
                    onReset={resetAll}
                />
            </div>

            <MapPanel hotels={hotels} selectedId={activeId} visible={showMap} onSelect={select} onBack={() => setShowMap(false)} />

            <FilterDrawer open={filterOpen} value={filters} onClose={() => setFilterOpen(false)} onApply={applyFilters} />
        </div>
    )
}

const Page = () => (
    <Suspense>
        <Content />
    </Suspense>
)

export default Page
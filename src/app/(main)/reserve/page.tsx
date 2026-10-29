'use client'
import { useMemo, useState } from 'react'
import FilterDrawer, { Filters, emptyFilters } from '@/components/reserve/filters/FilterDrawer'
import NavigationBar from '@/components/reserve/hotels/NavigationBar'
import Toolbar from '@/components/reserve/hotels/ToolBar'
import HotelList from '@/components/reserve/hotels/HotelList'
import MapPanel from '@/components/reserve/map/MapPanel'
import { filterHotels } from '@/data/hotels'
import { useDebounce } from '@/components/reserve/hotels/hook/useDebounce'
import { useHotels } from '@/components/reserve/hotels/hook/useHotels'

const Page = () => {
    const [filterOpen, setFilterOpen] = useState(false)
    const [showMap, setShowMap] = useState(false) // mobile/tablet only
    const [filters, setFilters] = useState<Filters>(emptyFilters)
    const [query, setQuery] = useState('')
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const debouncedQuery = useDebounce(query, 400)

    const { hotels, loading, error } = useHotels()

    const visible = useMemo(
        () => filterHotels(hotels, filters, debouncedQuery),
        [hotels, filters, debouncedQuery]
    )

    const activeId = visible.some((h) => h.id === selectedId) ? selectedId : null
    const selectedHotel = visible.find((h) => h.id === activeId)

    const select = (id: number) => {
        setSelectedId(id)
        if (window.matchMedia('(max-width: 1023px)').matches) setShowMap(true)
    }

    const resetAll = () => {
        setFilters(emptyFilters)
        setQuery('')
    }

    return (
        <div className='w-full max-w-[1920px] mx-auto pt-4 flex flex-col lg:flex-row h-[calc(100dvh-79px)]'>
            <div
                className={`${showMap ? 'hidden' : 'flex'} lg:flex lg:pl-4 w-full lg:flex-1 min-w-0 flex-1 min-h-0 flex-col gap-4 lg:gap-5 items-center`}
            >
                <NavigationBar hotelTitle={selectedHotel?.title} />

                <Toolbar
                    query={query}
                    onQueryChange={setQuery}
                    onOpenFilters={() => setFilterOpen(true)}
                    onShowMap={() => setShowMap(true)}
                />

                <HotelList
                    hotels={visible}
                    loading={loading}
                    error={error}
                    selectedId={activeId}
                    onSelect={select}
                    onReset={resetAll}
                />
            </div>

            <MapPanel
                hotels={visible}
                selectedId={activeId}
                visible={showMap}
                onSelect={select}
                onBack={() => setShowMap(false)}
            />

            <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} onApply={setFilters} />
        </div>
    )
}

export default Page
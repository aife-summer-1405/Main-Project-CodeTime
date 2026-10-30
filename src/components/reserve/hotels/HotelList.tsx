import HotelCard from './HotelCard'
import HotelCardSkeleton from './HotelSkeleton'
import EmptyState from './EmptyState'
import type { Hotel } from '@/lib/Api/house'

type Props = {
    hotels: Hotel[]
    loading: boolean
    error: string | null
    selectedId: number | null
    onSelect: (id: number) => void
    onReset: () => void
}

export default function HotelList({ hotels, loading, error, selectedId, onSelect, onReset }: Props) {
    return (
        <div dir='ltr' className='blue-scroll w-full pt-2 flex-1 min-h-0 overflow-y-auto pr-2'>
            <div dir='rtl' className='flex flex-col gap-3 pr-6 pl-3 pb-4' aria-busy={loading}>
                {loading && Array.from({ length: 4 }).map((_, i) => <HotelCardSkeleton key={i} />)}

                {!loading && error && <p className='py-16 text-center text-sm text-red-500'>{error}</p>}
                {!loading && !error && hotels.length === 0 && <EmptyState onReset={onReset} />}

                {!loading &&
                    hotels.map((hotel) => (
                        <HotelCard key={hotel.id} hotel={hotel} selected={hotel.id === selectedId} onSelect={onSelect} />
                    ))}
            </div>
        </div>
    )
}
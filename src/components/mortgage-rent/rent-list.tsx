import { SearchX, TriangleAlert } from 'lucide-react'
import type { RentHouse } from '@/lib/Api/rent'
import RentCard from './rent-card/rent-card'

type Props = {
    houses: RentHouse[]
    loading: boolean
    error: string | null
    onRetry: () => void
    onReset: () => void
    hasFilters: boolean
}

export const RentCardSkeleton = () => (
    <div aria-hidden='true' className='flex w-full animate-pulse flex-col gap-3 rounded-[32px] bg-white-1 p-2 shadow-[0px_0px_6px_0px_#0887CA40] dark:bg-black-1 dark:shadow-none dark:ring-1 dark:ring-white-1/10 sm:h-40.5 sm:flex-row'>
        <div className='h-48 w-full shrink-0 rounded-[24px] bg-[#E9EEF1] dark:bg-[#242424] sm:h-full sm:w-44 md:w-48' />
        <div className='flex min-w-0 flex-1 flex-col justify-between gap-3 p-2'>
            <div className='flex flex-col gap-2'>
                <div className='h-4 w-2/3 rounded bg-[#E9EEF1] dark:bg-[#242424]' />
                <div className='h-3 w-1/2 rounded bg-[#E9EEF1] dark:bg-[#242424]' />
            </div>
            <div className='h-3 w-3/4 rounded bg-[#E9EEF1] dark:bg-[#242424]' />
            <div className='flex items-center justify-between'>
                <div className='h-4 w-24 rounded bg-[#E9EEF1] dark:bg-[#242424]' />
                <div className='h-9 w-24 rounded-[8px] bg-[#E9EEF1] dark:bg-[#242424]' />
            </div>
        </div>
    </div>
)

const grid = 'grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6'

export default function RentList({ houses, loading, error, onRetry, onReset, hasFilters }: Props) {
    if (loading) {
        return (
            <div className={grid} aria-busy='true'>
                {Array.from({ length: 6 }).map((_, i) => (
                    <RentCardSkeleton key={i} />
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex flex-col items-center gap-3 py-16 text-sm text-black-2/70 dark:text-white-1/70'>
                <TriangleAlert size={36} />
                <p>{error}</p>
                <button
                    type='button'
                    onClick={onRetry}
                    className='cursor-pointer rounded-[12px] border border-blue-3 px-4 py-2 text-blue-3 transition active:scale-[0.97] dark:border-blue-4 dark:text-blue-4'
                >
                    تلاش دوباره
                </button>
            </div>
        )
    }

    if (houses.length === 0) {
        return (
            <div className='flex flex-col items-center gap-3 py-16 text-sm text-black-2/70 dark:text-white-1/70'>
                <SearchX size={36} />
                <p>ملکی با این فیلترها پیدا نشد.</p>
                {hasFilters && (
                    <button
                        type='button'
                        onClick={onReset}
                        className='cursor-pointer rounded-[12px] border border-blue-3 px-4 py-2 text-blue-3 transition active:scale-[0.97] dark:border-blue-4 dark:text-blue-4'
                    >
                        پاک کردن فیلترها
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className={grid}>
            {houses.map((house) => (
                <RentCard key={house.id} house={house} />
            ))}
        </div>
    )
}

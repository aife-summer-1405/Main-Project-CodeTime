import { Suspense } from 'react'
import type { Metadata } from 'next'
import RentPage from '@/components/mortgage-rent/rent-page'
import { RentCardSkeleton } from '@/components/mortgage-rent/rent-list'

export const metadata: Metadata = { title: 'رهن و اجاره' }

const Fallback = () => (
    <div className='mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-4 px-4 pb-12 pt-4 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:px-10 xl:px-24'>
        {Array.from({ length: 6 }).map((_, i) => (
            <RentCardSkeleton key={i} />
        ))}
    </div>
)

export default function Page() {
    return (
        <Suspense fallback={<Fallback />}>
            <RentPage />
        </Suspense>
    )
}

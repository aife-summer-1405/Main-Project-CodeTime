import { Suspense } from 'react'
import { connection } from 'next/server'
import MortgageDetail from '@/components/mortgage/details/MortgageDetail'
import { getMortgageById } from '@/lib/Api/mortgage'
import { getCommentsByHouseId } from '@/lib/Api/reserveDetail'
import HotelDetailSkeleton from '@/components/reserve/details/Loading/HotelDetailSkeleton'

interface IParams {
    params: Promise<{ id: string }>
}

async function MortgageContent({ params }: IParams) {
    await connection()
    const { id } = await params

    const [house, commentsData] = await Promise.all([
        getMortgageById(id),
        getCommentsByHouseId(id),
    ])

    return (
        <MortgageDetail
            house={house}
            comments={commentsData.comments}
            totalComments={commentsData.totalCount}
        />
    )
}

export default function MortgageDetailPage({ params }: IParams) {
    return (
        <main>
            <Suspense fallback={<HotelDetailSkeleton />}>
                <MortgageContent params={params} />
            </Suspense>
        </main>
    )
}

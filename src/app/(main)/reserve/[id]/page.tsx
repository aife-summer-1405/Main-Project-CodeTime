import { Suspense } from "react";
import { connection } from "next/server";
import HotelDetail from "@/components/reserve/details/HotelDetail";
import { getHotelById } from "@/lib/Api/house";
import { getCommentsByHouseId, getHouseById } from "@/lib/Api/reserveDetail";
import HotelDetailSkeleton from "@/components/reserve/details/Loading/HotelDetailSkeleton";

interface IParams {
    params: Promise<{
        id: string;
    }>;
}

async function HotelContent({ params }: IParams) {
    await connection();

    const { id } = await params;

    const [hotel, commentsData] = await Promise.all([
        getHotelById(id),
        getCommentsByHouseId(id),
    ]);

    return (
        <HotelDetail
            hotel={hotel}
            comments={commentsData.comments}
            totalComments={commentsData.totalCount}
        />
    );
}

export default function ReserveDetailPage({ params }: IParams) {
    return (
        <main>
            <Suspense fallback={<HotelDetailSkeleton />}>
                <HotelContent params={params} />
            </Suspense>
        </main>
    );
}
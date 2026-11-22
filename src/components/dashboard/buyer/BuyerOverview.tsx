import FavoritesPreview from './favorites/FavoritesPreview'
import ProfileCard from './ProfileCard'
import BookingsChart from './ReservationChart'
import StatCards from './StatCards'

export default function BuyerOverview() {
    return (
        <div className='flex min-w-0 flex-col gap-5 '>
            <h1 className='text-base font-bold text-[#0087CA]'>••• داشبورد •••</h1>

            <div className='grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_230px]'>
                <div className='flex min-w-0 flex-col gap-4'>
                    <StatCards />
                    <FavoritesPreview />
                </div>

                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-1 xl:content-start'>
                    <ProfileCard />
                    <BookingsChart />
                </div>
            </div>
        </div>
    )
}
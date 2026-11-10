'use client'
import Link from 'next/link'
import type { Hotel } from '@/lib/Api/house'
import HotelSlider from './HotelSlider'
import HotelInfo from './HotelInfo'
import HotelTags from './HotelTags'
import HotelAbout from './HotelAbout'
import HotelComments from './comments/HotelComments'
import HotelReserveCard from './HotelReserveCard'
import SiteFooter from '@/components/footer/Footer'
import { Comment } from '@/lib/Api/reserveDetail'
import SimilarHotels from './SimilarHotels'
interface IProps {
    hotel: Hotel
    comments: Comment[]
    totalComments: number
}

const HotelDetail = ({ hotel, comments, totalComments }: IProps) => {

    return (
        <>
            <div className='w-full bg-white-1 dark:bg-transparent max-w-[1920px] mx-auto overflow-hidden'>
                <div className='text-gray-1 px-4 pt-4 lg:pr-6 w-full text-xs sm:text-sm font-semibold flex gap-1.5 sm:gap-2.5'>

                    <Link className='cursor-pointer whitespace-nowrap' href='/'>
                        خانه /
                    </Link>

                    <Link href={'/reserve'} className='cursor-pointer whitespace-nowrap'>
                        رزرو هتل /
                    </Link>

                    <p
                        className='text-[#10088F] truncate min-w-0'
                        title={hotel.title}
                    >
                        {hotel.title}
                    </p>

                </div>

                <HotelSlider photos={hotel.photos} title={hotel.title} />
                <HotelInfo hotel={hotel} />
                <div className='px-4 sm:px-6 lg:px-10 xl:px-24 flex flex-col lg:flex-row gap-6 lg:gap-8 mt-5 pb-9'>
                    {/* left container */}
                    <div className='w-full min-w-0 h-full shadow-[0_0_10px_0_#005EA41A] p-3 sm:p-6 rounded-[16px] bg-[#F5F5F5D9]'>
                        <HotelTags hotel={hotel} />
                        <HotelAbout hotel={hotel} />
                        <HotelComments comments={comments} total={totalComments} houseId={hotel.id} />
                    </div>
                    {/* right container */}
                    <div className='w-full lg:w-80 xl:w-100 shrink-0 flex flex-col gap-6 lg:gap-8'>
                        <aside className='w-full lg:min-h-110 shadow-[0_0_10px_0_#005EA41A] rounded-[16px] bg-[#F5F5F5D9]'>
                            <HotelReserveCard hotel={hotel} />
                        </aside>
                        <SimilarHotels currentId={hotel.id} categoryName={hotel.categories?.name} />
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    )
}

export default HotelDetail
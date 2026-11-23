'use client'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import HotelSlider from '@/components/reserve/details/HotelSlider'
import HotelInfo from '@/components/reserve/details/HotelInfo'
import HotelTags from '@/components/reserve/details/HotelTags'
import HotelComments from '@/components/reserve/details/comments/HotelComments'
import SiteFooter from '@/components/footer/Footer'
import type { Comment } from '@/lib/Api/reserveDetail'
import type { MortgageHouse } from '@/lib/Api/mortgage'
import MortgageAbout from './MortgageAbout'
import MortgageContactCard from './MortgageContactCard'
import SimilarMortgages from './SimilarMortgages'

const MortgageMap = dynamic(() => import('./MortgageMap'), {
    ssr: false,
    loading: () => <div className='w-full h-[260px] sm:h-[340px] rounded-[16px] bg-gray-100 animate-pulse' />,
})

interface IProps {
    house: MortgageHouse
    comments: Comment[]
    totalComments: number
}

const MortgageDetail = ({ house, comments, totalComments }: IProps) => {
    return (
        <>
            <div className='w-full bg-white-1 dark:bg-transparent max-w-[1920px] mx-auto overflow-hidden'>
                <div className='text-gray-1 px-4 pt-4 lg:pr-6 w-full text-xs sm:text-sm font-semibold flex gap-1.5 sm:gap-2.5'>
                    <Link className='cursor-pointer whitespace-nowrap' href='/'>خانه /</Link>
                    <Link className='cursor-pointer whitespace-nowrap' href='/mortgage'>رهن و اجاره /</Link>
                    <p className='text-[#10088F] truncate min-w-0' title={house.title}>{house.title}</p>
                </div>

                <HotelSlider photos={house.photos} title={house.title} />
                <HotelInfo hotel={house} />

                <div className='px-4 sm:px-6 lg:px-10 xl:px-24 flex flex-col lg:flex-row gap-6 lg:gap-8 mt-5 pb-9'>
                    {/* left container */}
                    <div className='w-full min-w-0 h-full shadow-[0_0_10px_0_#005EA41A] p-3 sm:p-6 rounded-[16px] bg-[#F5F5F5D9]'>
                        <HotelTags hotel={house} />
                        <MortgageAbout house={house} />

                        <section className='w-full flex flex-col gap-4 mt-8 sm:mt-10'>
                            <h2 className='text-[#10088F] text-sm sm:text-[16px] font-bold'>موقعیت مکانی</h2>
                            <div className='w-full h-[260px] sm:h-[340px] rounded-[16px] overflow-hidden relative z-0 border border-[#0887CA1A]'>
                                <MortgageMap lat={house.location?.lat} lng={house.location?.lng} title={house.title} />
                            </div>
                            <p className='text-[#060425] text-sm sm:text-[15px] font-medium leading-7'>{house.address}</p>
                        </section>

                        <HotelComments comments={comments} total={totalComments} houseId={house.id} />
                    </div>

                    {/* right container */}
                    <div className='w-full lg:w-80 xl:w-100 shrink-0 flex flex-col gap-6 lg:gap-8'>
                        <aside className='w-full shadow-[0_0_10px_0_#005EA41A] rounded-[16px] bg-[#F5F5F5D9]'>
                            <MortgageContactCard house={house} />
                        </aside>
                        <SimilarMortgages currentId={house.id} categoryName={house.categories?.name} />
                    </div>
                </div>
            </div>
            <SiteFooter />
        </>
    )
}

export default MortgageDetail

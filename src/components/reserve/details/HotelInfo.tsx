import { Hotel } from '@/lib/Api/house'
import { Star } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
interface IProps {
  hotel: Hotel
}
const HotelInfo = ({ hotel }: IProps) => {

  // copy link page
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('لینک صفحه کپی شد')
  }

  return (
    // title
    <div className=' max-w-[1920px] mx-auto min-h-20 py-3 px-4 sm:px-8 lg:px-16 xl:px-30 flex items-center justify-between gap-3'>
      <div className='flex flex-col min-w-0'>
        <ul className='flex flex-wrap gap-x-3 gap-y-1 items-center'>
          <h1 className='text-base sm:text-[21px] text-[#060425] dark:text-white-1 font-bold'>{hotel.title}</h1>
          <div className='flex gap-1.5'>
            <p className='text-sm text-[#060425] dark:text-white-1'>3.5</p>
            <Star size={16} color='#EDB305' />
          </div>
        </ul>
        <p className='flex items-center gap-1.5 mt-2 text-gray-1 dark:text-white-1 text-xs sm:text-sm w-full min-w-0'>
          <img className='h-5 w-5 dark:hidden' src="/images/Loc.svg" alt="" />
          <img className='h-5 w-5 dark:block' src="/images/LocD.svg" alt="" />
          <span className='truncate w-full'>{hotel.address}</span>
        </p>
      </div>
      <div className='flex items-center gap-2 sm:gap-3 shrink-0 '>
        <div onClick={() => { copyLink() }} className='w-8 active:scale-[0.9] dark:bg-white-1 transition-[0.5s] cursor-pointer rounded-[8px] h-8 border border-gray-500 flex items-center justify-center'>
          <img src="/images/021.svg" alt="" />
        </div>
        <div className='w-8 cursor-pointer rounded-[8px] h-8 border border-blue-4 flex items-center justify-center'>
          <img src="/images/arrow.svg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default HotelInfo
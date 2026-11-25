'use client'

import { useEffect, useState } from 'react'
import { Heart, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { Hotel } from '@/lib/Api/house'
import { addHotelToFavorites, getHouseById, removeHotelFromFavorites } from '@/lib/Api/reserveDetail'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getUserId } from '@/lib/Api/dashboard/common/user'

interface IProps {
  hotel: Hotel
}

const errorMessages: Record<string, string> = {
  'This house is already in favorites': 'این خانه قبلاً به علاقه‌مندی‌ها اضافه شده است',
}

const HotelInfo = ({ hotel }: IProps) => {
  const [favoriteId, setFavoriteId] = useState<string | null>(hotel.favoriteId)
  const [loading, setLoading] = useState(false)

  const syncFavorite = async (signal?: AbortSignal) => {
    const house = await getHouseById(hotel.id, signal)
    setFavoriteId(house.favoriteId)
  }

  useEffect(() => {
    if (!getUserId()) return
    const controller = new AbortController()
    syncFavorite(controller.signal).catch(() => { })
    return () => controller.abort()
  }, [hotel.id])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('لینک صفحه کپی شد')
  }

  const onFavorite = async () => {
    if (loading) return
    if (!getUserId()) return toast.error('برای افزودن به علاقه‌مندی‌ها وارد حساب کاربری شوید')
    setLoading(true)
    try {
      if (favoriteId) {
        await removeHotelFromFavorites(favoriteId)
        setFavoriteId(null)
        toast.success('از علاقه‌مندی‌ها حذف شد')
      } else {
        setFavoriteId(await addHotelToFavorites(hotel.id))
        toast.success('به علاقه‌مندی‌ها اضافه شد')
      }
    } catch (error) {
      const message = getErrorMessage(error, '')
      toast.error(errorMessages[message] ?? 'خطا در بروزرسانی علاقه‌مندی‌ها')
      if (message in errorMessages) syncFavorite().catch(() => { })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=' max-w-[1920px] mx-auto min-h-20 py-3 px-4 sm:px-8 lg:px-16 xl:px-30 flex items-center justify-between gap-3'>
      <div className='flex flex-col min-w-0'>
        <ul className='flex flex-wrap gap-x-3 gap-y-1 items-center'>
          <h1 className='text-base sm:text-[21px] text-[#060425] dark:text-white-1 font-bold'>{hotel.title}</h1>
          <div className='flex gap-1.5'>
            <p className='text-sm text-[#060425] dark:text-white-1'>{hotel.rate}</p>
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
        <button
          type='button'
          onClick={onFavorite}
          disabled={loading}
          aria-label={favoriteId ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
          className='w-8 active:scale-[0.9] dark:bg-white-1 transition-[0.5s] cursor-pointer rounded-[8px] h-8 border border-gray-500 flex items-center justify-center disabled:opacity-60'
        >
          <Heart size={18} className={favoriteId ? 'fill-[#E5484D] text-[#E5484D]' : 'text-[#060425]'} />
        </button>
        <div onClick={copyLink} className='w-8 active:scale-[0.9] dark:bg-white-1 transition-[0.5s] cursor-pointer rounded-[8px] h-8 border border-gray-500 flex items-center justify-center'>
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
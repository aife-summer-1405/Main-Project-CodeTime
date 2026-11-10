'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpLeft, ChevronLeft, MapPin, Star } from 'lucide-react'
import { getHotels, Hotel } from '@/lib/Api/house'

interface IProps {
    currentId: string
    categoryName?: string
}

const emptyQuery = { query: '', destination: '', sort: '', minPrice: '', maxPrice: '' }
const fallbackImage = '/images/Rectangle (4).png'

const SimilarHotels = ({ currentId, categoryName }: IProps) => {
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()

        getHotels(emptyQuery, controller.signal)
            .then((list) => {
                const others = list.filter((h) => String(h.id) !== String(currentId))
                const sameCategory = others.filter((h) => h.categories?.name === categoryName)
                const rest = others.filter((h) => h.categories?.name !== categoryName)
                setHotels([...sameCategory, ...rest].slice(0, 3))
            })
            .catch(() => { })
            .finally(() => setLoading(false))

        return () => controller.abort()
    }, [currentId, categoryName])

    if (!loading && hotels.length === 0) return null

    return (
        <div className='w-full relative z-1000 shadow-[0_0_10px_0_#005EA41A] rounded-[16px] bg-[#F5F5F5] dark:bg-[#F5F5F5D9] px-4 py-5 sm:px-8 sm:py-6 lg:px-4 xl:px-8'>
            <h2 className='text-center text-[#10088F] text-[16px] font-bold'>موارد مشابه</h2>
            <div className='w-full border-t border-[#0887CA66] mt-4 mb-6' />

            <div className='flex flex-col gap-4'>
                {loading
                    ? [1, 2, 3].map((i) => (
                        <div key={i} className='h-[100px] sm:h-[116px] rounded-[16px] bg-[#0887CA0D] animate-pulse' />
                    ))
                    : hotels.map((hotel) => (
                        <Link
                            key={hotel.id}
                            href={`/reserve/${hotel.id}`}
                            className='flex gap-3 p-2 rounded-[16px] border border-[#0887CA1A] shadow-[0_0_10px_0_#005EA41A] hover:-translate-y-0.5 duration-300'
                        >
                            <div className='relative w-[104px] h-[92px] min-[420px]:w-[140px] min-[420px]:h-[100px] sm:w-[172px] sm:h-[108px] lg:w-[104px] lg:h-[92px] xl:w-[172px] xl:h-[108px] shrink-0'>
                                {hotel.photos === undefined ? (
                                    <img src={hotel.photos[0]} alt={hotel.title} className='w-full h-full object-cover rounded-[8px]' />
                                ) : (
                                    <div className='w-full h-full object-cover from-lime-400 to-green-2 bg-linear-30 rounded-[8px]'></div>
                                )}
                                <div className='absolute top-2 right-2 flex items-center gap-1 text-white text-xs font-bold'>
                                    <Star size={14} color='white' />
                                    {hotel.rate.toLocaleString('fa-IR', { minimumFractionDigits: 1 })}
                                </div>
                                <ArrowUpLeft size={16} color='white' className='absolute top-2 left-2' />
                            </div>

                            <div className='flex flex-col justify-between gap-1 flex-1 min-w-0 py-1'>
                                <h3 className='text-[13px] sm:text-[14px] font-bold text-[#060425] truncate'>{hotel.title}</h3>

                                <div className='flex items-center gap-1.5 text-xs text-[#060425]/70 min-w-0'>
                                    <MapPin size={18} color='#555' className='shrink-0' />
                                    <p className='truncate'>{hotel.address}</p>
                                </div>

                                <div className='border-t border-[#0887CA33] pt-2'>
                                    <p className='text-[#0887CA] text-xs sm:text-sm font-bold'>
                                        {hotel.price.toLocaleString('fa-IR')} تومان
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
            </div>

            <div className='w-full flex items-center justify-end'>
                <Link
                    href='/reserve'
                    className='flex items-center gap-1 mt-5 text-sm text-[#0887CA] underline w-fit cursor-pointer'
                >
                    مشاهده تمامی موارد
                    <ChevronLeft size={16} color='#0887CA' />
                </Link>
            </div>
        </div>
    )
}

export default SimilarHotels
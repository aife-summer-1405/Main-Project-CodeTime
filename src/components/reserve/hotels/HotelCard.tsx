import Link from 'next/link'
import { Star, MapPin, Moon, ArrowUpLeft } from 'lucide-react'
import { fa } from '@/lib/format'
import { Hotel } from '@/lib/Api/house'

type Props = {
    hotel: Hotel
    selected: boolean
    onSelect: (id: number) => void
}

export default function HotelCard({ hotel, selected, onSelect }: Props) {
    return (
        <div
            role='button'
            tabIndex={0}
            aria-pressed={selected}
            onClick={() => onSelect(hotel.id)}
            onKeyDown={(e) => {
                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onSelect(hotel.id)
                }
            }}
            className={`group cursor-pointer shadow-[0_0_6px_0_#0887CA40] w-full md:h-55 shrink-0 p-2 border hover:border-blue-4 hover:border-2 transition rounded-[32px] flex flex-col md:flex-row gap-3 ${selected ? 'border-blue-4 border-2' : ''}`}
        >
            <div className='relative h-52 md:h-full w-full md:w-64 xl:w-90 shrink-0'>
                {hotel.discount > 0 && (
                    <>
                        <span className='absolute top-7 z-10 -right-6 bg-red-500 text-white text-xs font-bold px-1 py-1 rounded-tr-[4px] rounded-br-[4px]'>
                            %{fa(hotel.discount)}
                        </span>
                        <div
                            style={{ clipPath: 'polygon( 100% 100%, 0 100% ,0 0)' }}
                            className='absolute top-5 z-1 -right-6 bg-red-400 font-bold w-4 h-3'
                        />
                    </>
                )}

                <div className='relative z-10 w-full h-full rounded-[24px] overflow-hidden'>
                    {hotel.photos ? (
                        <img src={hotel.photos} alt={hotel.title} className='w-full h-full object-cover' />
                    ) : (
                        <div className='w-full h-full object-cover bg-pink-500'></div>
                    )}

                    <div className='absolute top-3 right-3 flex items-center gap-1 text-white text-xs font-bold'>
                        <span>{fa(hotel.rating)}</span>
                        <Star size={20} />
                    </div>

                    <Link
                        href={`/hotels/${hotel.id}`}
                        onClick={(e) => e.stopPropagation()}
                        aria-label='مشاهده'
                        className='absolute top-3 left-3 cursor-pointer text-white'
                    >
                        <ArrowUpLeft size={18} />
                    </Link>
                </div>
            </div>

            <div className='w-full min-w-0 h-full p-2 flex flex-col justify-between gap-3'>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-[#060425] dark:text-white-1 font-bold text-base'>{hotel.title}</h2>
                    <p className='flex items-center gap-1.5 text-gray-1 text-xs w-full'>
                        <MapPin size={20} className='shrink-0' />
                        <span className='truncate w-full'>{hotel.location}</span>
                    </p>
                </div>

                <i className='w-full border-t' />

                <p className='flex items-center gap-1.5 text-gray-1 text-xs'>
                    <Moon size={14} />
                    10 شب
                </p>

                <div className='flex flex-col gap-3'>
                    <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1'>
                        {hotel.discount > 0 ? (
                            <div className='text-gray-1 text-xs relative'>
                                <div className='border-t border-red-1 absolute top-[5px] left-0 w-full' />
                                {fa(hotel.oldPrice)} تومان
                            </div>
                        ) : (
                            <span />
                        )}

                        <p className='text-blue-4 font-bold text-sm'>
                            {fa(hotel.price)} تومان
                            <span className='text-gray-1 font-normal text-xs'> /هر شب</span>
                        </p>
                    </div>

                    <Link
                        href={`/hotels/${hotel.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className='w-full h-10 flex justify-center items-center rounded-[12px] border border-[#0887CA] text-[#0887CA] text-sm font-medium transition active:scale-[0.97] group-hover:bg-[#0887CA] group-hover:text-white'
                    >
                        بررسی و رزرو
                    </Link>
                </div>
            </div>
        </div>
    )
}
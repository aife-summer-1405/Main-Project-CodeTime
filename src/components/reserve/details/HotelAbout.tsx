import { Hotel } from '@/lib/Api/house'
import React from 'react'

interface IProps {
    hotel: Hotel;
}

const HotelAbout = ({ hotel }: IProps) => {
    return (
        <div className='w-full flex flex-col mt-8 sm:mt-13 gap-5 sm:gap-8'>
            <h1 className='text-[#10088F] text-sm sm:text-[16px] font-bold'>درباره {hotel.title}</h1>

            <div className='w-full flex flex-col pr-0 sm:pr-3.5 gap-2.5'>
                <h1 className='text-[#060425] text-base sm:text-[20px] font-bold'>{hotel.title}</h1>
                <p className='text-[#060425] text-sm sm:text-[15px] font-medium leading-7'>{hotel.caption ? hotel.caption : 'توضیحاتی در کار نیست ...'}</p>
            </div>

            {/* images */}
            <div dir='ltr' className='w-full h-[200px] min-[480px]:h-[300px] lg:h-[450px] grid grid-cols-3 grid-rows-2 gap-1.5 sm:gap-2'>
                {/* big one */}
                <div className='col-span-2 row-span-2 rounded-[4px] rounded-bl-[24px] sm:rounded-bl-[40px] overflow-hidden' >
                    <img src="/images/slider01.png" className='w-full h-full object-cover' alt="" />
                </div>

                <div className=' bg-red-1 rounded-[4px] rounded-tr-[24px] sm:rounded-tr-[40px] overflow-hidden' >
                    <img src="/images/slider02.png" className='w-full h-full object-cover' alt="" />
                </div>
                <div className=' bg-lime-400 rounded-[4px] overflow-hidden' >
                    <img src="/images/slider03.png" className='w-full h-full object-cover' alt="" />
                </div>
            </div>
            {/* why ? */}
            <div className='w-full flex flex-col pr-0 sm:pr-3.5 gap-2.5'>
                <h1 className='text-[#060425] text-base sm:text-[20px] font-bold'>چرا {hotel.title} ؟</h1>
                <p className='text-[#060425] text-sm sm:text-[15px] font-medium leading-7'>چون {hotel.title} خیلی خوب است و از رزروش پشیمون نخواهی شد فقط کافیه تا یه بار این دکمه رو بزنی ...</p>
            </div>
        </div>
    )
}

export default HotelAbout
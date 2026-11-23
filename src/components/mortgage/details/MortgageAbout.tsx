import { BedDouble, Bath, Car, Users, Trees } from 'lucide-react'
import SafeImage from '@/functions/safeImage'
import type { MortgageHouse } from '@/lib/Api/mortgage'

const fa = (n: number) => n.toLocaleString('fa-IR')

const MortgageAbout = ({ house }: { house: MortgageHouse }) => {
    const facts = [
        { icon: BedDouble, label: 'تعداد اتاق', value: fa(house.rooms) },
        { icon: Bath, label: 'سرویس بهداشتی', value: fa(house.bathrooms) },
        { icon: Car, label: 'پارکینگ', value: fa(house.parking) },
        { icon: Users, label: 'ظرفیت', value: `${fa(house.capacity)} نفر` },
    ]
    const yard = house.yard_type && house.yard_type !== 'none' ? house.yard_type : null

    return (
        <div className='w-full flex flex-col mt-8 sm:mt-13 gap-5 sm:gap-8'>
            <h2 className='text-[#10088F] text-sm sm:text-[16px] font-bold'>درباره {house.title}</h2>

            <div className='w-full flex flex-col pr-0 sm:pr-3.5 gap-2.5'>
                <h1 className='text-[#060425] text-base sm:text-[20px] font-bold'>{house.title}</h1>
                <p className='text-[#060425] text-sm sm:text-[15px] font-medium leading-7'>
                    {house.caption ? house.caption : 'توضیحاتی در کار نیست ...'}
                </p>
            </div>

            <div className='w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pr-0 sm:pr-3.5'>
                {facts.map(({ icon: Icon, label, value }) => (
                    <div key={label} className='flex items-center gap-2.5 rounded-[8px] bg-[#F5F5F5D9] px-3 py-2.5 shadow-[0_0_10px_0_#005EA41A]'>
                        <Icon size={24} className='text-[#10088F] shrink-0' />
                        <div className='flex flex-col'>
                            <span className='text-[11px] text-gray-1'>{label}</span>
                            <span className='text-sm font-bold text-[#060425]'>{value}</span>
                        </div>
                    </div>
                ))}
                {yard && (
                    <div className='flex items-center gap-2.5 rounded-[8px] bg-[#F5F5F5D9] px-3 py-2.5 shadow-[0_0_10px_0_#005EA41A]'>
                        <Trees size={24} className='text-[#10088F] shrink-0' />
                        <div className='flex flex-col'>
                            <span className='text-[11px] text-gray-1'>نوع حیاط</span>
                            <span className='text-sm font-bold text-[#060425]'>{yard}</span>
                        </div>
                    </div>
                )}
            </div>

            <div dir='ltr' className='w-full h-[200px] min-[480px]:h-[300px] lg:h-[450px] grid grid-cols-3 grid-rows-2 gap-1.5 sm:gap-2'>
                <div className='col-span-2 row-span-2 rounded-[4px] rounded-bl-[24px] sm:rounded-bl-[40px] overflow-hidden'>
                    <SafeImage src={house.photos?.[0]} className='w-full h-full object-cover' alt={house.title} />
                </div>
                <div className='rounded-[4px] rounded-tr-[24px] sm:rounded-tr-[40px] overflow-hidden'>
                    <SafeImage src={house.photos?.[1]} className='w-full h-full object-cover' alt='' />
                </div>
                <div className='rounded-[4px] overflow-hidden'>
                    <SafeImage src={house.photos?.[2]} className='w-full h-full object-cover' alt='' />
                </div>
            </div>
        </div>
    )
}

export default MortgageAbout

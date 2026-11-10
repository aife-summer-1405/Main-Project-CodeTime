import { Hotel } from '@/lib/Api/house'
import React from 'react'
import {
    Coffee,
    Fence,
    Flame,
    Flower2,
    Landmark,
    MapPin,
    Mountain,
    Sailboat,
    Sofa,
    Sparkles,
    TentTree,
    Trees,
    Umbrella,
    Waves,
    Wifi,
    Wind,
    Eye,
    Building2,
    Home,
    Castle,
    CloudFog,
    Church,
    ChefHat,
    type LucideIcon,
} from 'lucide-react'

interface IProps {
    hotel: Hotel;
}

const TAG_ICONS: Record<string, LucideIcon> = {
    'استخر خصوصی': Waves,
    'نزدیک ساحل': Sailboat,
    'سایبان': Umbrella,
    'بوم‌گردی': Home,
    'بافت تاریخی': Landmark,
    'بادگیر': Wind,
    'صبحانه رایگان': Coffee,
    'کلبه': TentTree,
    'طبیعت‌گردی': Mountain,
    'مه‌آلود': CloudFog,
    'آتش‌گاه': Flame,
    'نزدیک حرم': Church,
    'مناسب زائر': MapPin,
    'تمیز': Sparkles,
    'سنتی': Castle,
    'حیاط مرکزی': Fence,
    'نزدیک میدان نقش جهان': Landmark,
    'نزدیک دریا': Sailboat,
    'استخر': Waves,
    'ویو دریا': Eye,
    'جنگلی': Trees,
    'شومینه': Flame,
    'حیاط بزرگ': Flower2,
    'باربیکیو': ChefHat,
    'مبله': Sofa,
    'مرکز شهر': Building2,
    'اینترنت پرسرعت': Wifi,
}

const DefaultIcon = Sparkles

const HotelTags = ({ hotel }: IProps) => {
    return (
        <div className='w-full flex flex-col gap-[14px] '>
            <h1 className='text-[#10088F] text-sm sm:text-[16px] font-bold'>
                تمامی امکانات رفاهی محبوب هتل ما
            </h1>

            <div className='w-full flex flex-wrap gap-2.5 sm:gap-5 xl:gap-8'>
                {hotel.tags?.map((tag) => {
                    const Icon = TAG_ICONS[tag.trim()] ?? DefaultIcon
                    return (
                        <div
                            key={tag}
                            className='flex cursor-pointer items-center gap-2 sm:gap-3 py-2 px-3 sm:py-2.5 sm:px-4 rounded-[8px] bg-[#F5F5F5D9] hover:shadow-[0_0_10px_0_#005EA41A] transition-shadow duration-500'
                        >
                            <Icon size={30} className='size-6 sm:size-7.5 shrink-0 text-[#10088F]' />
                            <p className='text-xs sm:text-[14px] font-medium text-[#060425]'>{tag}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default HotelTags
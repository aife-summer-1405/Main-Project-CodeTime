import { Bath, Bed, Building2, MapPin, ParkingCircle, TreePine, Users } from 'lucide-react'
import { fa } from '@/lib/format'
import type { WizardForm } from './types'

export default function Step5Review({ form }: { form: WizardForm }) {
    const main = form.images.find((i) => i.id === form.mainImage) ?? form.images[0]
    const price = Number(form.price)
    const discounted = Number(form.discountedPrice)
    const hasDiscount = price > 0 && discounted > 0 && discounted < price
    const discountPercentage = hasDiscount ? Math.round((1 - discounted / price) * 100) : 0

    const features = [
        { icon: Building2, text: form.propertyType },
        { icon: ParkingCircle, text: form.parking && `${fa(Number(form.parking))} پارکینگ` },
        { icon: Bed, text: form.rooms && `${fa(Number(form.rooms))} خواب` },
        { icon: Bath, text: form.bathrooms && `${fa(Number(form.bathrooms))} حمام` },
        { icon: Users, text: form.capacity && `${fa(Number(form.capacity))} نفره` },
        { icon: TreePine, text: form.yard },
    ].filter((f) => f.text)

    const tags = [form.subType, form.propertyType, ...form.tags].filter(Boolean)

    return (
        <article className='relative w-[90%] flex flex-col gap-4 rounded-[32px] bg-[#F5F5F5] p-4 shadow-[0px_0px_8px_0px_#0887CA26] dark:bg-[#121212] md:flex-row'>
            {discountPercentage > 0 && (
                <>
                    <span className='absolute -right-3.5 top-10 z-10 rounded-br-[4px] rounded-tr-[4px] bg-red-500 px-1 py-1 text-xs font-bold text-white'>
                        %{fa(discountPercentage)}
                    </span>
                    <div
                        style={{ clipPath: 'polygon(87% 77%, 0px 100%, 0px 0px)' }}
                        className='absolute -right-4 top-8 z-1 h-3 w-4 bg-red-400 font-bold'
                    />
                </>
            )}

            <div
                className='h-[180px] w-full shrink-0 rounded-[16px] bg-[#DDE3E8] bg-cover bg-center md:h-60 md:w-[30%]'
                style={main ? { backgroundImage: `url(${main.url})` } : undefined}
            />
            <div className='flex min-w-0 flex-1 flex-col gap-3'>
                <h3 className='text-sm font-bold text-[#060425] dark:text-white'>{form.title}</h3>

                <p className='flex items-center gap-1.5 text-[11px] text-[#060425] dark:text-white'>
                    <MapPin size={14} className='shrink-0' />
                    {form.address}
                </p>

                {form.description && <p className='text-[11px] leading-6 text-[#777] dark:text-[#A1A1AA]'>{form.description}</p>}

                <ul className='flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#55536D] dark:text-[#D4D4D8]'>
                    {features.map(({ icon: Icon, text }) => (
                        <li key={text} className='flex items-center gap-1.5'>
                            <Icon size={14} />
                            {text}
                        </li>
                    ))}
                </ul>

                <div className='mt-auto flex flex-wrap items-center justify-between gap-3 pt-2'>
                    <div className='flex flex-wrap gap-2'>
                        {tags.map((tag, i) => (
                            <span key={`${tag}-${i}`} className='rounded-full bg-[#0887CA] px-3 py-1 text-[10px] text-white'>
                                {tag}
                            </span>
                        ))}
                    </div>

                    {price > 0 ? (
                        <div className='flex items-center gap-2'>
                            {hasDiscount && (
                                <span className='text-[11px] text-red-600 line-through '>{fa(price)} تومان</span>
                            )}
                            <strong className='text-xs text-[#0087CA]'>
                                {fa(hasDiscount ? discounted : price)} تومان
                            </strong>
                        </div>
                    ) : (
                        <strong className='text-xs text-[#0087CA]'>—</strong>
                    )}
                </div>
            </div>
        </article>
    )
}
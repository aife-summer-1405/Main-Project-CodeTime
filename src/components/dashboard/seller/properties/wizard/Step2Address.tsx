import { MapPin } from 'lucide-react'
import LocationPicker from './LocationPicker'
import type { StepProps } from './types'

export default function Step2Address({ form, errors, update }: StepProps) {
    const position: [number, number] | null = form.lat !== null && form.lng !== null ? [form.lat, form.lng] : null

    return (
        <div className='grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
            <div className='flex flex-col gap-6'>
                <div>
                    <label
                        className={`relative flex h-14 items-center border-2 rounded-2xl  bg-transparent px-3 ${errors.address ? 'border-[#ED053F]' : 'border-[#15977D]'}`}
                    >
                        <span className='absolute right-3 top-1 text-[12px] text-[#15977D]'>نشانی ملک</span>
                        <input
                            value={form.address}
                            onChange={(e) => update({ address: e.target.value })}
                            placeholder='ساری - دنیای آرزو - پژوهشگاه سپهران'
                            className='h-full w-full bg-transparent pt-3 text-[12px] text-[#15977D] outline-none dark:text-white'
                        />
                        <MapPin size={20} className='shrink-0 text-[#15977D]' />
                    </label>
                    {errors.address && <p className='mt-1 text-[11px] text-[#ED053F]'>{errors.address}</p>}
                </div>

                <p className='text-xs leading-7 text-[#060425] dark:text-white'>
                    با انتخاب موقعیت مکانی ملک خود از روی نقشه، به راحتی{' '}
                    <span className='text-[#0087CA]'>موقعیت ملک</span> را تعیین کنید.
                </p>
            </div>

            <div className='h-[260px] relative z-1 overflow-hidden rounded-[32px] rounded-tr-[4px] rounded-bl-[4px] border-4 border-white shadow-[0_0_12px_#0604252B] dark:border-[#242424] sm:h-[320px]'>
                <LocationPicker value={position} onChange={([lat, lng]) => update({ lat, lng })} />
            </div>
        </div>
    )
}

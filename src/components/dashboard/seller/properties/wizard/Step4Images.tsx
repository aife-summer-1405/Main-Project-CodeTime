'use client'

import { useRef } from 'react'
import { Pencil, Plus, X } from 'lucide-react'
import { fa } from '@/lib/format'
import type { StepProps } from './types'

const MIN_TILES = 4
const MAX_IMAGES = 10

export default function Step4Images({ form, errors, update }: StepProps) {
    const input = useRef<HTMLInputElement>(null)

    const addFiles = (files: FileList | null) => {
        if (!files) return
        const room = MAX_IMAGES - form.images.length
        const added = Array.from(files)
            .filter((file) => file.type.startsWith('image/'))
            .slice(0, room)
            .map((file) => ({ id: `${file.name}-${file.size}-${file.lastModified}`, url: URL.createObjectURL(file), file }))

        if (!added.length) return
        const images = [...form.images, ...added.filter((a) => !form.images.some((i) => i.id === a.id))]
        update({ images, mainImage: form.mainImage ?? images[0].id })
        if (input.current) input.current.value = ''
    }

    const remove = (id: string) => {
        const images = form.images.filter((i) => i.id !== id)
        update({ images, mainImage: form.mainImage === id ? (images[0]?.id ?? null) : form.mainImage })
    }

    const placeholders = Math.max(0, MIN_TILES - 1 - form.images.length)

    return (
        <div className='flex flex-col gap-6'>
            <p className='text-xs text-[#060425] dark:text-white'>
                <span className='font-bold text-[#0087CA]'>یک تصویر بهتر از هزار کلمه</span> با قرار دادن عکس شانس دیده شدن
                ملکتان را ۵ برابر کنید.
            </p>

            <input ref={input} type='file' accept='image/*' multiple hidden onChange={(e) => addFiles(e.target.files)} />

            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                {form.images.map(({ id, url }) => {
                    const main = form.mainImage === id
                    return (
                        <div
                            key={id}
                            className={`relative h-[130px] overflow-hidden rounded-xl bg-cover bg-center ${main ? 'border-2 border-[#05ED6A] shadow-[0_0_8px_#05ED6A66]' : ''}`}
                            style={{ backgroundImage: `url(${url})` }}
                        >
                            <button
                                type='button'
                                aria-label='انتخاب به عنوان تصویر اصلی'
                                title='انتخاب به عنوان تصویر اصلی'
                                onClick={() => update({ mainImage: id })}
                                className='absolute right-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#10088F]'
                            >
                                <Pencil size={12} />
                            </button>
                            <button
                                type='button'
                                aria-label='حذف تصویر'
                                onClick={() => remove(id)}
                                className='absolute left-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#ED053F]'
                            >
                                <X size={12} />
                            </button>
                            {main && (
                                <span className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-1.5 pt-4 text-center text-[11px] font-bold text-white'>
                                    تصویر اصلی
                                </span>
                            )}
                        </div>
                    )
                })}

                {Array.from({ length: placeholders }, (_, i) => (
                    <button
                        key={i}
                        type='button'
                        aria-label='افزودن عکس'
                        onClick={() => input.current?.click()}
                        className='flex h-[130px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#28A5E6] text-[#28A5E6]'
                    >
                        <Plus size={26} />
                    </button>
                ))}

                {form.images.length < MAX_IMAGES && (
                    <button
                        type='button'
                        onClick={() => input.current?.click()}
                        className='flex h-[130px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#0887CA] bg-[#EAF6FA66] text-[#0887CA] dark:bg-transparent'
                    >
                        <Plus size={26} />
                        <span className='text-[11px]'>افزودن عکس</span>
                        <span className='text-[11px] font-bold'>{fa(form.images.length)}</span>
                    </button>
                )}
            </div>

            {errors.images && <p className='text-[11px] text-[#ED053F]'>{errors.images}</p>}
        </div>
    )
}

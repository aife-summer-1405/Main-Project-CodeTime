'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import Field from './Field'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import {
    getUser,
    getUserId,
    updateUser,
    UpdateUserBody,
    uploadPicture,
} from '@/lib/Api/dashboard/common/user'
import Router from 'next/router'

type Avatar = { id: string; url: string }

const defaultAvatars: Avatar[] = [1, 2, 3].map(n => ({ id: `default-${n}`, url: `/images/default-${n}.png` }))

const serverId = 'server'
const maxCustoms = 8

const buttonBase = 'h-11 flex-1 rounded-xl text-sm transition disabled:opacity-60 sm:flex-none sm:px-8'
const arrowBtn =
    'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#0087CA] bg-white text-[#0087CA] transition-all duration-300 active:scale-[0.9] disabled:cursor-default disabled:opacity-40 disabled:active:scale-100 dark:bg-transparent'

const storageKey = (name: string) => `${name}_${getUserId()}`

const cleanupFlag = 'profile_avatars_cleaned_v1'
const cleanupOnce = () => {
    if (localStorage.getItem(cleanupFlag)) return
    Object.keys(localStorage)
        .filter(key => key.startsWith('profile_avatars_') || key.startsWith('profile_avatar_selected_'))
        .forEach(key => localStorage.removeItem(key))
    localStorage.setItem(cleanupFlag, '1')
}

const readCustoms = (): Avatar[] => {
    try {
        return JSON.parse(localStorage.getItem(storageKey('profile_avatars')) ?? '[]')
    } catch {
        return []
    }
}

const saveCustoms = (items: Avatar[]) =>
    localStorage.setItem(storageKey('profile_avatars'), JSON.stringify(items.filter(item => item.id !== serverId)))

const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const image = new Image()
        const objectUrl = URL.createObjectURL(file)
        image.onload = () => {
            const scale = Math.min(1, 400 / Math.max(image.width, image.height))
            const canvas = document.createElement('canvas')
            canvas.width = image.width * scale
            canvas.height = image.height * scale
            canvas.getContext('2d')?.drawImage(image, 0, 0, canvas.width, canvas.height)
            URL.revokeObjectURL(objectUrl)
            resolve(canvas.toDataURL('image/jpeg', 0.85))
        }
        image.onerror = reject
        image.src = objectUrl
    })

const urlToFile = async (url: string) => {
    const blob = await (await fetch(url)).blob()
    return new File([blob], `avatar.${blob.type.split('/')[1] ?? 'png'}`, { type: blob.type })
}

export default function ProfileForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserBody>()
    const [picture, setPicture] = useState<string | null>(null)
    const [customs, setCustoms] = useState<Avatar[]>([])
    const [savedId, setSavedId] = useState(defaultAvatars[0].id)
    const [selectedId, setSelectedId] = useState(defaultAvatars[0].id)
    const [edge, setEdge] = useState({ start: true, end: true })
    const fileRef = useRef<HTMLInputElement>(null)
    const swiperRef = useRef<SwiperType | null>(null)
    const skipRef = useRef(false)

    const avatars = [...customs, ...defaultAvatars].filter((item, index, list) => list.findIndex(other => other.url === item.url) === index)
    const avatarsRef = useRef(avatars)
    avatarsRef.current = avatars
    const selected = avatars.find(item => item.id === selectedId)

    const updateEdge = (swiper: SwiperType) => setEdge({ start: swiper.isBeginning, end: swiper.isEnd })

    const applyPicture = (url: string | null) => {
        const stored = readCustoms()
        const storedId = localStorage.getItem(storageKey('profile_avatar_selected'))
        const knownId = [...stored, ...defaultAvatars].find(item => item.id === storedId)?.id
        const id = knownId ?? (url ? serverId : defaultAvatars[0].id)
        setCustoms(knownId || !url ? stored : [{ id: serverId, url }, ...stored])
        setSavedId(id)
        setSelectedId(id)
    }

    const loadUser = async () => {
        const id = getUserId()
        if (!id) return
        try {
            const user = await getUser(id)
            reset({ firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber })
            setPicture(user.profilePicture ?? null)
            applyPicture(user.profilePicture ?? null)
        } catch (error) {
            toast.error(getErrorMessage(error, 'دریافت اطلاعات کاربر با خطا مواجه شد'))
        }
    }

    useEffect(() => {
        cleanupOnce()
        loadUser()
    }, [])

    useEffect(() => {
        const swiper = swiperRef.current
        const index = avatars.findIndex(item => item.id === selectedId)
        if (!swiper || index < 0 || swiper.activeIndex === index) return
        skipRef.current = true
        swiper.slideTo(index, 400)
    }, [selectedId, customs.length])

    const onSlideChange = (swiper: SwiperType) => {
        updateEdge(swiper)
        if (skipRef.current) {
            skipRef.current = false
            return
        }
        const item = avatarsRef.current[swiper.activeIndex]
        if (item) setSelectedId(item.id)
    }

    const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return
        if (!file.type.startsWith('image/')) return toast.error('فقط فایل تصویری مجاز است')
        if (customs.length >= maxCustoms) return toast.error(`حداکثر ${maxCustoms} عکس می‌توانید اضافه کنید`)
        try {
            const url = await toDataUrl(file)
            const existing = avatars.find(item => item.url === url)
            if (existing) {
                setSelectedId(existing.id)
                return toast.error('این عکس قبلاً اضافه شده است')
            }
            const item = { id: `custom-${crypto.randomUUID()}`, url }
            const next = [item, ...customs]
            saveCustoms(next)
            setCustoms(next)
            setSelectedId(item.id)
        } catch {
            toast.error('افزودن عکس با خطا مواجه شد')
        }
    }

    const removeAvatar = () => {
        if (!selected) return
        if (!selected.id.startsWith('custom-')) return toast.error('این عکس قابل حذف نیست')
        const next = customs.filter(item => item.id !== selected.id)
        saveCustoms(next)
        setCustoms(next)
        setSelectedId(next[0]?.id ?? defaultAvatars[0].id)
    }

    const onSubmit = async (values: UpdateUserBody) => {
        const id = getUserId()
        if (!id) return toast.error('ابتدا وارد حساب کاربری شوید')
        try {
            if (selected && selectedId !== savedId) {
                await uploadPicture(await urlToFile(selected.url))
                localStorage.setItem(storageKey('profile_avatar_selected'), selected.id)
            }
            await updateUser(id, values)
            toast.success('اطلاعات با موفقیت ذخیره شد')
            window.dispatchEvent(new Event('user-updated'))
            await loadUser()
        } catch (error) {
            toast.error(getErrorMessage(error, 'ذخیره اطلاعات با خطا مواجه شد'))
        }
    }

    const onCancel = () => {
        reset()
        applyPicture(picture)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-8 lg:grid-cols-2'>
            <section className='flex min-w-0 flex-col items-center gap-5 lg:items-start'>
                <h2 className='text-sm font-bold text-[#1A1A1A] dark:text-white'>عکس نمایه شما</h2>

                <div className='flex items-center gap-4'>
                    <img src={selected?.url ?? defaultAvatars[0].url} alt='' className='h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32' />
                    <div className='flex items-center gap-2.5'>
                        <button
                            type='button'
                            onClick={() => fileRef.current?.click()}
                            className='cursor-pointer rounded-full border border-dashed border-[#0087CA] px-4 py-2 text-xs text-[#0087CA] transition-all duration-300 active:scale-[0.9]'
                        >
                            تغییر عکس
                        </button>
                        <button
                            type='button'
                            onClick={removeAvatar}
                            className='cursor-pointer text-[#E5484D] transition-all duration-300 active:scale-[0.9]'
                            aria-label='حذف عکس'
                        >
                            <Trash2 size={18} />
                        </button>
                        <input ref={fileRef} type='file' accept='image/*' onChange={onFile} className='hidden' />
                    </div>
                </div>

                <p className='text-xs text-[#55536D] dark:text-[#A1A1AA]'>یا میتونی یکی از عکس های زیر رو انتخاب کنی</p>

                <div className='flex w-[300px] max-w-full items-center gap-2'>
                    <button type='button' onClick={() => swiperRef.current?.slidePrev()} disabled={edge.start} aria-label='قبلی' className={arrowBtn}>
                        <ChevronRight size={16} />
                    </button>

                    <Swiper
                        dir='rtl'
                        className='min-w-0 flex-1'
                        slidesPerView={3}
                        centeredSlides
                        slideToClickedSlide
                        spaceBetween={6}
                        speed={400}
                        onSwiper={swiper => {
                            swiperRef.current = swiper
                            updateEdge(swiper)
                        }}
                        onSlideChange={onSlideChange}
                        onUpdate={updateEdge}
                        onResize={updateEdge}
                    >
                        {avatars.map(item => (
                            <SwiperSlide key={item.id} className='flex! items-center justify-center py-2'>
                                <button
                                    type='button'
                                    aria-label='انتخاب عکس'
                                    className='aspect-square w-full scale-[0.8] cursor-pointer overflow-hidden rounded-full transition-transform duration-300 [.swiper-slide-active_&]:scale-110'
                                >
                                    <img src={item.url} alt='' className='h-full w-full object-cover' />
                                </button>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button type='button' onClick={() => swiperRef.current?.slideNext()} disabled={edge.end} aria-label='بعدی' className={arrowBtn}>
                        <ChevronLeft size={16} />
                    </button>
                </div>
            </section>

            <section className='flex min-w-0 flex-col gap-4'>
                <h2 className='text-sm font-bold text-[#1A1A1A] dark:text-white'>اطلاعات فردی</h2>

                <Field label='نام' autoComplete='given-name' error={errors.firstName?.message} {...register('firstName', { required: 'نام را وارد کنید' })} />
                <Field
                    label='نام خانوادگی'
                    autoComplete='family-name'
                    error={errors.lastName?.message}
                    {...register('lastName', { required: 'نام خانوادگی را وارد کنید' })}
                />
                <Field
                    label='ایمیل'
                    type='email'
                    autoComplete='email'
                    icon={<img className='h-4' src='/images/email.svg' alt='' />}
                    error={errors.email?.message}
                    {...register('email', {
                        required: 'ایمیل را وارد کنید',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'ایمیل معتبر نیست' },
                    })}
                />
                <Field
                    label='شماره موبایل'
                    type='tel'
                    inputMode='tel'
                    autoComplete='tel'
                    dir='rtl'
                    icon={<img className='h-5' src='/images/mobile2.svg' alt='' />}
                    error={errors.phoneNumber?.message}
                    {...register('phoneNumber', {
                        required: 'شماره موبایل را وارد کنید',
                        pattern: { value: /^09\d{9}$/, message: 'شماره موبایل معتبر نیست' },
                    })}
                />

                <div className='mt-2 flex gap-3'>
                    <button
                        type='button'
                        onClick={onCancel}
                        className={`${buttonBase} cursor-pointer border border-[#BDBDBD] text-[#55536D] transition-all duration-300 active:scale-[0.9] dark:border-[#2A2A2A] dark:text-[#A1A1AA]`}
                    >
                        انصراف
                    </button>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className={`${buttonBase} cursor-pointer bg-[#10088F] text-white transition-all duration-300 hover:opacity-90 active:scale-[0.9] dark:bg-[#0087CA]`}
                    >
                        {isSubmitting ? 'در حال ذخیره...' : 'اعمال تغییرات'}
                    </button>
                </div>
            </section>
        </form>
    )
}
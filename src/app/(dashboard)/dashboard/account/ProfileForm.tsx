'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import Field from './Field'
import { getErrorMessage, getUser, getUserId, updateUser, UpdateUserBody, uploadPicture } from '@/lib/dashboard/dashboardApi'

type Picked = { id: string; url: string; file: File }

const defaultAvatar = '/images/avatars/1.png'
const MAX_IMAGES = 8

const buttonBase = 'h-11 flex-1 rounded-xl text-sm transition disabled:opacity-60 sm:flex-none sm:px-8'

export default function ProfileForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserBody>()
    const [avatar, setAvatar] = useState(defaultAvatar)
    const [savedAvatar, setSavedAvatar] = useState(defaultAvatar)
    const [picked, setPicked] = useState<Picked[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const selected = picked.find(item => item.id === selectedId)

    const loadUser = async () => {
        const id = getUserId()
        if (!id) return
        try {
            const user = await getUser(id)
            reset({ firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: user.phoneNumber })
            const picture = user.profilePicture ?? defaultAvatar
            setSavedAvatar(picture)
            setAvatar(picture)
            setSelectedId(null)
        } catch (error) {
            toast.error(getErrorMessage(error, 'دریافت اطلاعات کاربر با خطا مواجه شد'))
        }
    }

    useEffect(() => {
        loadUser()
    }, [])

    const onFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return
        if (!file.type.startsWith('image/')) return toast.error('فقط فایل تصویری مجاز است')
        if (picked.length >= MAX_IMAGES) return toast.error(`حداکثر ${MAX_IMAGES} عکس می‌توانید اضافه کنید`)
        const item = { id: crypto.randomUUID(), url: URL.createObjectURL(file), file }
        setPicked(prev => [item, ...prev])
        setSelectedId(item.id)
        setAvatar(item.url)
        listRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
    }

    const pickAvatar = (item: Picked) => {
        setAvatar(item.url)
        setSelectedId(item.id)
    }

    const resetAvatar = () => {
        setAvatar(savedAvatar)
        setSelectedId(null)
    }

    const scroll = (dir: number) => listRef.current?.scrollBy({ left: dir * 120, behavior: 'smooth' })

    const onSubmit = async (values: UpdateUserBody) => {
        const id = getUserId()
        if (!id) return toast.error('ابتدا وارد حساب کاربری شوید')
        try {
            if (selected) await uploadPicture(selected.file)
            await updateUser(id, values)
            toast.success('اطلاعات با موفقیت ذخیره شد')
            loadUser()
        } catch (error) {
            toast.error(getErrorMessage(error, 'ذخیره اطلاعات با خطا مواجه شد'))
        }
    }

    const onCancel = () => {
        reset()
        resetAvatar()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-8 lg:grid-cols-2'>
            <section className='flex min-w-0 flex-col items-center gap-5 lg:items-start'>
                <h2 className='text-sm font-bold text-[#1A1A1A] dark:text-white'>عکس نمایه شما</h2>

                <div className='flex items-center gap-4'>
                    <img src={avatar} alt='' className='h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32' />
                    <div className='flex flex-col items-center gap-3'>
                        <div className='flex items-center gap-2.5'>
                            <button
                                type='button'
                                onClick={() => fileRef.current?.click()}
                                className='rounded-full border cursor-pointer active:scale-[0.9] transition-all duration-300 border-dashed border-[#0087CA] px-4 py-2 text-xs text-[#0087CA]'
                            >
                                تغییر عکس
                            </button>
                            <button type='button' onClick={resetAvatar} className='cursor-pointer active:scale-[0.9] transition-all duration-300 text-[#E5484D]' aria-label='حذف عکس'>
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <input ref={fileRef} type='file' accept='image/*' onChange={onFile} className='hidden' />
                    </div>
                </div>

                {picked.length > 0 && (
                    <>
                        <p className='text-xs text-[#55536D] dark:text-[#A1A1AA]'>یا میتونی یکی از عکس های زیر رو انتخاب کنی</p>

                        <div className='flex w-full max-w-xs items-center gap-2'>
                            <button
                                type='button'
                                onClick={() => scroll(1)}
                                className='flex cursor-pointer active:scale-[0.9] transition-all duration-300 h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#0887CA66] text-[#0087CA]'
                            >
                                <ChevronRight size={16} />
                            </button>
                            <div ref={listRef} className='flex flex-1 gap-3 overflow-x-auto'>
                                {picked.map(item => (
                                    <button
                                        key={item.id}
                                        type='button'
                                        onClick={() => pickAvatar(item)}
                                        className={`h-14 w-14 cursor-pointer active:scale-[0.9] transition-all duration-300 shrink-0 overflow-hidden rounded-full border-2 ${selectedId === item.id ? 'border-[#0087CA]' : 'border-transparent'}`}
                                    >
                                        <img src={item.url} alt='' className='h-full w-full object-cover' />
                                    </button>
                                ))}
                            </div>
                            <button
                                type='button'
                                onClick={() => scroll(-1)}
                                className='flex cursor-pointer active:scale-[0.9] transition-all duration-300 h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#0887CA66] text-[#0087CA]'
                            >
                                <ChevronLeft size={16} />
                            </button>
                        </div>
                    </>
                )}
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
                        className={`${buttonBase} cursor-pointer active:scale-[0.9] transition-all duration-300 border border-[#BDBDBD] text-[#55536D] dark:border-[#2A2A2A] dark:text-[#A1A1AA]`}
                    >
                        انصراف
                    </button>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className={`${buttonBase} cursor-pointer active:scale-[0.9] transition-all duration-300 bg-[#10088F] text-white hover:opacity-90 dark:bg-[#0087CA]`}
                    >
                        {isSubmitting ? 'در حال ذخیره...' : 'اعمال تغییرات'}
                    </button>
                </div>
            </section>
        </form>
    )
}
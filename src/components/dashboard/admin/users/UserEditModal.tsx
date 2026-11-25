'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { updateAdminUser, type AdminUser, type AdminUserBody } from '@/lib/Api/dashboard/admin/users'
import Modal from '../../components/Modal'
import FieldBox, { fieldInput } from '../FieldBox'

type Props = { user: AdminUser | null; onClose: () => void; onSaved: () => void }

export default function UserEditModal({ user, onClose, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AdminUserBody>()

    useEffect(() => {
        if (!user) return
        reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            emailVerified: user.emailVerified,
        })
    }, [user, reset])

    const onSubmit = async (values: AdminUserBody) => {
        if (!user) return
        try {
            await updateAdminUser(user, values)
            toast.success('اطلاعات کاربر ذخیره شد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, 'ذخیره اطلاعات کاربر با خطا مواجه شد'))
        }
    }

    return (
        <Modal open={!!user} onClose={onClose} title='ویرایش کاربر' className='max-w-sm'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <FieldBox title='نام' error={errors.firstName?.message}>
                    <input className={fieldInput} {...register('firstName', { required: 'نام را وارد کنید' })} />
                </FieldBox>
                <FieldBox title='نام خانوادگی' error={errors.lastName?.message}>
                    <input className={fieldInput} {...register('lastName', { required: 'نام خانوادگی را وارد کنید' })} />
                </FieldBox>
                <FieldBox title='ایمیل' error={errors.email?.message}>
                    <input
                        type='email'
                        dir='ltr'
                        className={`${fieldInput} text-right`}
                        {...register('email', {
                            required: 'ایمیل را وارد کنید',
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'ایمیل معتبر نیست' },
                        })}
                    />
                </FieldBox>
                <FieldBox title='شماره موبایل' error={errors.phoneNumber?.message}>
                    <input
                        type='tel'
                        inputMode='tel'
                        dir='ltr'
                        className={`${fieldInput} text-right`}
                        {...register('phoneNumber', {
                            required: 'شماره موبایل را وارد کنید',
                            pattern: { value: /^0?9\d{9}$/, message: 'شماره موبایل معتبر نیست' },
                        })}
                    />
                </FieldBox>

                <label className='flex cursor-pointer items-center gap-2 px-1 text-xs text-[#060425] dark:text-white'>
                    <input type='checkbox' className='h-4 w-4 accent-[#0087CA]' {...register('emailVerified')} />
                    ایمیل تایید شده است
                </label>

                <div className='mt-2 flex gap-3'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
                    >
                        {isSubmitting ? 'در حال ذخیره ...' : 'ذخیره تغییرات'}
                    </button>
                    <button
                        type='button'
                        onClick={onClose}
                        className='h-10 flex-1 cursor-pointer rounded-xl border border-[#ED053F] text-sm text-[#ED053F] transition active:scale-[0.95]'
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </Modal>
    )
}

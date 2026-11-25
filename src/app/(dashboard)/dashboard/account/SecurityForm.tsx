'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import Field from './Field'
import { changePassword } from '@/lib/Api/dashboard/common/user'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'

type PasswordValues = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

const buttonBase = 'h-11 flex-1 rounded-xl text-sm transition disabled:opacity-60 sm:flex-none sm:px-8'

export default function SecurityForm() {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<PasswordValues>()
    const [visible, setVisible] = useState<Record<string, boolean>>({})

    const toggle = (name: string) => setVisible(prev => ({ ...prev, [name]: !prev[name] }))

    const eye = (name: string) => (
        <button type='button' onClick={() => toggle(name)} aria-label='نمایش رمز عبور' className='text-[#0887CAB2]'>
            {visible[name] ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
    )

    const onSubmit = async ({ currentPassword, newPassword }: PasswordValues) => {
        try {
            await changePassword({ currentPassword, newPassword })
            toast.success('رمز عبور با موفقیت تغییر کرد')
            reset()
        } catch (error) {
            toast.error(getErrorMessage(error, 'تغییر رمز عبور با خطا مواجه شد'))
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex max-w-md flex-col gap-4'>
            <h2 className='text-sm font-bold text-[#1A1A1A] dark:text-white'>تغییر رمز عبور</h2>

            <Field
                label='رمز عبور قبلی'
                type={visible.currentPassword ? 'text' : 'password'}
                autoComplete='current-password'
                icon={eye('currentPassword')}
                error={errors.currentPassword?.message}
                {...register('currentPassword', { required: 'رمز عبور قبلی را وارد کنید' })}
            />
            <Field
                label='رمز عبور جدید'
                type={visible.newPassword ? 'text' : 'password'}
                autoComplete='new-password'
                icon={eye('newPassword')}
                error={errors.newPassword?.message}
                {...register('newPassword', {
                    required: 'رمز عبور جدید را وارد کنید',
                    minLength: { value: 8, message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' },
                })}
            />
            <Field
                label='تکرار رمز عبور جدید'
                type={visible.confirmPassword ? 'text' : 'password'}
                autoComplete='new-password'
                icon={eye('confirmPassword')}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                    required: 'تکرار رمز عبور را وارد کنید',
                    validate: value => value === getValues('newPassword') || 'رمز عبور جدید و تکرار آن یکسان نیستند',
                })}
            />

            <div className='mt-2 flex gap-3'>
                <button
                    type='button'
                    onClick={() => reset()}
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
        </form>
    )
}
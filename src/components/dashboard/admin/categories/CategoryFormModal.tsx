'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { createAdminCategory, updateAdminCategory, type AdminCategory } from '@/lib/Api/dashboard/admin/categories'
import Modal from '../../components/Modal'
import FieldBox, { fieldInput } from '../FieldBox'

type Props = { open: boolean; category: AdminCategory | null; onClose: () => void; onSaved: () => void }

type Values = { name: string }

export default function CategoryFormModal({ open, category, onClose, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ mode: 'onChange' })

    useEffect(() => {
        if (open) reset({ name: category?.name ?? '' })
    }, [open, category, reset])

    const onSubmit = async ({ name }: Values) => {
        try {
            if (category) await updateAdminCategory(category.id, name.trim())
            else await createAdminCategory(name.trim())
            toast.success(category ? 'دسته بندی با موفقیت ویرایش شد' : 'دسته بندی جدید با موفقیت ثبت شد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, category ? 'ویرایش دسته بندی با خطا مواجه شد' : 'ثبت دسته بندی با خطا مواجه شد'))
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={category ? 'ویرایش دسته بندی' : 'افزودن دسته بندی جدید'} className='max-w-sm'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4'>
                <FieldBox title='نام دسته بندی' error={errors.name?.message}>
                    <input
                        className={fieldInput}
                        {...register('name', {
                            required: 'نام دسته بندی را وارد کنید',
                            validate: (value) => value.trim().length >= 2 || 'نام دسته بندی باید حداقل ۲ کاراکتر باشد',
                            maxLength: { value: 50, message: 'نام دسته بندی نباید بیشتر از ۵۰ کاراکتر باشد' },
                        })}
                    />
                </FieldBox>

                <div className='mt-2 flex gap-3'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
                    >
                        {isSubmitting ? 'در حال ذخیره ...' : category ? 'ذخیره تغییرات' : 'ثبت دسته بندی'}
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

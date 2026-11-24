'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { fa } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { updateAdminComment, type AdminComment } from '@/lib/dashboard/adminApi'
import Modal from '../../components/Modal'
import FieldBox, { fieldInput } from '../FieldBox'

type Props = { comment: AdminComment | null; onClose: () => void; onSaved: () => void }

type Values = { caption: string }

const MIN_LENGTH = 2
const MAX_LENGTH = 1000

export default function AdminCommentEditModal({ comment, onClose, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ mode: 'onChange' })

    useEffect(() => {
        if (comment) reset({ caption: comment.caption })
    }, [comment, reset])

    const onSubmit = async ({ caption }: Values) => {
        if (!comment) return
        try {
            await updateAdminComment(comment.id, caption.trim())
            toast.success('نظر با موفقیت ویرایش شد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, 'ویرایش نظر با خطا مواجه شد'))
        }
    }

    return (
        <Modal open={!!comment} onClose={onClose} title='ویرایش نظر' className='max-w-sm'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4'>
                <FieldBox title='متن نظر' error={errors.caption?.message}>
                    <textarea
                        rows={5}
                        className={`${fieldInput} resize-none leading-6`}
                        {...register('caption', {
                            required: 'متن نظر نمی‌تواند خالی باشد',
                            validate: (value) => value.trim().length >= MIN_LENGTH || `متن نظر باید حداقل ${fa(MIN_LENGTH)} کاراکتر باشد`,
                            maxLength: { value: MAX_LENGTH, message: `متن نظر نباید بیشتر از ${fa(MAX_LENGTH)} کاراکتر باشد` },
                        })}
                    />
                </FieldBox>

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

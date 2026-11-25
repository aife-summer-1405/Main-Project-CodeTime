'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import {
    paymentStatusOptions,
    updateAdminPayment,
    type AdminPayment,
    type PaymentStatus,
} from '@/lib/Api/dashboard/admin/payments'
import Modal from '../../components/Modal'
import FilterSelect from '../../common/FilterSelect'
import FieldBox, { fieldInput } from '../FieldBox'

type Props = { payment: AdminPayment | null; onClose: () => void; onSaved: () => void }

type Values = { amount: number; description: string; transactionId: string }

export default function AdminPaymentEditModal({ payment, onClose, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ mode: 'onChange' })
    const [status, setStatus] = useState<PaymentStatus>('pending')

    useEffect(() => {
        if (!payment) return
        reset({ amount: payment.amount, description: payment.description, transactionId: payment.transactionId })
        setStatus(payment.status)
    }, [payment, reset])

    const onSubmit = async (values: Values) => {
        if (!payment) return
        try {
            await updateAdminPayment(payment.id, {
                amount: values.amount,
                status,
                description: values.description.trim(),
                transactionId: values.transactionId.trim(),
            })
            toast.success('پرداخت با موفقیت ویرایش شد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, 'ویرایش پرداخت با خطا مواجه شد'))
        }
    }

    return (
        <Modal open={!!payment} onClose={onClose} title='ویرایش پرداخت' className='max-w-lg'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4'>
                <div className='grid gap-4 sm:grid-cols-2'>
                    <FieldBox title='مبلغ ( تومان )' error={errors.amount?.message}>
                        <input
                            type='number'
                            dir='ltr'
                            className={`${fieldInput} text-right`}
                            {...register('amount', {
                                valueAsNumber: true,
                                required: 'مبلغ را وارد کنید',
                                min: { value: 1, message: 'مبلغ باید بیشتر از صفر باشد' },
                                validate: (value) => Number.isInteger(value) || 'مبلغ باید عدد صحیح باشد',
                            })}
                        />
                    </FieldBox>
                    <FilterSelect
                        label='وضعیت پرداخت'
                        value={status}
                        options={paymentStatusOptions}
                        onChange={(value) => setStatus(value as PaymentStatus)}
                        allowAll={false}
                        className='w-full'
                    />
                </div>

                <FieldBox title='شماره پیگیری' error={errors.transactionId?.message}>
                    <input
                        dir='ltr'
                        className={`${fieldInput} text-right`}
                        {...register('transactionId', {
                            maxLength: { value: 64, message: 'شماره پیگیری نباید بیشتر از ۶۴ کاراکتر باشد' },
                        })}
                    />
                </FieldBox>

                <FieldBox title='توضیحات' error={errors.description?.message}>
                    <textarea
                        rows={3}
                        className={`${fieldInput} resize-none leading-6`}
                        {...register('description', {
                            required: 'توضیحات را وارد کنید',
                            validate: (value) => value.trim().length >= 3 || 'توضیحات باید حداقل ۳ کاراکتر باشد',
                            maxLength: { value: 200, message: 'توضیحات نباید بیشتر از ۲۰۰ کاراکتر باشد' },
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

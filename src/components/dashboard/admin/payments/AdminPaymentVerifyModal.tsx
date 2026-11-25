'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { toFaDigits } from '@/lib/format'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { verifyAdminPayment, type AdminPayment } from '@/lib/Api/dashboard/admin/payments'
import Modal from '../../components/Modal'
import FieldBox, { fieldInput } from '../FieldBox'
import { toman } from './paymentColumns'

type Props = { payment: AdminPayment | null; onClose: () => void; onVerified: () => void }

type Values = { token: string }

export default function AdminPaymentVerifyModal({ payment, onClose, onVerified }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ mode: 'onChange' })

    useEffect(() => {
        if (payment) reset({ token: payment.transactionId })
    }, [payment, reset])

    const onSubmit = async ({ token }: Values) => {
        if (!payment) return
        try {
            await verifyAdminPayment(payment.id, token.trim())
            toast.success('پرداخت با موفقیت تایید شد')
            onVerified()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, 'تایید پرداخت انجام نشد'))
        }
    }

    return (
        <Modal open={!!payment} onClose={onClose} title='تایید پرداخت' className='max-w-sm'>
            {payment && (
                <p className='mb-4 text-xs leading-6 text-[#55536D] dark:text-[#A1A1AA]'>
                    {`پرداخت ${toFaDigits(payment.id)} به مبلغ ${toman(payment.amount)}`}
                </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4'>
                <FieldBox title='توکن پرداخت' error={errors.token?.message}>
                    <input
                        dir='ltr'
                        className={`${fieldInput} text-right`}
                        {...register('token', {
                            required: 'توکن پرداخت را وارد کنید',
                            validate: (value) => value.trim().length > 0 || 'توکن پرداخت را وارد کنید',
                            maxLength: { value: 128, message: 'توکن پرداخت نباید بیشتر از ۱۲۸ کاراکتر باشد' },
                        })}
                    />
                </FieldBox>

                <div className='mt-2 flex gap-3'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
                    >
                        {isSubmitting ? 'در حال تایید ...' : 'تایید پرداخت'}
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

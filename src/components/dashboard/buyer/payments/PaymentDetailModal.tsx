'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import Modal from '../../components/Modal'
import { fa } from '@/lib/format'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getPaymentById, type Payment } from '@/lib/Api/dashboard/buyer/payments'

type Props = { paymentId: string | null; onClose: () => void }

const statusLabels: Record<string, string> = {
    pending: 'در انتظار پرداخت',
    completed: 'تایید شده',
    success: 'تایید شده',
    paid: 'تایید شده',
    failed: 'ناموفق',
    cancelled: 'لغو شده',
    canceled: 'لغو شده',
}

const formatDateTime = (iso: string | null) =>
    iso
        ? `${new Date(iso).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' })} - ${new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`
        : '—'

export default function PaymentDetailsModal({ paymentId, onClose }: Props) {
    const [payment, setPayment] = useState<Payment | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!paymentId) return
        let active = true
        setPayment(null)
        setLoading(true)
        getPaymentById(paymentId)
            .then((data) => active && setPayment(data))
            .catch((e) => {
                if (!active) return
                toast.error(getErrorMessage(e, 'خطا در دریافت جزئیات پرداخت'))
                onClose()
            })
            .finally(() => active && setLoading(false))
        return () => {
            active = false
        }
    }, [paymentId, onClose])

    const rows = payment
        ? [
            { label: 'مبلغ', value: `${fa(Number(payment.amount))} تومان`, strong: true },
            { label: 'وضعیت پرداخت', value: statusLabels[payment.status] ?? payment.status },
            { label: 'شماره پیگیری', value: payment.transactionId ?? '—' },
            { label: 'شناسه پرداخت', value: fa(Number(payment.id)) },
            { label: 'شناسه رزرو', value: payment.bookingId ? fa(payment.bookingId) : '—' },
            { label: 'تاریخ ایجاد', value: formatDateTime(payment.createdAt) },
            { label: 'توضیحات', value: payment.description || '—' },
        ]
        : []

    return (
        <Modal open={!!paymentId} onClose={onClose} title='جزئیات پرداخت' className='max-w-sm'>
            <div className='flex flex-col gap-3'>
                {loading &&
                    Array.from({ length: 5 }, (_, i) => <div key={i} className='h-11 animate-pulse rounded-xl bg-[#E9EEF1] dark:bg-[#1C1C1C]' />)}

                {rows.map(({ label, value, strong }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}
                        className='flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 text-xs shadow-[0px_0px_6px_0px_#0887CA1A] dark:bg-[#1C1C1C]'
                    >
                        <span className='shrink-0 text-[#8A8997]'>{label}</span>
                        <strong className={`text-left ${strong ? 'text-[#0087CA]' : 'text-[#060425] dark:text-white'}`}>{value}</strong>
                    </motion.div>
                ))}
            </div>
        </Modal>
    )
}
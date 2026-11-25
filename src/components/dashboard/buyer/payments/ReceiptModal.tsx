import Modal from '../../components/Modal'
import { fa } from '@/lib/format'
import type { Payment } from '@/lib/Api/dashboard/buyer/payments'

type Props = { payment: Payment | null; onClose: () => void }

const Row = ({ label, value }: { label: string; value: string }) => (
    <div className='flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 text-xs shadow-[0px_0px_6px_0px_#0887CA1A] dark:bg-[#1C1C1C]'>
        <span className='text-[#8A8997]'>{label}</span>
        <strong className='text-[#060425] dark:text-white'>{value}</strong>
    </div>
)

export default function ReceiptModal({ payment, onClose }: Props) {
    return (
        <Modal open={!!payment} onClose={onClose} title='رسید پرداخت' className='max-w-sm'>
            {payment && (
                <div className='flex flex-col gap-3'>
                    <Row label='مبلغ' value={`${fa(Number(payment.amount))} تومان`} />
                    <Row label='شماره پیگیری' value={payment.transactionId ?? '—'} />
                    <Row label='توضیحات' value={payment.description || '—'} />
                    <Row label='شناسه پرداخت' value={fa(Number(payment.id))} />
                </div>
            )}
        </Modal>
    )
}

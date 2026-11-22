import Modal from "./Modal"

export type Transaction = {
    id: string
    date: string
    time: string
    trackingCode: string
    amount: number
}

type Props = {
    open: boolean
    onClose: () => void
    transactions?: Transaction[]
    loading?: boolean
    onViewReceipt?: (transaction: Transaction) => void
}

export const sampleTransactions: Transaction[] = Array.from({ length: 4 }, (_, i) => ({
    id: String(i + 1),
    date: '۱۲ مرداد ۱۴۰۴',
    time: '۱۲:۳۳',
    trackingCode: '۱۲۳۴۵۶۷۸۹۱۲۳۴۵۶',
    amount: 125000000,
}))

const row = 'grid grid-cols-[1.2fr_0.8fr_1.6fr_1.2fr_1fr] items-center gap-2 px-4 text-center text-[11px]'

export default function TransactionsModal({ open, onClose, transactions = sampleTransactions, loading, onViewReceipt }: Props) {
    return (
        <Modal open={open} onClose={onClose} title='لیست تراکنش ها' className='max-w-3xl'>
            <div className='overflow-x-auto'>
                <div className='flex min-w-[580px] flex-col gap-3'>
                    <div className={`${row} rounded-xl bg-[#E4F0F5] py-3 text-[#55536D] dark:bg-[#1C1C1C] dark:text-[#A1A1AA]`}>
                        <span>تاریخ</span>
                        <span>زمان</span>
                        <span>شماره پیگیری</span>
                        <span>مبلغ</span>
                        <span />
                    </div>

                    {loading &&
                        Array.from({ length: 3 }, (_, i) => (
                            <div key={i} className='h-[52px] animate-pulse rounded-xl bg-[#E9EEF1] dark:bg-[#1C1C1C]' />
                        ))}

                    {!loading && transactions.length === 0 && (
                        <p className='py-8 text-center text-xs text-[#8A8997]'>تراکنشی یافت نشد</p>
                    )}

                    {!loading && transactions.map(tx => (
                        <div
                            key={tx.id}
                            className={`${row} rounded-xl border border-[#DCEEF4] bg-white py-4 text-[#060425] shadow-[0px_0px_6px_0px_#0887CA1A] dark:border-[#2A2A2A] dark:bg-[#1C1C1C] dark:text-white`}
                        >
                            <span>{tx.date}</span>
                            <span>{tx.time}</span>
                            <span>{tx.trackingCode}</span>
                            <strong className='text-[#10088F] dark:text-[#38A9E0]'>{tx.amount.toLocaleString('fa-IR')}</strong>
                            <button
                                type='button'
                                onClick={() => onViewReceipt?.(tx)}
                                className='cursor-pointer text-[#0087CA] transition-all duration-300 active:scale-[0.9]'
                            >
                                مشاهده رسید
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    )
}
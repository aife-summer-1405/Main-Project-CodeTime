'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fa, faDate, faTime } from '@/lib/format'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getFinanceDashboard, type FinanceDashboard } from '@/lib/Api/dashboard/seller/finance'
import { getSellerTransactions, toSellerTransaction, type FinanceTransaction } from '@/lib/Api/dashboard/seller/finance'
import { toReceiptPayment } from '@/lib/dashboard/seller-data'
import type { Payment } from '@/lib/Api/dashboard/buyer/payments'
import { FinanceSkeleton } from '@/components/skeletons/DashboardSkeletons'
import PageTitle from '../../common/PageTitle'
import ListToolbar from '../../common/ListToolbar'
import FilterSelect from '../../common/FilterSelect'
import DataList, { type Column } from '../../common/DataList'
import Pagination from '../../common/Pagination'
import ReceiptModal from '../../buyer/payments/ReceiptModal'
import StatusIcon from '../StatusIcon'

const PAGE_SIZE = 10
const NO_INFO = 'اطلاعاتی وجود ندارد'

const typeOptions = [
    { label: 'شارژ کیف پول', value: 'wallet' },
    { label: 'رزرو', value: 'booking' },
]

const statusOptions = [
    { label: 'موفق', value: 'paid' },
    { label: 'در انتظار', value: 'pending' },
    { label: 'ناموفق', value: 'failed' },
]

const statusKind = { paid: 'success', pending: 'pending', failed: 'cancel' } as const

const validDate = (v?: string | null) => !!v && !Number.isNaN(new Date(v).getTime())

function PinIcon({ size = 21, className }: { size?: number; className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox='0 0 21 21'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
            aria-hidden='true'
        >
            <path
                d='M5.75 14.2728L0.75 19.2728M1.03284 8.55567L11.4672 18.99C11.5837 19.1065 11.7833 19.04 11.8066 18.8769L12.6557 12.9328C12.7169 12.5044 12.9154 12.1074 13.2214 11.8014L15.3583 9.66454C15.6146 9.40823 15.9358 9.22639 16.2874 9.13847L18.8933 8.48701C19.2703 8.39275 19.4004 7.9232 19.1256 7.64839L12.3744 0.897271C12.0996 0.622456 11.6301 0.752514 11.5358 1.12956L10.8844 3.7354C10.7964 4.08707 10.6146 4.40823 10.3583 4.66454L8.2214 6.80142C7.91541 7.10742 7.51842 7.30591 7.09003 7.36711L1.14598 8.21626C0.982827 8.23957 0.916305 8.43913 1.03284 8.55567Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
            />
        </svg>
    )
}

export default function FinanceOverview() {
    const [dashboard, setDashboard] = useState<FinanceDashboard | null>(null)
    const [dashboardLoading, setDashboardLoading] = useState(true)
    const [items, setItems] = useState<FinanceTransaction[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [listLoading, setListLoading] = useState(true)
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [page, setPage] = useState(1)
    const [receipt, setReceipt] = useState<Payment | null>(null)

    useEffect(() => {
        getFinanceDashboard()
            .then(setDashboard)
            .catch((e) => toast.error(getErrorMessage(e, 'خطا در دریافت اطلاعات مالی')))
            .finally(() => setDashboardLoading(false))
    }, [])

    useEffect(() => {
        let cancelled = false
        setListLoading(true)
        getSellerTransactions(page, PAGE_SIZE, { paymentStatus: status, transactionType: type })
            .then((res) => {
                if (cancelled) return
                setItems(res.items)
                setTotalCount(res.totalCount)
            })
            .catch((e) => {
                if (!cancelled) toast.error(getErrorMessage(e, 'خطا در دریافت تراکنش ها'))
            })
            .finally(() => {
                if (!cancelled) setListLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [page, status, type])

    if (dashboardLoading && listLoading) return <FinanceSkeleton />

    const pages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

    const summaryCards: { label: string; value: number | null }[] = [
        { label: 'موجودی قابل برداشت', value: null },
        { label: 'درآمد ماه جاری', value: dashboard?.totalCurrentMonthAmount ?? 0 },
        { label: 'درآمد ماه قبل', value: dashboard?.totalPerviousMonthAmount ?? 0 },
        { label: 'درآمد کل', value: dashboard?.totalAmount ?? 0 },
    ]

    const columns: Column<FinanceTransaction>[] = [
        {
            key: 'date',
            header: 'تاریخ',
            width: '1.2fr',
            render: (t) => <span>{validDate(t.date) ? faDate(t.date) : NO_INFO}</span>,
        },
        {
            key: 'time',
            header: 'زمان',
            width: '0.7fr',
            render: (t) => <span>{validDate(t.date) ? faTime(t.date) : NO_INFO}</span>,
        },
        {
            key: 'code',
            header: 'شماره پیگیری',
            width: '1.4fr',
            render: (t) => <span>{t.trackingCode ? fa(Number(t.trackingCode)) : NO_INFO}</span>,
        },
        {
            key: 'amount',
            header: 'مبلغ',
            width: '1.1fr',
            render: (t) => <span className='font-bold text-[#0087CA]'>{fa(t.amount)} تومان</span>,
        },
        {
            key: 'status',
            header: 'وضعیت پرداخت',
            width: '0.9fr',
            render: (t) => <StatusIcon kind={statusKind[t.status]} />,
        },
        {
            key: 'type',
            header: 'نوع تراکنش',
            width: '1fr',
            render: (t) => <span>{t.type === 'wallet' ? 'شارژ کیف پول' : 'رزرو'}</span>,
        },
        {
            key: 'receipt',
            header: '',
            width: '0.9fr',
            render: (t) => (
                <button
                    type='button'
                    onClick={() =>
                        setReceipt(
                            toReceiptPayment(
                                toSellerTransaction(t),
                                t.description || (t.type === 'wallet' ? 'شارژ کیف پول' : 'رزرو اقامتگاه')
                            )
                        )
                    }
                    className='cursor-pointer text-[11px] text-[#0087CA] underline'
                >
                    مشاهده رسید
                </button>
            ),
        },
    ]

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت مالی</PageTitle>

            <div className='mx-1.5 grid grid-cols-2 gap-3 lg:grid-cols-4'>
                {summaryCards.map(({ label, value }) => (
                    <div
                        key={label}
                        className='flex items-center gap-3 rounded-3xl border border-[#0887CA1A] bg-[#F5F5F5] px-4 py-4 shadow-[0px_0px_4px_0px_#005EA433] dark:border-white/10 dark:bg-[#121212]'
                    >
                        <span className='flex h-6 w-6 shrink-0 items-center justify-center'>
                            <PinIcon className='text-[#060425]/80 dark:text-white/80' />
                        </span>

                        <div className='flex min-w-0 flex-1 flex-col items-center gap-1.5 text-center'>
                            <span className='text-xs text-[#060425] dark:text-white'>{label}</span>
                            {dashboardLoading ? (
                                <div className='h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700' />
                            ) : value === null ? (
                                <span className='text-[11px] text-[#8A8997]'>{NO_INFO}</span>
                            ) : (
                                <strong className='text-sm font-bold text-[#005EA4] dark:text-[#005EA4]'>
                                    {fa(value)} تومان
                                </strong>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <ListToolbar title='لیست تراکنش های مشتریان' count={totalCount}>
                <FilterSelect
                    label='نوع تراکنش'
                    value={type}
                    options={typeOptions}
                    onChange={(v) => {
                        setType(v)
                        setPage(1)
                    }}
                />
                <FilterSelect
                    label='وضعیت پرداخت'
                    value={status}
                    options={statusOptions}
                    onChange={(v) => {
                        setStatus(v)
                        setPage(1)
                    }}
                />
            </ListToolbar>

            <DataList
                columns={columns}
                rows={items}
                rowKey={(t) => t.id}
                loading={listLoading}
                emptyText='تراکنشی یافت نشد'
            />

            <Pagination page={Math.min(page, pages)} total={pages} onChange={setPage} />

            <ReceiptModal payment={receipt} onClose={() => setReceipt(null)} />
        </div>
    )
}
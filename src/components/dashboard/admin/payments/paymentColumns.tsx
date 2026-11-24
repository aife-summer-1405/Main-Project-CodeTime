import { fa, faDate, toFaDigits } from '@/lib/format'
import type { AdminPayment, AdminUser } from '@/lib/dashboard/adminApi'
import type { Column } from '../../common/DataList'
import StatusIcon from '../../seller/StatusIcon'
import UserCell from '../UserCell'
import type { UserMap } from './useUsers'

export const statusKind = { completed: 'success', pending: 'pending', failed: 'cancel' } as const

export const toman = (amount: number) => `${fa(amount)} تومان`

export function PaymentUser({ id, user }: { id: string; user: AdminUser | null | undefined }) {
    if (user) return <UserCell user={user} />
    if (user === undefined) return <span className='h-4 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
    return <span className='opacity-70'>{`کاربر ${toFaDigits(id)}`}</span>
}

export const paymentColumns = (users: UserMap): Column<AdminPayment>[] => [
    { key: 'id', header: 'کد پرداخت', width: '0.7fr', render: (p) => <span>{toFaDigits(p.id)}</span> },
    { key: 'user', header: 'کاربر', width: '1.5fr', render: (p) => <PaymentUser id={p.userId} user={users[p.userId]} /> },
    { key: 'amount', header: 'مبلغ', width: '1.3fr', render: (p) => <span className='font-bold text-[#0087CA]'>{toman(p.amount)}</span> },
    {
        key: 'description',
        header: 'بابت',
        width: '2fr',
        render: (p) => (
            <span title={p.description} className='block truncate'>
                {p.description || '—'}
            </span>
        ),
    },
    { key: 'booking', header: 'کد رزرو', width: '0.7fr', render: (p) => <span>{p.bookingId ? toFaDigits(p.bookingId) : '—'}</span> },
    { key: 'date', header: 'تاریخ', width: '1fr', render: (p) => <span>{faDate(p.createdAt)}</span> },
    { key: 'status', header: 'وضعیت', width: '0.7fr', render: (p) => <StatusIcon kind={statusKind[p.status]} /> },
]

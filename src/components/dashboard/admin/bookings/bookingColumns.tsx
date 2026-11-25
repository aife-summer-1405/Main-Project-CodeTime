import { faDate, faTime, toFaDigits } from '@/lib/format'
import type { AdminBooking } from '@/lib/Api/dashboard/admin/bookings'
import type { Column } from '../../common/DataList'
import StatusIcon from '../../seller/StatusIcon'

const statusKind = { confirmed: 'success', pending: 'pending', canceled: 'cancel' } as const

const stay = ({ reservedDates }: AdminBooking) => {
    const from = reservedDates[0]
    const to = reservedDates[reservedDates.length - 1]
    return from && to ? `${faDate(from)} تا ${faDate(to)}` : '—'
}

const traveler = ({ travelers }: AdminBooking) => {
    const [first] = travelers
    if (!first) return '—'
    const name = `${first.firstName} ${first.lastName}`.trim() || '—'
    return travelers.length > 1 ? `${name} ، +${toFaDigits(travelers.length - 1)} نفر` : name
}

export const bookingColumns: Column<AdminBooking>[] = [
    { key: 'id', header: 'کد رزرو', width: '0.7fr', render: (b) => <span>{toFaDigits(b.id)}</span> },
    { key: 'house', header: 'شناسه ملک', width: '0.8fr', render: (b) => <span>{toFaDigits(b.houseId)}</span> },
    { key: 'traveler', header: 'مسافر', width: '1.6fr', render: (b) => <span className='block truncate'>{traveler(b)}</span> },
    { key: 'stay', header: 'تاریخ اقامت', width: '2fr', render: (b) => <span className='block truncate'>{stay(b)}</span> },
    {
        key: 'createdAt',
        header: 'زمان ثبت',
        width: '1.3fr',
        render: (b) => (
            <span>
                {faDate(b.createdAt)} - {faTime(b.createdAt)}
            </span>
        ),
    },
    { key: 'status', header: 'وضعیت', width: '0.7fr', render: (b) => <StatusIcon kind={statusKind[b.status]} /> },
]

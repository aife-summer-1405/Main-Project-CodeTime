'use client'

import { CalendarDays, Clock, Tag } from 'lucide-react'
import { faDate, faTime, toFaDigits } from '@/lib/format'
import type { AdminUser } from '@/lib/Api/dashboard/admin/users'
import type { AdminNotification } from '@/lib/Api/dashboard/admin/notifications'
import Modal from '../../components/Modal'
import { PaymentUser } from '../payments/paymentColumns'
import { notificationTypeLabel } from './notificationType'

type Props = {
    notification: AdminNotification | null
    user: AdminUser | null | undefined
    onClose: () => void
}

const card = 'flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'

export default function AdminNotificationDetailModal({ notification, user, onClose }: Props) {
    return (
        <Modal open={!!notification} onClose={onClose} title='جزئیات اعلان' className='max-w-lg'>
            {notification && (
                <div className='flex flex-col gap-4'>
                    <div className={card}>
                        <h3 className='text-sm font-bold leading-7 text-[#060425] dark:text-white'>{notification.title || '—'}</h3>
                        <div className='flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#55536D] dark:text-[#A1A1AA]'>
                            <span className='flex items-center gap-1.5'>
                                <Tag size={14} className='text-[#0087CA]' />
                                {notificationTypeLabel(notification.type)}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <CalendarDays size={14} className='text-[#0087CA]' />
                                {faDate(notification.createdAt)}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <Clock size={14} className='text-[#0087CA]' />
                                {faTime(notification.createdAt)}
                            </span>
                        </div>
                    </div>

                    <div className={card}>
                        <span className='text-[10px] text-[#8A8997]'>گیرنده</span>
                        <div className='text-xs text-[#060425] dark:text-white'>
                            <PaymentUser id={notification.userId} user={user} />
                        </div>
                    </div>

                    <div className={card}>
                        <span className='text-[10px] text-[#8A8997]'>متن اعلان</span>
                        <p className='whitespace-pre-line text-xs leading-7 text-[#060425] dark:text-white'>{notification.message || '—'}</p>
                    </div>

                    <div className='flex flex-wrap items-center gap-3 text-[11px]'>
                        <span
                            className={`rounded-full px-3 py-1 ${notification.isRead ? 'bg-[#E6F6EC] text-[#12A150] dark:bg-[#1C1C1C]' : 'bg-[#FFF3E0] text-[#FF6B00] dark:bg-[#1C1C1C]'}`}
                        >
                            {notification.isRead ? 'خوانده شده' : 'خوانده نشده'}
                        </span>
                        {notification.offerId && <span className='text-[#8A8997]'>کد پیشنهاد: {toFaDigits(notification.offerId)}</span>}
                    </div>
                </div>
            )}
        </Modal>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { getAdminContactMessage, type AdminContactMessage } from '@/lib/Api/dashboard/admin/contact'
import Modal from '../../components/Modal'

type Props = { message: AdminContactMessage | null; onClose: () => void }

const NO_INFO = 'اطلاعاتی وجود ندارد'

export default function AdminContactDetailModal({ message, onClose }: Props) {
    const [full, setFull] = useState<AdminContactMessage | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setFull(message)
        if (!message) return

        let active = true
        setLoading(true)

        getAdminContactMessage(message.id)
            .then((found) => active && setFull(found))
            .catch((e) => active && toast.error(getErrorMessage(e, 'خطا در دریافت جزئیات پیام')))
            .finally(() => active && setLoading(false))

        return () => {
            active = false
        }
    }, [message])

    const data = full ?? message

    return (
        <Modal open={!!message} onClose={onClose} title='جزئیات پیام' className='max-w-lg'>
            {data && (
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'>
                        {data.senderName || data.senderEmail ? (
                            <>
                                <span className='flex items-center gap-2 text-xs font-bold text-[#060425] dark:text-white'>
                                    <User size={15} className='shrink-0 text-[#0087CA]' />
                                    {data.senderName || NO_INFO}
                                </span>
                                <span className='flex items-center gap-2 text-[11px] text-[#55536D] dark:text-[#A1A1AA]'>
                                    <Mail size={15} className='shrink-0 text-[#0087CA]' />
                                    <span dir='ltr' className='truncate'>
                                        {data.senderEmail || NO_INFO}
                                    </span>
                                </span>
                            </>
                        ) : (
                            <span className='text-xs font-bold text-[#060425] dark:text-white'>{data.title || NO_INFO}</span>
                        )}
                    </div>

                    <div className='flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'>
                        <span className='text-[10px] text-[#8A8997]'>متن پیام</span>
                        {loading ? (
                            <div className='flex flex-col gap-2'>
                                <span className='h-4 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                                <span className='h-4 w-2/3 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700' />
                            </div>
                        ) : (
                            <p className='whitespace-pre-wrap break-words text-xs leading-7 text-[#060425] dark:text-white'>{data.message || NO_INFO}</p>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    )
}

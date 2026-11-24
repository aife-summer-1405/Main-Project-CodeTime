'use client'

import Link from 'next/link'
import { CalendarDays, Clock, ExternalLink, Tag } from 'lucide-react'
import { faDate, toFaDigits } from '@/lib/format'
import type { AdminBlog, AdminUser } from '@/lib/dashboard/adminApi'
import Modal from '../../components/Modal'
import { PaymentUser } from '../payments/paymentColumns'

type Props = {
    blog: AdminBlog | null
    categoryLabel: string
    author: AdminUser | null | undefined
    onClose: () => void
}

const card = 'flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-[0px_0px_6px_0px_#0887CA33] dark:bg-[#121212]'

export default function AdminBlogDetailModal({ blog, categoryLabel, author, onClose }: Props) {
    return (
        <Modal open={!!blog} onClose={onClose} title='جزئیات مقاله' className='max-w-lg'>
            {blog && (
                <div className='flex flex-col gap-4'>
                    <div className={card}>
                        <h3 className='text-sm font-bold leading-7 text-[#060425] dark:text-white'>{blog.title}</h3>
                        <div className='flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#55536D] dark:text-[#A1A1AA]'>
                            <span className='flex items-center gap-1.5'>
                                <Tag size={14} className='text-[#0087CA]' />
                                {categoryLabel || '—'}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <Clock size={14} className='text-[#0087CA]' />
                                {blog.readingTime ? toFaDigits(blog.readingTime) : '—'}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <CalendarDays size={14} className='text-[#0087CA]' />
                                {faDate(blog.createdAt)}
                            </span>
                        </div>
                    </div>

                    <div className={card}>
                        <span className='text-[10px] text-[#8A8997]'>نویسنده</span>
                        <div className='text-xs text-[#060425] dark:text-white'>
                            <PaymentUser id={blog.authorId} user={author} />
                        </div>
                    </div>

                    <div className={card}>
                        <span className='text-[10px] text-[#8A8997]'>خلاصه مقاله</span>
                        <p className='whitespace-pre-line text-xs leading-7 text-[#060425] dark:text-white'>{blog.caption || '—'}</p>
                    </div>

                    <Link
                        href={`/blog/${blog.id}`}
                        target='_blank'
                        className='flex h-10 items-center justify-center gap-2 rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] dark:bg-[#0087CA]'
                    >
                        مشاهده 
                        <ExternalLink size={15} />
                    </Link>
                </div>
            )}
        </Modal>
    )
}

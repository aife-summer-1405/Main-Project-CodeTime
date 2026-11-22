import Link from 'next/link'
import { ArrowUpLeft, CalendarDays, Clock } from 'lucide-react'
import { faDate, toFaDigits } from '@/lib/format'
import type { Blog } from '@/lib/Api/blog'

type Props = {
    blog: Blog
    categoryName?: string
}

export default function BlogCard({ blog, categoryName }: Props) {
    return (
        <Link
            href={`/blog/${blog.id}`}
            className='group relative flex h-full min-w-0 flex-col gap-4 overflow-hidden rounded-[24px] border border-[#0887CA33] bg-linear-to-br from-white via-[#0887CA0D] to-[#0887CA26] p-4 shadow-[0_0_6px_0_#0887CA40] transition hover:border-[#005EA4] hover:shadow-[0_0_12px_0_#0887CA66] dark:border-white/10 dark:from-[#1B1B1B] dark:via-[#0887CA0F] dark:to-[#0887CA2E] sm:rounded-[32px] sm:p-6'
        >
            <span
                aria-hidden='true'
                className='pointer-events-none absolute -left-10 -top-10 size-36 rounded-full bg-[#0887CA]/15 transition duration-500 group-hover:scale-110'
            />
            <span
                aria-hidden='true'
                className='pointer-events-none absolute -bottom-14 right-6 size-32 rounded-full bg-[#28A5E6]/15 transition duration-500 group-hover:scale-110'
            />
            <span
                aria-hidden='true'
                className='pointer-events-none absolute bottom-24 left-6 size-10 rounded-full bg-[#10088F]/10 dark:bg-[#28A5E6]/10'
            />
            <span
                aria-hidden='true'
                className='pointer-events-none absolute right-1/3 top-16 size-6 rounded-full bg-[#0887CA]/15'
            />

            <div className='relative flex min-h-7 items-center justify-between gap-3'>
                {categoryName ? (
                    <span className='truncate rounded-[8px] bg-[#0887CA1A] px-2.5 py-1 text-xs font-medium text-[#0887CA]'>
                        {categoryName}
                    </span>
                ) : (
                    <span />
                )}
                <ArrowUpLeft
                    size={20}
                    className='shrink-0 text-[#0887CA] transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5'
                />
            </div>

            <div className='relative flex flex-col gap-2'>
                <h2 className='line-clamp-2 text-base font-bold leading-7 text-[#060425] dark:text-white-1'>
                    {blog.title}
                </h2>
                <p className='line-clamp-3 text-sm leading-7 text-[#060425]/70 dark:text-white-1/70'>
                    {blog.caption}
                </p>
            </div>

            <div className='relative mt-auto flex flex-col gap-3'>
                <i className='w-full border-t border-[#0887CA33]' />

                <div className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-[#060425]/70 dark:text-white-1/70'>
                    <span className='flex items-center gap-1.5'>
                        <Clock size={16} />
                        {toFaDigits(blog.estimated_reading_time)}
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <CalendarDays size={16} />
                        {faDate(blog.created_at)}
                    </span>
                </div>

                <span className='flex h-9 w-full items-center justify-center rounded-[12px] border border-[#0887CA] text-sm font-medium text-[#0887CA] transition group-hover:bg-[#0887CA] group-hover:text-white group-active:scale-[0.97]'>
                    ادامه مطلب
                </span>
            </div>
        </Link>
    )
}
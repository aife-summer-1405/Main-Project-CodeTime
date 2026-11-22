import Link from 'next/link'
import { CalendarDays, ChevronLeft, Clock } from 'lucide-react'
import { faDate, toFaDigits } from '@/lib/format'
import type { Blog } from '@/lib/Api/blog'

type Props = { blogs: Blog[] }

export default function RelatedBlogs({ blogs }: Props) {
    if (blogs.length === 0) return null

    return (
        <div className='w-full rounded-[16px] border border-transparent bg-[#F5F5F5D9] p-4 shadow-[0_0_10px_0_#005EA41A] dark:border-white/10 dark:bg-[#1B1B1B] sm:p-6'>
            <h2 className='text-center text-base font-bold text-[#10088F] dark:text-blue-4'>مقالات مشابه</h2>
            <div className='mb-4 mt-4 w-full border-t border-[#0887CA66]' />

            <div className='flex flex-col gap-3'>
                {blogs.map((blog) => (
                    <Link
                        key={blog.id}
                        href={`/blog/${blog.id}`}
                        className='flex flex-col gap-2 rounded-[12px] border border-[#0887CA1A] p-3 transition hover:-translate-y-0.5 hover:border-[#0887CA66]'
                    >
                        <h3 className='line-clamp-2 text-sm font-bold leading-6 text-[#060425] dark:text-white-1'>{blog.title}</h3>
                        <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#060425]/70 dark:text-white-1/70'>
                            <span className='flex items-center gap-1.5'>
                                <Clock size={14} />
                                {toFaDigits(blog.estimated_reading_time)}
                            </span>
                            <span className='flex items-center gap-1.5'>
                                <CalendarDays size={14} />
                                {faDate(blog.created_at)}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <Link href='/blog' className='mt-4 flex w-fit items-center gap-1 text-sm text-[#0887CA] underline'>
                مشاهده تمامی مقالات
                <ChevronLeft size={16} />
            </Link>
        </div>
    )
}

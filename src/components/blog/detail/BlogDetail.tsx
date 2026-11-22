import Link from 'next/link'
import { CalendarDays, Clock } from 'lucide-react'
import { faDate, toFaDigits } from '@/lib/format'
import type { Blog } from '@/lib/Api/blog'
import BlogAuthorCard from './BlogAuthorCard'
import CopyLinkButton from './CopyLinkButton'
import RelatedBlogs from './RelatedBlogs'

interface IProps {
    blog: Blog
    categoryName: string
    related: Blog[]
}

const BlogDetail = ({ blog, categoryName, related }: IProps) => (
    <div className='mx-auto w-full max-w-[1920px] px-4 pb-12 pt-4 sm:px-6 lg:px-10 xl:px-24'>
        <div className='flex gap-1.5 text-xs font-semibold text-[#060425]/60 dark:text-white-1/60 sm:gap-2.5 sm:text-sm'>
            <Link className='whitespace-nowrap' href='/'>
                خانه /
            </Link>
            <Link className='whitespace-nowrap' href='/blog'>
                وبلاگ /
            </Link>
            <p className='min-w-0 truncate text-[#10088F] dark:text-blue-4' title={blog.title}>
                {blog.title}
            </p>
        </div>

        <div className='mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
            <article className='min-w-0 flex-1 rounded-[16px] border border-transparent bg-[#F5F5F5D9] p-4 shadow-[0_0_10px_0_#005EA41A] dark:border-white/10 dark:bg-[#1B1B1B] sm:p-8'>
                <div className='flex items-center justify-between gap-3'>
                    {categoryName ? (
                        <span className='truncate rounded-[8px] bg-[#0887CA1A] px-3 py-1.5 text-xs font-medium text-[#0887CA] sm:text-sm'>
                            {categoryName}
                        </span>
                    ) : (
                        <span />
                    )}
                    <CopyLinkButton />
                </div>

                <h1 className='mt-5 text-xl font-bold leading-9 text-[#060425] dark:text-white-1 sm:text-2xl sm:leading-10 lg:text-[28px] lg:leading-[3rem]'>
                    {blog.title}
                </h1>

                <ul className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#060425]/70 dark:text-white-1/70 sm:text-sm'>
                    <li className='flex items-center gap-1.5'>
                        <Clock size={16} />
                        {toFaDigits(blog.estimated_reading_time)}
                    </li>
                    <li className='flex items-center gap-1.5'>
                        <CalendarDays size={16} />
                        {faDate(blog.created_at)}
                    </li>
                </ul>

                <div className='my-6 w-full border-t border-[#0887CA33] sm:my-8' />

                <h2 className='text-sm font-bold text-[#10088F] dark:text-blue-4 sm:text-base'>خلاصه مقاله</h2>
                <p className='mt-4 border-r-4 border-[#0887CA] pr-4 text-sm font-medium leading-8 text-[#060425] dark:text-white-1 sm:text-[15px] sm:leading-9'>
                    {blog.caption}
                </p>
            </article>

            <aside className='flex w-full shrink-0 flex-col gap-6 lg:w-80 xl:w-96'>
                <BlogAuthorCard authorId={blog.author_id} />

                <div
                    style={{ backgroundImage: 'linear-gradient(to bottom right, #10088F, #0887CA)' }}
                    className='flex flex-col gap-3 rounded-[16px] p-5 text-white shadow-[0_0_10px_0_#005EA41A]'
                >
                    <h3 className='text-base font-bold leading-7'>خانه یا ویلای مناسبت رو پیدا کن</h3>
                    <p className='text-xs leading-6 text-white/85'>از بین اقامتگاه‌های موجود همین حالا رزرو کن.</p>
                    <Link
                        href='/reserve'
                        className='flex h-10 items-center justify-center rounded-[12px] bg-white text-sm font-bold text-[#10088F] transition active:scale-[0.97]'
                    >
                        رزرو سریع
                    </Link>
                </div>

                <RelatedBlogs blogs={related} />
            </aside>
        </div>
    </div>
)

export default BlogDetail

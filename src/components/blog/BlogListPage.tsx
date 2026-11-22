'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, SearchX } from 'lucide-react'
import Pagination from '@/components/dashboard/common/Pagination'
import { categoryLabel, SORT_OPTIONS } from '@/lib/Api/blog'
import { fa } from '@/lib/format'
import { useBlogCategories, useBlogs } from './hooks/useBlogs'
import BlogCard from './BlogCard'
import { BlogCardSkeleton } from './BlogSkeletons'

const LIMIT = 9

const base = 'cursor-pointer whitespace-nowrap border text-sm transition active:scale-[0.97]'
const on = 'border-[#0887CA] bg-[#0887CA] text-white'
const off = 'border-[#0887CA] text-[#0887CA] dark:border-blue-4 dark:text-blue-4'

export default function BlogListPage() {
    const router = useRouter()
    const pathname = usePathname()
    const sp = useSearchParams()

    const query = sp.get('q') ?? ''
    const category = sp.get('category') ?? ''
    const sortParam = sp.get('sort')
    const sort = SORT_OPTIONS.find((o) => o.value === sortParam)?.value ?? SORT_OPTIONS[0].value
    const page = Math.max(1, Number(sp.get('page')) || 1)

    const [text, setText] = useState(query)

    const update = useCallback(
        (patch: Record<string, string | undefined>) => {
            const next = new URLSearchParams(sp.toString())
            Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)))
            const s = next.toString()
            router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false })
        },
        [sp, router, pathname]
    )

    useEffect(() => {
        if (text.trim() === query) return
        const t = setTimeout(() => update({ q: text.trim() || undefined, page: undefined }), 400)
        return () => clearTimeout(t)
    }, [text, query, update])

    const categories = useBlogCategories()
    const labels = useMemo(
        () => Object.fromEntries(categories.map((c) => [c.id, categoryLabel(c.name)])),
        [categories]
    )

    const { blogs, total, loading, error } = useBlogs({
        page,
        limit: LIMIT,
        title: query,
        categoryId: category,
        sort,
    })

    const totalPages = Math.ceil(total / LIMIT)

    const changePage = (p: number) => {
        update({ page: p === 1 ? undefined : String(p) })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const resetAll = () => {
        setText('')
        router.replace(pathname, { scroll: false })
    }

    return (
        <div className='mx-auto flex w-full max-w-[1920px] flex-col gap-5 px-4 pb-12 pt-4 sm:gap-6 sm:px-6 lg:px-10 xl:px-24'>
            <div className='flex gap-2.5 text-xs font-semibold text-[#060425]/60 dark:text-white-1/60 sm:text-sm'>
                <Link className='whitespace-nowrap' href='/'>
                    خانه /
                </Link>
                <p className='text-[#10088F] dark:text-blue-4'>وبلاگ</p>
            </div>

            <section
                style={{ backgroundImage: 'linear-gradient(to left, #10088F, #005EA4, #0887CA)' }}
                className='relative flex flex-col gap-2 overflow-hidden rounded-[4px] rounded-bl-[32px] rounded-tr-[32px] px-5 py-8 text-white sm:gap-3 sm:rounded-bl-[40px] sm:rounded-tr-[40px] sm:px-12 sm:py-12'
            >
                <span className='absolute -left-10 -top-16 size-48 rounded-full bg-white/10' />
                <span className='absolute -bottom-20 left-1/3 size-40 rounded-full bg-white/10' />
                <h1 className='relative text-2xl font-bold sm:text-4xl'>وبلاگ</h1>
                <p className='relative max-w-xl text-sm leading-7 text-white/85 sm:text-base sm:leading-8'>
                    راهنمای رزرو، رهن و اجاره، نکات حقوقی و سفر؛ هرچه قبل از انتخاب خانه‌ات باید بدانی.
                </p>
            </section>

            <div className='flex flex-col gap-3 lg:flex-row lg:items-center'>
                <div className='flex h-12 min-w-0 items-center rounded-[16px] border border-[#0887CA] pl-2 pr-3 text-[#0887CA] dark:border-blue-4 dark:text-blue-4 lg:flex-1'>
                    <input
                        type='text'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='جستجو در عنوان مقالات ...'
                        className='h-full w-full min-w-0 bg-transparent pl-2.5 text-sm outline-none placeholder:text-[#0887CA]/70'
                    />
                    <Search size={20} className='shrink-0' />
                </div>

                <div className='grid grid-cols-2 gap-2 lg:flex'>
                    {SORT_OPTIONS.map((o) => (
                        <button
                            key={o.value}
                            type='button'
                            onClick={() => update({ sort: o.value === SORT_OPTIONS[0].value ? undefined : o.value, page: undefined })}
                            className={`${base} h-12 rounded-[16px] px-5 ${sort === o.value ? on : off}`}
                        >
                            {o.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className='-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden'>
                <button
                    type='button'
                    onClick={() => update({ category: undefined, page: undefined })}
                    className={`${base} shrink-0 rounded-[12px] px-4 py-2 ${category === '' ? on : off}`}
                >
                    همه
                </button>
                {categories.map((c) => (
                    <button
                        key={c.id}
                        type='button'
                        onClick={() => update({ category: c.id, page: undefined })}
                        className={`${base} shrink-0 rounded-[12px] px-4 py-2 ${category === c.id ? on : off}`}
                    >
                        {categoryLabel(c.name)}
                    </button>
                ))}
            </div>

            {!loading && !error && total > 0 && (
                <p className='text-sm text-[#060425]/70 dark:text-white-1/70'>{fa(total)} مقاله</p>
            )}

            {(loading || blogs.length > 0) && (
                <div aria-busy={loading} className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3'>
                    {loading
                        ? Array.from({ length: 6 }, (_, i) => <BlogCardSkeleton key={i} />)
                        : blogs.map((blog) => (
                              <BlogCard key={blog.id} blog={blog} categoryName={labels[blog.category_id]} />
                          ))}
                </div>
            )}

            {!loading && error && <p className='py-16 text-center text-sm text-red-500'>{error}</p>}

            {!loading && !error && blogs.length === 0 && (
                <div className='flex flex-col items-center gap-3 py-16 text-sm text-[#060425]/70 dark:text-white-1/70'>
                    <SearchX size={36} />
                    <p>مقاله‌ای با این مشخصات پیدا نشد.</p>
                    <button
                        type='button'
                        onClick={resetAll}
                        className='cursor-pointer rounded-[12px] border border-[#0887CA] px-4 py-2 text-[#0887CA] transition active:scale-[0.97] dark:border-blue-4 dark:text-blue-4'
                    >
                        پاک کردن فیلترها
                    </button>
                </div>
            )}

            {!loading && !error && <Pagination page={page} total={totalPages} onChange={changePage} />}
        </div>
    )
}

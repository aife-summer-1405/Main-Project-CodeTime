import type { ReactNode } from 'react'
import { fa } from '@/lib/format'

type Props = {
    title: string
    count: number
    query?: string
    onQueryChange?: (value: string) => void
    searchPlaceholder?: string
    onFilterClick?: () => void
    filterCount?: number
    children?: ReactNode
}

export default function ListToolbar({ title, count, query = '', onQueryChange, searchPlaceholder = 'نام ملک مورد نظر ...', onFilterClick, filterCount = 0, children }: Props) {
    return (
        <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-2'>
                <p className='text-[14px] font-medium text-[#060425CC] dark:text-white'>{title}</p>
                <span className='text-[14px] font-medium text-[#999]'>( {fa(count)} )</span>
            </div>

            <div className='flex min-w-0 flex-wrap items-center gap-3'>
                {children}

                {onQueryChange && (
                    <div className='flex h-12 min-w-0 items-center rounded-2xl border border-blue-4 px-2.5 text-sm text-blue-4 lg:w-80'>
                        <input
                            type='text'
                            value={query}
                            onChange={(e) => onQueryChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className='h-full w-full min-w-0 bg-transparent pl-2.5 outline-none'
                        />
                        <img src='/images/search.svg' className='h-5' alt='' />
                    </div>
                )}

                {onFilterClick && (
                    <button
                        type='button'
                        onClick={onFilterClick}
                        className='relative flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-blue-4 px-3.5 py-3.5 transition active:scale-[0.9]'
                    >
                        <img src='/images/filter.svg' className='h-5' alt='' />
                        <span className='whitespace-nowrap text-sm text-blue-4'>فیلتر های بیشتر</span>
                        {filterCount > 0 && (
                            <span className='absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#10088F] text-[10px] text-white'>{fa(filterCount)}</span>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

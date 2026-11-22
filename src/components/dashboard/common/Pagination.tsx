import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fa } from '@/lib/format'

type Props = { page: number; total: number; onChange: (page: number) => void }

const getPages = (page: number, total: number) => {
    const set = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total))
    const sorted = [...set].sort((a, b) => a - b)
    const result: (number | '...')[] = []
    sorted.forEach((p, i) => {
        if (i > 0 && p - sorted[i - 1] > 1) result.push('...')
        result.push(p)
    })
    return result
}

const base = 'flex h-9 w-9 items-center justify-center rounded-full border border-[#CFE4EC] text-xs transition dark:border-[#2A2A2A]'

export default function Pagination({ page, total, onChange }: Props) {
    if (total <= 1) return null

    return (
        <nav dir='ltr' className='flex items-center justify-center gap-2 py-2'>
            <button type='button' disabled={page === 1} onClick={() => onChange(page - 1)} className={`${base} cursor-pointer text-[#10088F] disabled:cursor-default disabled:opacity-40`}>
                <ChevronLeft size={16} />
            </button>

            {getPages(page, total).map((p, i) =>
                p === '...' ? (
                    <span key={`dots-${i}`} className={`${base} text-[#8A8997]`}>
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        type='button'
                        onClick={() => onChange(p)}
                        className={`${base} cursor-pointer ${p === page ? 'border-[#10088F] bg-[#10088F] text-white' : 'text-[#060425] dark:text-white'}`}
                    >
                        {fa(p)}
                    </button>
                )
            )}

            <button type='button' disabled={page === total} onClick={() => onChange(page + 1)} className={`${base} cursor-pointer text-[#10088F] disabled:cursor-default disabled:opacity-40`}>
                <ChevronRight size={16} />
            </button>
        </nav>
    )
}

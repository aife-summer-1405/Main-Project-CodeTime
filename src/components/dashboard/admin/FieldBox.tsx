import type { ReactNode } from 'react'

const box = 'relative flex flex-col rounded-2xl border border-[#28A5E6] px-3 pb-2 pt-5 text-xs text-[#060425] dark:text-white'
const label = 'absolute right-3 top-1.5 text-[9px] text-[#8A8997]'

export const fieldInput = 'w-full bg-transparent text-xs font-bold text-[#060425] outline-none dark:text-white'

export default function FieldBox({ title, error, children }: { title: string; error?: string; children: ReactNode }) {
    return (
        <div className='flex min-w-0 flex-col gap-1'>
            <label className={box}>
                <span className={label}>{title}</span>
                {children}
            </label>
            {error && <p className='px-1 text-[11px] text-red-500'>{error}</p>}
        </div>
    )
}

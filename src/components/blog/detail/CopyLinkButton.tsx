'use client'
import { Link2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CopyLinkButton() {
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast.success('لینک صفحه کپی شد')
        } catch {
            toast.error('کپی لینک انجام نشد')
        }
    }

    return (
        <button
            type='button'
            onClick={copy}
            aria-label='کپی لینک صفحه'
            className='flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-[12px] border border-[#0887CA] px-3 text-sm font-medium text-[#0887CA] transition hover:bg-[#0887CA] hover:text-white active:scale-[0.97] dark:border-blue-4 dark:text-blue-4 dark:hover:text-white'
        >
            <Link2 size={16} />
            <span className='hidden sm:inline'>کپی لینک</span>
        </button>
    )
}

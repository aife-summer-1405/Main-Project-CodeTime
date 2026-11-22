import type { ReactNode } from 'react'
import Modal from '../components/Modal'

type Props = {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    note?: string
    icon?: ReactNode
    loading?: boolean
    confirmText?: string
    cancelText?: string
    confirmClassName?: string
}

const defaultConfirm = 'bg-[#10088F] dark:bg-[#0087CA]'

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title,
    message,
    note,
    icon,
    loading,
    confirmText = 'بله',
    cancelText = 'انصراف',
    confirmClassName = defaultConfirm,
}: Props) {
    return (
        <Modal open={open} onClose={onClose} className='max-w-sm'>
            <div className='flex flex-col items-center gap-3 py-2 text-center'>
                {icon}
                <h3 className='text-sm font-bold text-[#0087CA]'>{title}</h3>
                <p className='text-xs font-bold text-[#0069A6] dark:text-[#38A9E0]'>{message}</p>
                {note && <p className='text-[11px] text-[#55536D] dark:text-[#A1A1AA]'>{note}</p>}

                <div className='mt-3 flex w-full gap-3'>
                    <button
                        type='button'
                        disabled={loading}
                        onClick={onConfirm}
                        className={`h-10 flex-1 cursor-pointer rounded-xl text-sm text-white transition active:scale-[0.9] disabled:opacity-60 ${confirmClassName}`}
                    >
                        {loading ? '...' : confirmText}
                    </button>
                    <button
                        type='button'
                        onClick={onClose}
                        className='h-10 flex-1 cursor-pointer rounded-xl border border-[#BDBDBD] text-sm text-[#55536D] transition active:scale-[0.9] dark:border-[#2A2A2A] dark:text-[#A1A1AA]'
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

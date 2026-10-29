import { SearchX } from 'lucide-react'

type Props = { onReset: () => void }

export default function EmptyState({ onReset }: Props) {
    return (
        <div className='flex flex-col items-center gap-3 py-16 text-gray-1 text-sm'>
            <SearchX size={36} />
            <p>هتلی با این فیلترها پیدا نشد.</p>
            <button
                type='button'
                onClick={onReset}
                className='text-blue-4 border border-blue-4 rounded-[12px] px-4 py-2 cursor-pointer active:scale-[0.97] transition'
            >
                پاک کردن فیلترها
            </button>
        </div>
    )
}
import { X } from 'lucide-react'
import { fa } from '@/lib/format'

export type Chip = { key: string; label: string; onRemove: () => void }

type Props = { chips: Chip[]; onClear: () => void }

export default function RentActiveFilters({ chips, onClear }: Props) {
    if (chips.length === 0) return null

    return (
        <div className='flex flex-wrap items-center gap-2'>
            {chips.map((chip) => (
                <button
                    key={chip.key}
                    type='button'
                    onClick={chip.onRemove}
                    aria-label={`حذف فیلتر ${chip.label}`}
                    className='flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-blue-3 px-4 text-xs text-blue-3 transition hover:bg-blue-3/10 active:scale-[0.97] dark:border-blue-4 dark:text-blue-4'
                >
                    {chip.label}
                    <X size={14} />
                </button>
            ))}
            <button
                type='button'
                onClick={onClear}
                className='cursor-pointer px-2 text-xs text-black-2/50 transition hover:text-red-1 dark:text-white-1/50'
            >
                پاک کردن فیلتر ها ({fa(chips.length)})
            </button>
        </div>
    )
}

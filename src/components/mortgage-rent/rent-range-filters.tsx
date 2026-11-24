'use client'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import Dropdown from './dropdown'
import { NONE_LABEL, RANGE_GROUPS, type RangeGroup, type RangeKey } from './constants'

type Props = {
    values: Record<RangeKey, string>
    onChange: (key: RangeKey, value: string) => void
}

type FieldProps = {
    title: string
    group: RangeGroup
    value: string
    bound: string
    kind: 'min' | 'max'
    onChange: (value: string) => void
}

const Field = ({ title, group, value, bound, kind, onChange }: FieldProps) => {
    const boundNumber = Number(bound) || 0
    const options = [
        { value: '', label: NONE_LABEL },
        ...group.values.map((v) => ({
            value: String(v),
            label: group.format(v),
            disabled: boundNumber > 0 && (kind === 'min' ? v > boundNumber : v < boundNumber),
        })),
    ]

    return (
        <Dropdown
            ariaLabel={title}
            options={options}
            value={value}
            onChange={onChange}
            className='w-28 sm:w-32'
            triggerClassName='flex w-full flex-col items-start gap-1.5 text-start'
            trigger={({ open, selected }) => (
                <>
                    <span className='flex items-center gap-1 text-xs text-black-2 dark:text-white-1'>
                        {title}
                        <ChevronDown size={16} className={cn('transition', open && 'rotate-180')} />
                    </span>
                    <span
                        className={cn(
                            'text-xs',
                            value && selected ? 'font-medium text-blue-1 dark:text-blue-4' : 'text-black-2/40 dark:text-white-1/40'
                        )}
                    >
                        {value && selected ? selected.label : group.empty}
                    </span>
                </>
            )}
        />
    )
}

export default function RentRangeFilters({ values, onChange }: Props) {
    return (
        <div className='grid grid-cols-1 border-y border-blue-3/20 py-4 md:grid-cols-3 dark:border-blue-4/20'>
            {RANGE_GROUPS.map((group, i) => (
                <div
                    key={group.id}
                    className={cn(
                        'flex items-start justify-center gap-4 sm:gap-6',
                        i > 0 && 'mt-4 border-t border-blue-3/20 pt-4 md:mt-0 md:border-s md:border-t-0 md:pt-0 dark:border-blue-4/20'
                    )}
                >
                    <Field
                        title={group.minTitle}
                        group={group}
                        kind='min'
                        value={values[group.minKey]}
                        bound={values[group.maxKey]}
                        onChange={(v) => onChange(group.minKey, v)}
                    />
                    <span aria-hidden='true' className='pt-0.5 text-xl font-bold leading-none text-black-2/20 dark:text-white-1/20'>
                        _
                    </span>
                    <Field
                        title={group.maxTitle}
                        group={group}
                        kind='max'
                        value={values[group.maxKey]}
                        bound={values[group.minKey]}
                        onChange={(v) => onChange(group.maxKey, v)}
                    />
                </div>
            ))}
        </div>
    )
}

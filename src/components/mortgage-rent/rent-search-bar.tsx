'use client'
import { ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import Dropdown, { type DropdownOption } from './dropdown'
import { NONE_LABEL, SORT_OPTIONS, TYPE_OPTIONS } from './constants'

type Props = {
    text: string
    onText: (value: string) => void
    sort: string
    location: string
    type: string
    locationOptions: string[]
    onChange: (key: 'sort' | 'location' | 'type', value: string) => void
}

const none: DropdownOption = { value: '', label: NONE_LABEL }

type BoxProps = {
    title: string
    options: DropdownOption[]
    value: string
    onChange: (value: string) => void
}

const BoxSelect = ({ title, options, value, onChange }: BoxProps) => {
    const list = options.some((o) => o.value === value) || !value ? options : [...options, { value, label: value }]
    return (
        <Dropdown
            ariaLabel={title}
            options={[none, ...list]}
            value={value}
            onChange={onChange}
            className='w-full lg:w-52'
            triggerClassName='flex h-12 w-full items-center justify-between gap-2 rounded-[8px] border border-blue-3/70 bg-transparent px-4 text-sm dark:border-blue-4/70'
            trigger={({ open, selected }) => {
                const chosen = value && selected
                return (
                    <>
                        <span className={cn('truncate', chosen ? 'font-medium text-blue-3 dark:text-blue-4' : 'text-blue-3/70 dark:text-blue-4/70')}>
                            {chosen ? selected.label : title}
                        </span>
                        <ChevronDown size={20} className={cn('shrink-0 text-blue-3 transition dark:text-blue-4', open && 'rotate-180')} />
                    </>
                )
            }}
        />
    )
}

export default function RentSearchBar({ text, onText, sort, location, type, locationOptions, onChange }: Props) {
    return (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:items-center'>
            <label className='relative flex h-12 min-w-0 items-center sm:col-span-2 lg:flex-1'>
                <span className='sr-only'>جستجو</span>
                <input
                    type='text'
                    value={text}
                    onChange={(e) => onText(e.target.value)}
                    placeholder='نام ملک مورد نظر ...'
                    className='h-full w-full rounded-[8px] border border-blue-3/70 bg-transparent pe-4 ps-12 text-sm text-blue-3 outline-none transition placeholder:text-blue-3/70 focus:border-blue-3 dark:border-blue-4/70 dark:text-blue-4 dark:placeholder:text-blue-4/70 dark:focus:border-blue-4'
                />
                <Search size={20} className='pointer-events-none absolute start-4 text-blue-3/70 dark:text-blue-4/70' />
            </label>

            <BoxSelect title='مرتب سازی بر اساس ...' options={SORT_OPTIONS} value={sort} onChange={(v) => onChange('sort', v)} />
            <BoxSelect
                title='محل مورد نظر ...'
                options={locationOptions.map((name) => ({ value: name, label: name }))}
                value={location}
                onChange={(v) => onChange('location', v)}
            />
            <BoxSelect title='نوع معامله' options={TYPE_OPTIONS} value={type} onChange={(v) => onChange('type', v)} />
        </div>
    )
}

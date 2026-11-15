'use client'
import { forwardRef, useEffect, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { Check, ChevronDown } from 'lucide-react'

const box =
    'relative w-full h-14 rounded-[16px] border-2 border-[#0887CAB2] bg-transparent pr-3.5 pl-11 outline-none transition-colors duration-200 dark:bg-white-1 dark:text-black-1'

const Wrapper = ({ error, children }: { error?: string; children: ReactNode }) => (
    <div className='w-full min-w-0'>
        {children}
        {error && <p className='mt-1.5 text-[12px] text-red-500'>{error}</p>}
    </div>
)

const Shell = ({ label, text, icon }: { label: string; text: string; icon: ReactNode }) => (
    <>
        <span
            className={`pointer-events-none absolute right-4 px-1 text-[#0887CAB2] transition-all duration-200 ${text ? 'top-[10px] -translate-y-1/2 text-xs' : 'top-[18px] -translate-y-1/6'
                }`}
        >
            {label}
        </span>
        <span className='block pt-3 text-sm text-[#060425] dark:text-black-1'>{text}</span>
        <span className='absolute left-[15px] top-[18px] text-[#0887CAB2]'>{icon}</span>
    </>
)

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    id: string
    label: string
    icon?: ReactNode
    error?: string
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ id, label, icon, error, ...props }, ref) => (
    <Wrapper error={error}>
        <div className='relative w-full'>
            <input
                ref={ref}
                id={id}
                {...props}
                dir='rtl'
                placeholder=' '
                className={`${box} peer px-4 pt-3 pb-1 `}
            />
            {icon && <span className='absolute left-[15px] top-[18px] text-[#0887CAB2]'>{icon}</span>}
            <label
                htmlFor={id}
                className='absolute right-4 top-[18px] -translate-y-1/6 cursor-text px-1 text-[#0887CAB2] transition-all duration-200
                peer-focus:top-[10px] peer-focus:translate-y-[-50%] peer-focus:text-xs
                peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:text-xs'
            >
                {label}
            </label>
        </div>
    </Wrapper>
))
TextField.displayName = 'TextField'

interface SelectFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    error?: string
}

export const SelectField = ({ label, value, onChange, options, error }: SelectFieldProps) => (
    <Wrapper error={error}>
        <Listbox value={value} onChange={onChange}>
            <div className='relative'>
                <ListboxButton className={`${box} flex cursor-pointer items-center text-right`}>
                    {({ open }) => (
                        <Shell
                            label={label}
                            text={options.find((o) => o.value === value)?.label ?? ''}
                            icon={
                                <ChevronDown
                                    size={20}
                                    className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                                />
                            }
                        />
                    )}
                </ListboxButton>

                <ListboxOptions
                    transition
                    className='absolute inset-x-0 top-full z-20 mt-2 origin-top rounded-xl border border-[#EEF0F4] bg-white p-1.5 shadow-[0_8px_24px_0_#005EA426] outline-none transition duration-300 data-[closed]:-translate-y-2 data-[closed]:scale-95 data-[closed]:opacity-0'
                >
                    {options.map((o) => (
                        <ListboxOption
                            key={o.value}
                            value={o.value}
                            className='group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm text-[#060425] transition-colors data-[focus]:bg-[#F5F5F5] data-[selected]:bg-[#009B77]/10 data-[selected]:font-bold data-[selected]:text-[#009B77]'
                        >
                            {o.label}
                            <Check size={16} className='hidden group-data-[selected]:block' />
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    </Wrapper>
)

interface DateFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    icon: ReactNode
    error?: string
}

export const DateField = ({ label, value, onChange, icon, error }: DateFieldProps) => {
    const [today, setToday] = useState<Date>()

    useEffect(() => {
        setToday(new Date())
    }, [])

    return (
        <Wrapper error={error}>
            <DatePicker
                value={value}
                format='YYYY/MM/DD'
                calendar={persian}
                locale={persian_fa}
                maxDate={today}
                calendarPosition='bottom-center'
                className='teal'
                containerStyle={{ width: '100%' }}
                onChange={(date: DateObject | DateObject[] | null) => {
                    const picked = Array.isArray(date) ? date[0] : date
                    onChange(picked ? picked.format('YYYY/MM/DD') : '')
                }}
                render={(_: unknown, openCalendar: () => void) => (
                    <button type='button' onClick={openCalendar} className={`${box} flex cursor-pointer items-center text-right`}>
                        <Shell label={label} text={value} icon={icon} />
                    </button>
                )}
            />
        </Wrapper>
    )
}
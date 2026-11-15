import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string
    icon?: ReactNode
    error?: string
}

const Field = forwardRef<HTMLInputElement, Props>(({ label, icon, error, id, ...props }, ref) => {
    const inputId = id ?? props.name

    return (
        <div className='w-full'>
            <div className='relative w-full cursor-pointer'>
                <input
                    ref={ref}
                    id={inputId}
                    placeholder=' '
                    {...props}
                    className='peer relative h-14 w-full rounded-[16px] border-2 border-[#0887CAB2] bg-transparent px-4 pb-1 pl-11 pr-3.5 pt-3 outline-none dark:bg-white-1 dark:text-black-1'
                />
                {icon && <span className='absolute left-[15px] top-[20px] flex h-4 items-center'>{icon}</span>}
                <label
                    htmlFor={inputId}
                    className='absolute right-4 top-[18px] -translate-y-1/6 cursor-text px-1 text-[#0887CAB2] transition-all duration-200 
                    peer-focus:top-[10px] peer-focus:translate-y-[-50%] peer-focus:text-xs
                    peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:text-xs'
                >
                    {label}
                </label>
            </div>
            {error && <p className='mt-1.5 text-[12px] text-red-500'>{error}</p>}
        </div>
    )
})

Field.displayName = 'Field'

export default Field
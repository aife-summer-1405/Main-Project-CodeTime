import { Fragment } from 'react'
import { BuildingIcon, CardIcon, ConfirmIcon, TicketIcon, UserIcon } from './StepsIcons'

const steps = [
    { label: 'هتل', Icon: BuildingIcon },
    { label: 'مسافران', Icon: UserIcon },
    { label: 'تایید', Icon: ConfirmIcon },
    { label: 'پرداخت', Icon: CardIcon },
    { label: 'بلیط', Icon: TicketIcon },
]

const styles = {
    done: { box: 'bg-[#05ED6A] text-white', text: 'text-[#05ED6A] font-bold', line: 'border-solid border-[#05ED6A]' },
    active: { box: 'bg-[#10088F] text-white', text: 'text-[#10088F] font-bold', line: 'border-dotted border-[#10088F]' },
    next: {
        box: 'border border-[#7777778d] text-[#777]',
        text: 'text-[#777]',
        line: 'border-dotted border-[#7777778d]',
    },
}

const ReserveStepper = ({ current }: { current: number }) => (
    <ol className='order-first flex items-start justify-center xl:order-last xl:w-20 xl:flex-col xl:items-center xl:pt-6'>
        {steps.map(({ label, Icon }, i) => {
            const style = styles[i < current ? 'done' : i === current ? 'active' : 'next']
            const isLast = i === steps.length - 1

            return (
                <Fragment key={label}>
                    <li className='flex flex-col items-center'>
                        <span className={`flex h-8 w-8 items-center justify-center rounded-[12px] xl:h-11 xl:w-11 ${style.box}`}>
                            <Icon className='h-6 w-6' />
                        </span>
                        <span className={`mt-1.5 whitespace-nowrap text-[11px] dark:text-white-1 ${style.text}`}>{label}</span>
                        {!isLast && <span className={`my-2 hidden h-10 border-l-2 xl:block ${style.line}`} />}
                    </li>
                    {!isLast && <span className={`mx-1 mt-[18px] w-5 border-t-2 sm:w-14 xl:hidden ${style.line}`} />}
                </Fragment>
            )
        })}
    </ol>
)

export default ReserveStepper
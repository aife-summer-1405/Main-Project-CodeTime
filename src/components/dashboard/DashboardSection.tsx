import { Bell, CalendarDays, Heart, UserRound, Wallet } from 'lucide-react'

const icons = {
    user: UserRound,
    calendar: CalendarDays,
    heart: Heart,
    wallet: Wallet,
    bell: Bell,
}

type SectionIcon = keyof typeof icons

export default function DashboardSection({
    title,
    description,
    icon,
}: {
    title: string
    description: string
    icon: SectionIcon
}) {
    const Icon = icons[icon]

    return (
        <section className='flex min-h-[360px] flex-col gap-5'>
            <div className='flex items-center gap-3'>
                <span className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5F5F5] dark:bg-[#1C1C1C] text-[#0087CA]'>
                    <Icon size={21} />
                </span>
                <div>
                    <h1 className='text-base font-bold text-[#0087CA]'>{title}</h1>
                    <p className='mt-1 text-xs text-[#858493] dark:text-[#A1A1AA]'>{description}</p>
                </div>
            </div>
            <div className='flex flex-1 items-center justify-center rounded-[18px] border border-dashed border-[#CFE4EC] dark:border-[#2A2A2A] bg-white dark:bg-[#121212]'>
                <p className='text-sm text-[#999] dark:text-[#A1A1AA]'>محتوای این بخش بعداً به اطلاعات API متصل می‌شود.</p>
            </div>
        </section>
    )
}

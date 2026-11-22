
import {
    BadgeCheck,
    Check,
    ImageIcon,
    Info,
    MapPin,
    type LucideIcon,
} from 'lucide-react'

export const wizardSteps: { label: string; icon: LucideIcon }[] = [
    { label: 'مشخصات اولیه', icon: Info },
    { label: 'آدرس', icon: MapPin },
    { label: 'امکانات', icon: BadgeCheck },
    { label: 'تصاویر ملک', icon: ImageIcon },
    { label: 'تایید نهایی', icon: Check },
]

export default function WizardStepper({ current }: { current: number }) {
    return (
        <ol className="
            flex items-center gap-2 rounded-full px-3 py-2.5
            bg-[linear-gradient(0.32deg,rgba(245,245,245,0.6)_0.27%,rgba(227,242,255,0.6)_49.99%,rgba(245,245,245,0.6)_99.71%)]
            bg-none
            border border-transparent dark:border-[#303030]
        ">
            {wizardSteps.map(({ label, icon: Icon }, i) => {
                const done = i < current
                const active = i === current

                const square = done
                    ? 'bg-[#05ED6A] text-white'
                    : active
                        ? 'bg-[#10088F] text-white dark:bg-[#0087CA]'
                        : 'border border-[#BDBDBD] text-[#8A8997] dark:border-[#484848] dark:text-[#A1A1AA]'

                const text = done
                    ? 'text-[#05ED6A]'
                    : active
                        ? 'font-bold text-[#10088F] dark:text-[#38A9E0]'
                        : 'text-[#8A8997] dark:text-[#A1A1AA]'

                return (
                    <li
                        key={label}
                        className={`flex items-center gap-2 ${i < wizardSteps.length - 1 ? 'flex-1' : ''}`}
                    >
                        <span
                            aria-current={active ? 'step' : undefined}
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${square}`}
                        >
                            <Icon size={22} className='dark:text-[#fff]' />
                        </span>

                        <span
                            className={`whitespace-nowrap text-[11px] ${text} ${active ? '' : 'hidden lg:inline'}`}
                        >
                            {label}
                        </span>

                        {i < wizardSteps.length - 1 && (
                            <i
                                className={`h-0 flex-1 border-t-2 ${done
                                    ? 'border-[#05ED6A]'
                                    : 'border-dashed border-[#999] dark:border-[#555]'
                                    }`}
                            />
                        )}
                    </li>
                )
            })}
        </ol>
    )
}

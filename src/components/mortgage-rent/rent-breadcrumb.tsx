import Link from 'next/link'

export type Crumb = { label: string; href?: string }

export default function RentBreadcrumb({ items }: { items: Crumb[] }) {
    return (
        <nav aria-label='breadcrumb' className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-black-2/60 dark:text-white-1/60 sm:text-sm'>
            {items.map((item, i) => {
                const last = i === items.length - 1
                return (
                    <span key={`${item.label}-${i}`} className='flex items-center gap-2'>
                        {item.href && !last ? (
                            <Link href={item.href} className='whitespace-nowrap transition hover:text-blue-1 dark:hover:text-blue-4'>
                                {item.label}
                            </Link>
                        ) : (
                            <span aria-current={last ? 'page' : undefined} className={last ? 'text-blue-1 dark:text-blue-4' : undefined}>
                                {item.label}
                            </span>
                        )}
                        {!last && <span aria-hidden='true'>/</span>}
                    </span>
                )
            })}
        </nav>
    )
}

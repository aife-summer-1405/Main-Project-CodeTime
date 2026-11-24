import Bone from './Bone'

const card = 'rounded-2xl bg-[#F5F5F5] shadow-[0px_0px_4px_0px_#005EA433] dark:bg-[#121212]'

export const PageTitleSkeleton = () => <Bone className='h-5 w-40' />

export function ToolbarSkeleton({ search = true, filters = 1 }: { search?: boolean; filters?: number }) {
    return (
        <div className='flex flex-wrap items-center justify-between gap-3'>
            <Bone className='h-5 w-44' />
            <div className='flex flex-wrap items-center gap-3'>
                {Array.from({ length: filters }, (_, i) => (
                    <Bone key={i} className='h-12 w-36 rounded-2xl' />
                ))}
                {search && <Bone className='h-12 w-full rounded-2xl sm:w-72' />}
            </div>
        </div>
    )
}

export function TableSkeleton({
    columns = 5,
    rows = 5,
    actions = true,
    header = true,
}: {
    columns?: number
    rows?: number
    actions?: boolean
    header?: boolean
}) {
    const template = `repeat(${columns}, minmax(0, 1fr))${actions ? ' 32px' : ''}`
    const grid = 'grid items-center gap-4 px-3'

    return (
        <div aria-hidden='true' className='overflow-x-auto'>
            <div className='mx-1.5 flex min-w-[620px] flex-col gap-3 py-3'>
                {header && (
                    <div style={{ gridTemplateColumns: template }} className={`${grid} ${card} py-5`}>
                        {Array.from({ length: columns }, (_, i) => (
                            <Bone key={i} className='h-3 w-16' />
                        ))}
                        {actions && <span />}
                    </div>
                )}
                {Array.from({ length: rows }, (_, row) => (
                    <div key={row} style={{ gridTemplateColumns: template }} className={`${grid} h-[52px] ${card}`}>
                        {Array.from({ length: columns }, (_, col) => (
                            <div key={col} className='flex items-center gap-2'>
                                {col === 0 && <Bone className='h-8 w-8 shrink-0 rounded-md' />}
                                <Bone className={`h-3 ${col % 2 ? 'w-2/3' : 'w-5/6'}`} />
                            </div>
                        ))}
                        {actions && <Bone className='h-5 w-5 rounded-full' />}
                    </div>
                ))}
            </div>
        </div>
    )
}

export function PaginationSkeleton() {
    return (
        <div aria-hidden='true' className='flex items-center justify-center gap-2 py-2'>
            {Array.from({ length: 5 }, (_, i) => (
                <Bone key={i} className='h-9 w-9 rounded-full' />
            ))}
        </div>
    )
}

export function StatCardsSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div aria-hidden='true' className='mx-1.5 grid grid-cols-2 gap-3 sm:grid-cols-5'>
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className={`${card} flex h-[100px] flex-col items-center justify-center gap-2`}>
                    <Bone className='h-[18px] w-[18px] rounded-full' />
                    <Bone className='h-3 w-20' />
                    <Bone className='h-5 w-10' />
                </div>
            ))}
        </div>
    )
}

export function ProfileCardSkeleton() {
    return (
        <div aria-hidden='true' className={`${card} flex flex-col items-center gap-3 p-4`}>
            <Bone className='h-20 w-20 rounded-full' />
            <Bone className='h-3 w-28' />
            <Bone className='h-2.5 w-full' />
            <Bone className='h-2.5 w-4/5' />
            <Bone className='h-7 w-28 rounded-lg' />
        </div>
    )
}

export function ChartSkeleton() {
    return (
        <div aria-hidden='true' className={`${card} flex min-h-[300px] flex-col gap-4 p-4`}>
            <Bone className='h-3 w-24' />
            <div className='flex h-[200px] items-end gap-2'>
                {[40, 70, 55, 90, 60, 80, 45, 65].map((height, i) => (
                    <div
                        key={i}
                        style={{ height: `${height}%` }}
                        className='flex-1 animate-pulse rounded-t-md bg-[#E9EEF1] dark:bg-[#242424]'
                    />
                ))}
            </div>
            <Bone className='h-3 w-32' />
        </div>
    )
}

export function OverviewSkeleton({ statCards = 5 }: { statCards?: number }) {
    return (
        <div aria-busy='true' className='flex min-w-0 flex-col gap-5'>
            <PageTitleSkeleton />
            <div className='grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_230px]'>
                <div className='flex min-w-0 flex-col gap-4'>
                    <StatCardsSkeleton count={statCards} />
                    <div className='mx-1.5 flex items-center justify-between'>
                        <Bone className='h-3 w-24' />
                        <Bone className='h-3 w-16' />
                    </div>
                    <TableSkeleton columns={4} rows={4} />
                </div>
                <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-1 xl:content-start'>
                    <ProfileCardSkeleton />
                    <ChartSkeleton />
                </div>
            </div>
        </div>
    )
}

export function ListPageSkeleton({
    columns = 5,
    rows = 6,
    search = true,
    filters = 1,
}: {
    columns?: number
    rows?: number
    search?: boolean
    filters?: number
}) {
    return (
        <div aria-busy='true' className='flex min-w-0 flex-col gap-5'>
            <PageTitleSkeleton />
            <ToolbarSkeleton search={search} filters={filters} />
            <TableSkeleton columns={columns} rows={rows} />
            <PaginationSkeleton />
        </div>
    )
}

export function FinanceSkeleton() {
    return (
        <div aria-busy='true' className='flex min-w-0 flex-col gap-5'>
            <PageTitleSkeleton />
            <StatCardsSkeleton count={4} />
            <ToolbarSkeleton search={false} filters={2} />
            <TableSkeleton columns={6} rows={4} />
            <PaginationSkeleton />
        </div>
    )
}

export function FormPageSkeleton() {
    return (
        <div aria-busy='true' className='flex min-w-0 flex-col gap-5'>
            <PageTitleSkeleton />
            <div className={`${card} flex h-14 items-center gap-3 px-3`}>
                <Bone className='h-9 w-32 rounded-lg' />
                <Bone className='h-9 w-24 rounded-lg' />
            </div>
            <div className={`${card} flex flex-col gap-6 p-4 sm:p-6`}>
                <div className='flex items-center justify-center gap-3'>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Bone key={i} className={i === 2 ? 'h-20 w-20 rounded-full' : 'h-14 w-14 rounded-full'} />
                    ))}
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                    {Array.from({ length: 4 }, (_, i) => (
                        <Bone key={i} className='h-14 rounded-[16px]' />
                    ))}
                </div>
                <div className='flex justify-end gap-3'>
                    <Bone className='h-11 w-28 rounded-xl' />
                    <Bone className='h-11 w-28 rounded-xl' />
                </div>
            </div>
        </div>
    )
}

export function WizardSkeleton() {
    return (
        <div aria-busy='true' className='flex min-w-0 flex-col gap-5'>
            <PageTitleSkeleton />
            <div className='flex items-center justify-between'>
                <Bone className='h-3 w-24' />
                <Bone className='h-4 w-32' />
            </div>
            <div className='flex items-center justify-between gap-2 rounded-2xl bg-[#EEF5F8] p-3 dark:bg-[#1C1C1C]'>
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className='flex flex-1 items-center gap-2'>
                        <Bone className='hidden h-3 w-16 sm:block' />
                        <Bone className='h-9 w-9 shrink-0 rounded-lg' />
                        {i < 4 && <Bone className='h-0.5 flex-1' />}
                    </div>
                ))}
            </div>
            <div className='grid gap-4 md:grid-cols-3'>
                {Array.from({ length: 6 }, (_, i) => (
                    <Bone key={i} className='h-12 rounded-2xl' />
                ))}
            </div>
            <Bone className='h-32 rounded-2xl' />
            <Bone className='h-11 w-32 rounded-xl' />
        </div>
    )
}

export function DashboardShellSkeleton() {
    return (
        <div
            dir='rtl'
            aria-busy='true'
            className='flex h-dvh w-full gap-5 overflow-hidden bg-[#F5F5F5] p-4 dark:bg-[#121212] sm:p-6 lg:pr-14'
        >
            <div className='hidden w-[210px] shrink-0 flex-col gap-3 rounded-3xl border border-[#DCEEF4] p-3 dark:border-[#2A2A2A] lg:flex'>
                <Bone className='mx-auto h-8 w-28' />
                <Bone className='mx-auto my-3 h-14 w-24' />
                {Array.from({ length: 6 }, (_, i) => (
                    <Bone key={i} className='h-10 w-full' />
                ))}
                <Bone className='mt-auto h-28 w-full rounded-2xl' />
            </div>
            <div className='flex min-w-0 flex-1 flex-col gap-5'>
                <Bone className='h-14 w-full rounded-[20px]' />
                <div className='flex-1 overflow-hidden rounded-[40px] border border-[#DCEEF4] p-4 dark:border-[#2A2A2A] sm:p-6'>
                    <OverviewSkeleton />
                </div>
            </div>
        </div>
    )
}

export function AdminOverviewSkeleton() {
    return (
        <div aria-busy='true' className='flex min-w-0 flex-col gap-5'>
            <PageTitleSkeleton />
            <StatCardsSkeleton count={5} />
            <div className='mx-1.5 flex items-center justify-between'>
                <Bone className='h-3 w-24' />
                <Bone className='h-3 w-16' />
            </div>
            <TableSkeleton columns={4} rows={5} actions={false} />
            <div className='mx-1.5 flex items-center justify-between'>
                <Bone className='h-3 w-24' />
                <Bone className='h-3 w-16' />
            </div>
            <TableSkeleton columns={6} rows={5} actions={false} />
        </div>
    )
}

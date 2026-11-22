import type { ReactNode } from 'react'
import Bone from '@/components/skeletons/Bone'

export type Column<T> = {
    key: string
    header: string
    width: string
    render: (row: T) => ReactNode
}

type Props<T> = {
    columns: Column<T>[]
    rows: T[]
    rowKey: (row: T) => string
    actions?: (row: T) => ReactNode
    loading?: boolean
    emptyText?: string
    actionsWidth?: string
}

export default function DataList<T>({ columns, rows, rowKey, actions, loading, emptyText = 'موردی یافت نشد', actionsWidth = '40px' }: Props<T>) {
    const template = [...columns.map((c) => c.width), ...(actions ? [actionsWidth] : [])].join(' ')
    const grid = 'grid items-center gap-4 px-3'

    return (
        <div className='overflow-x-auto'>
            <div className='mx-1.5 flex min-w-[620px] flex-col gap-3 py-3'>
                <div
                    style={{ gridTemplateColumns: template }}
                    className={`${grid} rounded-2xl bg-[#F5F5F5] py-5 text-[12px] text-[#8A8997] shadow-[0px_0px_4px_0px_#005EA433] dark:bg-[#1C1C1C]`}
                >
                    {columns.map((c) => (
                        <span key={c.key}>{c.header}</span>
                    ))}
                    {actions && <span />}
                </div>

                {loading &&
                    Array.from({ length: 4 }, (_, i) => (
                        <div
                            key={i}
                            aria-hidden='true'
                            style={{ gridTemplateColumns: template }}
                            className={`${grid} h-[52px] rounded-xl bg-[#F5F5F5] shadow-[0px_0px_4px_0px_#005EA433] dark:bg-[#121212]`}
                        >
                            {columns.map((c, col) => (
                                <div key={c.key} className='flex items-center gap-2'>
                                    {col === 0 && <Bone className='h-8 w-8 shrink-0 rounded-md' />}
                                    <Bone className={`h-3 ${col % 2 ? 'w-2/3' : 'w-5/6'}`} />
                                </div>
                            ))}
                            {actions && <Bone className='mx-auto h-5 w-5 rounded-full' />}
                        </div>
                    ))}

                {!loading && rows.length === 0 && <p className='py-10 text-center text-sm text-[#8A8997]'>{emptyText}</p>}

                {!loading &&
                    rows.map((row) => (
                        <div
                            key={rowKey(row)}
                            style={{ gridTemplateColumns: template }}
                            className={`${grid} h-[52px] rounded-xl bg-[#F5F5F5] text-[12px] text-[#343343] font-bold shadow-[0px_0px_4px_0px_#005EA433] transition hover:shadow-[0px_0px_10px_0px_#005EA440] dark:bg-[#121212] dark:text-[#D4D4D8]`}
                        >
                            {columns.map((c) => (
                                <div key={c.key} className='min-w-0'>
                                    {c.render(row)}
                                </div>
                            ))}
                            {actions && <div className='flex justify-center'>{actions(row)}</div>}
                        </div>
                    ))}
            </div>
        </div>
    )
}

import { MapPin } from 'lucide-react'

type Props = {
    query: string
    onQueryChange: (v: string) => void
    onOpenFilters: () => void
    onShowMap: () => void
}

export default function Toolbar({ query, onQueryChange, onOpenFilters, onShowMap }: Props) {
    return (
        <div className='px-4 lg:pr-17 lg:pl-0 w-full flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-2'>
                <button
                    type='button'
                    onClick={onOpenFilters}
                    className='flex justify-center items-center gap-2 border border-blue-4 px-3.5 cursor-pointer active:scale-[0.9] transition py-2.5 rounded-[16px]'
                >
                    <img src='/images/filter.svg' className='h-5' alt='' />
                    <h1 className='text-blue-4 text-sm whitespace-nowrap'>فیلتر های بیشتر</h1>
                </button>

                {/* mobile/tablet */}
                <button
                    type='button'
                    onClick={onShowMap}
                    className='lg:hidden flex items-center gap-2 border border-blue-4 px-3.5 py-2.5 rounded-[16px] text-blue-4 text-sm cursor-pointer active:scale-[0.9] transition'
                >
                    <MapPin size={18} />
                    نقشه
                </button>
            </div>

            <search className='flex-1 xl:w-90 sm:flex-none min-w-0 justify-center items-center pl-2 flex h-12 text-blue-4 text-sm pr-2.5 rounded-[16px] border border-blue-4'>
                <input
                    type='text'
                    id='search'
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder='مقصدت کجاست ...'
                    className='w-full sm:w-72 xl:w-120 min-w-0 outline-none h-full pl-2.5'
                />
                <img src='/images/search.svg' className='h-5' alt='' />
            </search>
        </div>
    )
}
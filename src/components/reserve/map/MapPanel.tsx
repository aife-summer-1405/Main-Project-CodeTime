import { Hotel } from '@/lib/Api/house'
import dynamic from 'next/dynamic'

const HotelsMap = dynamic(() => import('@/components/reserve/map/HotelsMap'), {
    ssr: false,
    loading: () => <div className='absolute inset-0 animate-pulse bg-gray-100 dark:bg-[#1c1c1c]' />,
})

type Props = {
    hotels: Hotel[]
    selectedId: number | null
    visible: boolean
    onSelect: (id: number) => void
    onBack: () => void
}

export default function MapPanel({ hotels, selectedId, visible, onSelect, onBack }: Props) {
    return (
        <div
            className={`${visible ? 'block' : 'hidden'} lg:block lg:self-start lg:max-h-[900px] lg:h-full isolate relative flex-1 lg:flex-none lg:w-[40%] xl:w-[50%] min-h-0 border-2 rounded-tr-[42px] rounded-tl-[8px] rounded-br-[8px] rounded-bl-[42px] overflow-hidden`}
        >
            <button
                type='button'
                onClick={onBack}
                className='lg:hidden absolute top-3 right-3 z-[1000] bg-white text-blue-4 text-sm border border-blue-4 rounded-[12px] px-3.5 py-2 shadow'
            >
                بازگشت به لیست
            </button>

            <HotelsMap hotels={hotels} selectedId={selectedId} onSelect={onSelect} />
        </div>
    )
}
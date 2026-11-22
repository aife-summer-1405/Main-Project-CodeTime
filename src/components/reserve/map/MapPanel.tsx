
'use client'

import { useEffect, useState } from 'react'
import { Hotel } from '@/lib/Api/house'
import dynamic from 'next/dynamic'

const HotelsMap = dynamic(
    () => import('@/components/reserve/map/HotelsMap'),
    {
        ssr: false,
        loading: () => (
            <div className='absolute inset-0 animate-pulse bg-gray-100 dark:bg-[#1c1c1c]' />
        ),
    }
)

type Props = {
    hotels: Hotel[]
    selectedId: string | null
    visible: boolean
    onSelect: (id: string) => void
    onBack: () => void
}

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')

        const update = () => setIsDesktop(mq.matches)

        update()

        mq.addEventListener('change', update)

        return () => mq.removeEventListener('change', update)
    }, [])

    return isDesktop
}

export default function MapPanel({
    hotels,
    selectedId,
    visible,
    onSelect,
    onBack,
}: Props) {
    const isDesktop = useIsDesktop()
    const showMap = isDesktop || visible

    return (
        <div
            className={`
                ${visible ? 'block' : 'hidden'}
                lg:block lg:self-start lg:max-h-[900px] lg:h-full
                isolate relative flex-1 lg:flex-none
                lg:w-[40%] xl:w-[50%] min-h-0
                border-2 border-gray-200 dark:border-[#383838]
                bg-white dark:bg-[#1C1C1C]
                rounded-tr-[42px] rounded-tl-[8px]
                rounded-br-[8px] rounded-bl-[42px]
                overflow-hidden transition-colors duration-200
            `}
        >
            <button
                type='button'
                onClick={onBack}
                className='
                    lg:hidden absolute top-3 right-3 z-[1000]
                    bg-white dark:bg-[#252525]
                    text-blue-4 dark:text-[#38A9E0]
                    text-sm
                    border border-blue-4 dark:border-[#38A9E0]
                    rounded-[12px] px-3.5 py-2 shadow
                    transition-colors duration-200
                    hover:bg-blue-50 dark:hover:bg-[#303030]
                '
            >
                بازگشت به لیست
            </button>

            {showMap && (
                <HotelsMap
                    hotels={hotels}
                    selectedId={selectedId}
                    onSelect={onSelect}
                />
            )}
        </div>
    )
}

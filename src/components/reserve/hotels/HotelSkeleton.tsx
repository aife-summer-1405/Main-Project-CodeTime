export default function HotelCardSkeleton() {
    return (
        <div
            aria-hidden='true'
            className='w-full md:h-55 shrink-0 p-2 border rounded-[32px] flex flex-col md:flex-row gap-3 animate-pulse'
        >
            {/* image */}
            <div className='h-52 md:h-full w-full md:w-64 xl:w-90 shrink-0 rounded-[24px] bg-gray-200 dark:bg-[#2a2a2a]' />

            {/* details */}
            <div className='w-full min-w-0 h-full p-2 flex flex-col justify-between gap-3'>
                {/* title + location */}
                <div className='flex flex-col gap-2'>
                    <div className='h-4 w-2/3 rounded bg-gray-200 dark:bg-[#2a2a2a]' />
                    <div className='h-3 w-1/2 rounded bg-gray-200 dark:bg-[#2a2a2a]' />
                </div>

                <i className='w-full border-t' />

                {/* nights */}
                <div className='h-3 w-12 rounded bg-gray-200 dark:bg-[#2a2a2a]' />

                {/* price + button */}
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center justify-between gap-3'>
                        <div className='h-3 w-16 rounded bg-gray-200 dark:bg-[#2a2a2a]' />
                        <div className='h-4 w-24 rounded bg-gray-200 dark:bg-[#2a2a2a]' />
                    </div>
                    <div className='w-full h-10 rounded-[12px] bg-gray-200 dark:bg-[#2a2a2a]' />
                </div>
            </div>
        </div>
    )
}
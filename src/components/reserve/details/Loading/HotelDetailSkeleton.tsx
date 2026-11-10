const Bone = ({ className = '' }: { className?: string }) => (
    <div className={`bg-gray-200 dark:bg-[#2a2a2a] ${className}`} />
)

const CommentSkeleton = () => (
    <div className='w-[94%] sm:w-[85%] flex flex-col gap-3 px-3.5 sm:px-[23px] py-[13px] rounded-[8px] rounded-tr-[24px] rounded-bl-[24px] sm:rounded-tr-[32px] sm:rounded-bl-[32px] border shadow-[0_0_10px_0_#005EA41A]'>
        <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-2 sm:gap-3'>
                <Bone className='size-10 sm:size-12 rounded-full shrink-0' />
                <Bone className='h-4 w-24 sm:w-28 rounded' />
            </div>
            <Bone className='h-3 w-16 sm:w-20 rounded' />
        </div>
        <Bone className='h-3 w-[70%] rounded sm:mr-15' />
        <Bone className='h-3 w-[45%] rounded sm:mr-15' />
    </div>
)

const SimilarSkeleton = () => (
    <div className='flex gap-3 p-2 rounded-[16px] border'>
        <Bone className='w-[104px] h-[92px] min-[420px]:w-[140px] min-[420px]:h-[100px] sm:w-[172px] sm:h-[108px] lg:w-[104px] lg:h-[92px] xl:w-[172px] xl:h-[108px] shrink-0 rounded-[8px]' />
        <div className='flex flex-col justify-between gap-1 flex-1 min-w-0 py-1'>
            <Bone className='h-4 w-3/4 rounded' />
            <Bone className='h-3 w-full rounded' />
            <i className='w-full border-t' />
            <Bone className='h-4 w-1/2 rounded' />
        </div>
    </div>
)

const HotelDetailSkeleton = () => {
    return (
        <div
            aria-hidden='true'
            className='w-full bg-white-1 max-w-[1920px] mx-auto overflow-hidden animate-pulse'
        >
            {/* navigation btns */}
            <div className='px-4 pt-4 lg:pr-6 flex gap-1.5 sm:gap-2.5'>
                <Bone className='h-4 w-12 rounded' />
                <Bone className='h-4 w-16 sm:w-20 rounded' />
                <Bone className='h-4 w-24 sm:w-36 rounded' />
            </div>

            {/* slider */}
            <div dir='rtl' className='w-full overflow-hidden py-6 sm:py-10 flex justify-center items-center gap-3 sm:gap-6'>
                <Bone className='hidden md:block shrink-0 w-[70%] max-w-[880px] aspect-[16/7.2] rounded-3xl scale-[0.88]' />
                <Bone className='shrink-0 w-[88%] max-w-[880px] aspect-[4/3] md:w-[70%] md:aspect-[16/7.2] rounded-2xl sm:rounded-3xl' />
                <Bone className='hidden md:block shrink-0 w-[70%] max-w-[880px] aspect-[16/7.2] rounded-3xl scale-[0.88]' />
            </div>

            {/* info */}
            <div className='max-w-[1920px] mx-auto min-h-20 py-3 px-4 sm:px-8 lg:px-16 xl:px-30 flex items-center justify-between gap-3'>
                <div className='flex flex-col gap-3 min-w-0'>
                    <Bone className='h-5 sm:h-6 w-40 sm:w-56 rounded' />
                    <Bone className='h-4 w-52 sm:w-72 max-w-full rounded' />
                </div>
                <div className='flex items-center gap-2 sm:gap-3 shrink-0'>
                    <Bone className='size-8 rounded-[8px]' />
                    <Bone className='size-8 rounded-[8px]' />
                </div>
            </div>

            <div className='px-4 sm:px-6 lg:px-10 xl:px-24 flex flex-col lg:flex-row gap-6 lg:gap-8 mt-5 pb-9'>
                {/* left container */}
                <div className='w-full min-w-0 h-full border shadow-[0_0_10px_0_#005EA41A] p-3 sm:p-6 rounded-[16px]'>
                    {/* tags */}
                    <Bone className='h-5 w-48 sm:w-64 max-w-full rounded mb-[14px]' />
                    <div className='flex flex-wrap gap-2.5 sm:gap-5 xl:gap-8'>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Bone key={i} className='h-[42px] sm:h-[50px] w-28 sm:w-36 rounded-[8px]' />
                        ))}
                    </div>

                    {/* about */}
                    <div className='flex flex-col mt-8 sm:mt-13 gap-5 sm:gap-8'>
                        <Bone className='h-5 w-40 sm:w-48 rounded' />
                        <div className='flex flex-col gap-2.5 pr-0 sm:pr-3.5'>
                            <Bone className='h-6 w-44 sm:w-52 rounded' />
                            <Bone className='h-4 w-full rounded' />
                            <Bone className='h-4 w-[80%] rounded' />
                        </div>
                        <div dir='ltr' className='w-full h-[200px] min-[480px]:h-[300px] lg:h-[450px] grid grid-cols-3 grid-rows-2 gap-1.5 sm:gap-2'>
                            <Bone className='col-span-2 row-span-2 rounded-[4px] rounded-bl-[24px] sm:rounded-bl-[40px]' />
                            <Bone className='rounded-[4px] rounded-tr-[24px] sm:rounded-tr-[40px]' />
                            <Bone className='rounded-[4px]' />
                        </div>
                    </div>

                    {/* comments */}
                    <div className='flex flex-col mt-10 sm:mt-14'>
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                            <Bone className='h-5 w-40 sm:w-52 rounded' />
                            <Bone className='h-9 sm:h-11 w-24 sm:w-28 rounded-[16px]' />
                        </div>
                        <div className='flex flex-col items-center mt-6 sm:mt-10 gap-4 py-4'>
                            {[1, 2, 3].map((i) => (
                                <CommentSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* right container */}
                <div className='w-full lg:w-80 xl:w-100 shrink-0 flex flex-col gap-6 lg:gap-8'>
                    <aside className='w-full lg:min-h-110 border shadow-[0_0_10px_0_#005EA41A] rounded-[16px] p-4 sm:p-6 flex flex-col gap-5 sm:gap-6'>
                        <Bone className='h-5 w-24 rounded mx-auto' />
                        <div className='grid grid-cols-2 gap-2 sm:gap-4'>
                            <Bone className='h-12 rounded' />
                            <Bone className='h-12 rounded' />
                        </div>
                        <i className='w-full border-t' />
                        <Bone className='h-12 w-full rounded' />
                        <i className='w-full border-t' />
                        <div className='flex items-center justify-between gap-3'>
                            <Bone className='h-4 w-20 sm:w-24 rounded' />
                            <Bone className='h-5 w-24 sm:w-28 rounded' />
                        </div>
                        <Bone className='h-12 w-full sm:w-[80%] rounded-[16px] mx-auto' />
                    </aside>

                    <div className='w-full border shadow-[0_0_10px_0_#005EA41A] rounded-[16px] px-4 py-5 sm:px-8 sm:py-6 lg:px-4 xl:px-8'>
                        <Bone className='h-5 w-24 rounded mx-auto' />
                        <div className='w-full border-t mt-4 mb-6' />
                        <div className='flex flex-col gap-4'>
                            {[1, 2, 3].map((i) => (
                                <SimilarSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HotelDetailSkeleton
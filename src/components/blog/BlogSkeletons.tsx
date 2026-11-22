import Bone from '@/components/skeletons/Bone'

const shell = 'mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-24'

export function BlogCardSkeleton() {
    return (
        <div aria-hidden='true' className='flex min-w-0 flex-col gap-4 rounded-[24px] border p-4 sm:rounded-[32px] sm:p-6'>
            <div className='flex items-center justify-between'>
                <Bone className='h-7 w-20 rounded-[8px]' />
                <Bone className='size-5' />
            </div>
            <div className='flex flex-col gap-2'>
                <Bone className='h-4 w-3/4' />
                <Bone className='h-3.5 w-full' />
                <Bone className='h-3.5 w-full' />
                <Bone className='h-3.5 w-2/3' />
            </div>
            <i className='w-full border-t' />
            <div className='flex items-center justify-between gap-3'>
                <Bone className='h-3 w-16' />
                <Bone className='h-3 w-24' />
            </div>
            <Bone className='h-9 w-full rounded-[12px]' />
        </div>
    )
}

export function BlogListSkeleton() {
    return (
        <div dir='rtl' aria-busy='true' className={`${shell} flex flex-col gap-5 pb-12 pt-4 sm:gap-6`}>
            <div className='flex gap-2'>
                <Bone className='h-4 w-12' />
                <Bone className='h-4 w-16' />
            </div>
            <Bone className='h-36 w-full rounded-[4px] rounded-bl-[32px] rounded-tr-[32px] sm:h-44 sm:rounded-bl-[40px] sm:rounded-tr-[40px]' />
            <div className='flex flex-col gap-3 lg:flex-row'>
                <Bone className='h-12 w-full rounded-[16px] lg:flex-1' />
                <Bone className='h-12 w-full rounded-[16px] lg:w-72' />
            </div>
            <div className='flex gap-2 overflow-hidden'>
                {Array.from({ length: 7 }, (_, i) => (
                    <Bone key={i} className='h-10 w-24 shrink-0 rounded-[12px]' />
                ))}
            </div>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3'>
                {Array.from({ length: 6 }, (_, i) => (
                    <BlogCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}

export function BlogDetailSkeleton() {
    return (
        <div dir='rtl' aria-busy='true' className={`${shell} pb-12 pt-4`}>
            <div className='flex gap-2'>
                <Bone className='h-4 w-12' />
                <Bone className='h-4 w-14' />
                <Bone className='h-4 w-28 sm:w-44' />
            </div>

            <div className='mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
                <div className='flex min-w-0 flex-1 flex-col gap-5 rounded-[16px] border p-4 sm:p-8'>
                    <div className='flex items-center justify-between'>
                        <Bone className='h-7 w-24 rounded-[8px]' />
                        <Bone className='h-9 w-24 rounded-[12px]' />
                    </div>
                    <Bone className='h-7 w-full sm:h-8' />
                    <Bone className='h-7 w-2/3 sm:h-8' />
                    <div className='flex gap-4'>
                        <Bone className='h-4 w-20' />
                        <Bone className='h-4 w-28' />
                    </div>
                    <i className='w-full border-t' />
                    <Bone className='h-5 w-28' />
                    <div className='flex flex-col gap-3'>
                        <Bone className='h-4 w-full' />
                        <Bone className='h-4 w-full' />
                        <Bone className='h-4 w-full' />
                        <Bone className='h-4 w-3/4' />
                    </div>
                </div>

                <div className='flex w-full shrink-0 flex-col gap-6 lg:w-80 xl:w-96'>
                    <div className='flex items-center gap-3 rounded-[16px] border p-4'>
                        <Bone className='size-12 shrink-0 rounded-full' />
                        <div className='flex flex-1 flex-col gap-2'>
                            <Bone className='h-4 w-28' />
                            <Bone className='h-3 w-40 max-w-full' />
                        </div>
                    </div>
                    <Bone className='h-36 w-full rounded-[16px]' />
                    <div className='flex flex-col gap-4 rounded-[16px] border p-4'>
                        <Bone className='mx-auto h-5 w-24' />
                        <i className='w-full border-t' />
                        {Array.from({ length: 3 }, (_, i) => (
                            <div key={i} className='flex flex-col gap-2 rounded-[12px] border p-3'>
                                <Bone className='h-4 w-full' />
                                <Bone className='h-3 w-24' />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

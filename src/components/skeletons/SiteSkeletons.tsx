import HotelCardSkeleton from '@/components/reserve/hotels/HotelSkeleton'
import Bone from './Bone'

const shell = 'mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10 xl:px-24'

export function ReserveListSkeleton() {
    return (
        <div dir='rtl' aria-busy='true' className={`${shell} flex min-h-[70dvh] flex-col gap-4 pt-4 lg:flex-row`}>
            <div className='flex min-w-0 flex-1 flex-col gap-4'>
                <Bone className='h-12 w-full rounded-2xl' />
                <div className='flex items-center justify-between gap-3'>
                    <Bone className='h-5 w-40' />
                    <div className='flex gap-2'>
                        <Bone className='h-10 w-24 rounded-xl' />
                        <Bone className='h-10 w-24 rounded-xl' />
                    </div>
                </div>
                {Array.from({ length: 4 }, (_, i) => (
                    <HotelCardSkeleton key={i} />
                ))}
            </div>
            <Bone className='hidden h-[calc(100dvh-120px)] w-[42%] shrink-0 rounded-3xl lg:block' />
        </div>
    )
}

export function StartReserveSkeleton() {
    return (
        <div dir='rtl' aria-busy='true' className={`${shell} pb-10`}>
            <div className='flex gap-2 pt-4'>
                <Bone className='h-4 w-14' />
                <Bone className='h-4 w-20' />
                <Bone className='h-4 w-32' />
            </div>

            <div className='mt-6 flex flex-col gap-8 xl:flex-row xl:items-start'>
                <aside className='flex w-full shrink-0 flex-col gap-3 rounded-3xl border p-3 xl:w-[360px]'>
                    <Bone className='h-44 w-full rounded-2xl' />
                    <Bone className='h-4 w-2/3' />
                    <Bone className='h-3 w-1/2' />
                    <Bone className='h-px w-full' />
                    <Bone className='h-3 w-full' />
                    <Bone className='h-3 w-4/5' />
                    <Bone className='mt-2 h-6 w-32' />
                </aside>

                <main className='mx-auto flex w-full min-w-0 max-w-[520px] flex-1 flex-col gap-4'>
                    <Bone className='h-5 w-40' />
                    {Array.from({ length: 5 }, (_, i) => (
                        <Bone key={i} className='h-12 w-full rounded-2xl' />
                    ))}
                    <Bone className='h-12 w-full rounded-2xl' />
                </main>

                <div className='hidden shrink-0 flex-col items-center gap-6 xl:flex'>
                    {Array.from({ length: 4 }, (_, i) => (
                        <Bone key={i} className='h-10 w-10 rounded-full' />
                    ))}
                </div>
            </div>
        </div>
    )
}

export function ContactSkeleton() {
    return (
        <div dir='rtl' aria-busy='true' className={`${shell} flex flex-col gap-10 pb-10 pt-4`}>
            <Bone className='h-[260px] w-full rounded-[32px] sm:h-[340px]' />

            <div className='grid gap-4 md:grid-cols-3'>
                {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className='flex flex-col items-center gap-3 rounded-2xl border p-5'>
                        <Bone className='h-10 w-10 rounded-full' />
                        <Bone className='h-4 w-24' />
                        <Bone className='h-3 w-40' />
                    </div>
                ))}
            </div>

            <div className='grid gap-6 lg:grid-cols-2'>
                <Bone className='h-[340px] w-full rounded-3xl' />
                <div className='flex flex-col gap-4'>
                    <Bone className='h-12 w-full rounded-2xl' />
                    <Bone className='h-12 w-full rounded-2xl' />
                    <Bone className='h-32 w-full rounded-2xl' />
                    <Bone className='h-12 w-40 rounded-2xl' />
                </div>
            </div>
        </div>
    )
}



export function AuthSkeleton() {
    return (
        <div dir='rtl' aria-busy='true' className='flex min-h-dvh items-center justify-center p-4'>
            <div className='flex w-full max-w-[420px] flex-col gap-4 rounded-3xl border p-6'>
                <Bone className='mx-auto h-8 w-32' />
                <Bone className='mx-auto h-4 w-52' />
                <Bone className='h-12 w-full rounded-2xl' />
                <Bone className='h-12 w-full rounded-2xl' />
                <Bone className='h-12 w-full rounded-2xl' />
                <Bone className='h-px w-full' />
                <Bone className='h-12 w-full rounded-2xl' />
            </div>
        </div>
    )
}

import Link from 'next/link'

type Props = { hotelTitle?: string }

export default function NavigationBar({ hotelTitle }: Props) {
    return (
        <div className='text-gray-1 px-4 lg:pr-6 w-full text-sm font-semibold flex gap-2.5'>
            <Link className='cursor-pointer whitespace-nowrap' href='/'>خانه /</Link>
            <p className='cursor-pointer whitespace-nowrap'>رزرو هتل {hotelTitle && '/'}</p>
            {hotelTitle && (
                <p className='text-[#10088F] truncate min-w-0' title={hotelTitle}>
                    {hotelTitle}
                </p>
            )}
        </div>
    )
}
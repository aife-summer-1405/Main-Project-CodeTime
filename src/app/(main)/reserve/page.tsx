import Link from 'next/link'
import React from 'react'

const page = () => {
    return (
        <div className='w-full  border border-red-1 pt-4 flex h-[calc(100dvh-79px)]'>
            <div className='border pl-4 border-green-1 h-full w-full flex flex-col gap-5 items-center'>
                {/* routes */}
                <div className='text-gray-1 pr-6 w-full text-sm font-semibold flex gap-2.5'>
                    <Link className='cursor-pointer' href={'/'}>خانه /</Link>
                    <p className='cursor-pointer'>رزرو هتل </p>
                </div>
                <div className='border pr-17 border-green-2 w-full flex justify-between'>
                    <button className='flex justify-center items-center gap-2 border border-blue-4 px-3.5 cursor-pointer active:scale-[0.9] transition-[0.5s] py-2.5 rounded-[16px]'>
                        <img src="/images/filter.svg" className='h-5' alt="" />
                        <h1 className='text-blue-4 text-sm '>فیلتر های بیشتر</h1>
                    </button>
                    <search className='justify-center items-center pl-2 flex h-12 text-blue-4 text-sm pr-2.5 rounded-[16px] border border-blue-4'>
                        <input type="text" id='search' placeholder='مقصدت کجاست ...' className='w-130 outline-none h-full pl-2.5' />
                        <img src="/images/search.svg" className='h-5' alt="" />
                    </search>
                </div>
                {/* grid */}
                <div className='w-full border pr-6 border-pink-600 h-full flex flex-col gap-3'>
                    {/* house */}
                    <div className='w-full h-55 p-2 border-amber-600 border rounded-[32px] flex'>
                        <ul className='h-full w-90 border-amber-400 border rounded-[24px]'>
                            <img src="/images/Rectangle.png" className='w-full h-full' alt="" />
                        </ul>
                        <div className='w-full h-full p-2 border-blue-600 border'>

                        </div>
                    </div>
                </div>
            </div>
            <div className='border border-yellow-1 rounded-tr-[42px] rounded-tl-[8px] rounded-br-[8px] rounded-bl-[42px] w-340 '></div>
        </div>
    )
}

export default page
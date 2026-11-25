'use client'
import { useEffect, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { getSeller, maskPhone, type MortgageHouse } from '@/lib/Api/mortgage'
import type { UserProfile } from '@/lib/Api/user'
import { getUserId } from '@/lib/Api/dashboard/common/user'
import { faDate } from '@/lib/format'

const faNum = (n: number) => n.toLocaleString('fa-IR')
const defaultAvatar = '/images/Rectangle (4).png'

const MortgageContactCard = ({ house }: { house: MortgageHouse }) => {
    const [seller, setSeller] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        setLoading(true)
        getSeller(house.sellerId)
            .then((u) => !controller.signal.aborted && setSeller(u))
            .catch(() => { })
            .finally(() => !controller.signal.aborted && setLoading(false))
        return () => controller.abort()
    }, [house.sellerId])

    const name = seller?.fullName || house.sellerName
    const phone = seller?.phoneNumber ?? null
    const hasDiscount = house.discounted_price !== null && house.discounted_price < house.price
    const mortgagePrice = hasDiscount ? (house.discounted_price as number) : house.price

    const onCall = () => {
        if (!phone) return toast.error('شماره تماس فروشنده در دسترس نیست')
        window.location.href = `tel:${phone}`
    }

    const onChat = () => {
        if (!getUserId()) return toast.error('برای گفتگو با فروشنده وارد حساب کاربری شوید')
        toast('گفتگو با فروشنده به‌زودی فعال می‌شود')
    }

    return (
        <div dir='rtl' className='w-full flex flex-col gap-5 p-4 sm:p-6'>
            <h2 className='text-center text-[#10088F] text-[16px] font-bold'>اطلاعات قیمت و تماس</h2>

            <div className='flex flex-col items-center gap-2'>
                {loading ? (
                    <>
                        <div className='size-14 rounded-full bg-gray-200 animate-pulse' />
                        <div className='h-4 w-28 rounded bg-gray-200 animate-pulse' />
                    </>
                ) : (
                    <>
                        <div className='border-3 border-[#05ED6A66] rounded-full'>
                            <img className='size-14 rounded-full object-cover' src={seller?.profilePicture ?? defaultAvatar} alt={name} />
                        </div>
                        <p className='text-[15px] font-bold text-[#060425]'>{name}</p>
                        {seller?.createdAt && (
                            <p className='text-[11px] text-gray-1 text-[#121212]'>عضو از {faDate(seller.createdAt)}</p>
                        )}
                    </>
                )}
            </div>

            <hr className='border-[#E0E0E0]' />

            <div className='flex flex-col gap-3'>
                <div className='flex items-center justify-between gap-2'>
                    <span className='text-[13px] font-medium text-[#060425]'>قیمت رهن از</span>
                    <div className='flex flex-col items-end'>
                        {hasDiscount && (
                            <span className='relative text-[12px] text-[#111111] font-bold'>
                                <i className='absolute top-[9px] left-0 w-full border-t border-red-1' />
                                {faNum(house.price)} تومان
                            </span>
                        )}
                        <span className='text-[15px] font-bold text-[#0A7FD6]'>{faNum(mortgagePrice)} تومان</span>
                    </div>
                </div>

                {house.rent_price ? (
                    <div className='flex items-center justify-between gap-2'>
                        <span className='text-[13px] font-medium text-[#060425]'>قیمت اجاره از</span>
                        <span className='text-[15px] font-bold text-[#0A7FD6]'>{faNum(house.rent_price)} تومان</span>
                    </div>
                ) : null}
            </div>

            <button
                type='button'
                // onClick={onCall}
                disabled={loading}
                className='w-full h-12 rounded-[16px] bg-[#15977D] text-white text-[14px] font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 active:scale-[0.97] disabled:opacity-50'
            >
                <Phone size={18} />
                <span dir='ltr'>تماس با {phone}</span>
            </button>

            <button
                type='button'
                onClick={onChat}
                className='mx-auto flex items-center gap-1.5 text-[13px] font-bold text-[#005EA4] cursor-pointer'
            >
                <MessageCircle size={18} />
                گفتگو با فروشنده
            </button>
        </div>
    )
}

export default MortgageContactCard

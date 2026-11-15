import Link from 'next/link'
import { faNum, formatFaDate, toFaDigits } from '@/lib/utils/reserve'
import type { ReservationConfirmation } from '../../types/types'

const Detail = ({ label, value }: { label: string; value: string }) => (
    <div className='flex items-center justify-between gap-3 border-b border-[#E8E8E8] py-2 text-sm last:border-0'>
        <span className='text-[#777]'>{label}</span>
        <span className='break-all font-medium text-[#060425] dark:text-white-1'>{value}</span>
    </div>
)

const ReserveStep3 = ({ confirmation }: { confirmation: ReservationConfirmation }) => (
    <div className='flex w-full flex-col items-center gap-5 py-4 text-center sm:gap-6 sm:py-8'>
        <img src='/images/reserveTrue.png' alt='ثبت موفق رزرو' className='h-auto w-40 max-w-full object-contain sm:w-52' />
        <h1 className='text-base font-bold leading-8 text-[#060425] dark:text-white-1 sm:text-lg md:text-xl'>رزرو شما با موفقیت انجام شد!</h1>

        <div className='flex w-full flex-col gap-3 sm:gap-4'>
            <Link href='/' className='flex h-12 items-center justify-center rounded-2xl bg-[#10088F] text-sm font-medium text-white transition-all duration-300 active:scale-[0.97] sm:h-14 sm:text-base'>بازگشت به صفحه اصلی</Link>
            <Link href='/dashboard/tickets' className='flex h-12 items-center justify-center rounded-2xl bg-[#15977D] text-sm font-medium text-white transition-all duration-300 active:scale-[0.97] sm:h-14 sm:text-base'>بلیط های من</Link>
        </div>
    </div>
)

export default ReserveStep3

'use client'

import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/Api/dashboard/common/errors'
import { bookingStatusOptions } from '@/lib/dashboard/seller-data'
import { updateAdminBooking, type AdminBooking, type BookingStatus } from '@/lib/Api/dashboard/admin/bookings'
import Modal from '../../components/Modal'
import FilterSelect from '../../common/FilterSelect'
import { JalaliDateField } from '../../seller/reservations/BookingFilterModal'
import FieldBox, { fieldInput } from '../FieldBox'

type Props = { booking: AdminBooking | null; onClose: () => void; onSaved: () => void }

type Values = {
    houseId: string
    sharedEmail: string
    sharedMobile: string
    travelers: { firstName: string; lastName: string; gender: string; nationalId: string }[]
}

const POPUP_Z_INDEX = 100001

const day = (value?: string) => value?.slice(0, 10) ?? ''

export default function AdminBookingEditModal({ booking, onClose, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<Values>()
    const { fields } = useFieldArray({ control, name: 'travelers' })
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [status, setStatus] = useState<BookingStatus>('pending')

    useEffect(() => {
        if (!booking) return
        reset({
            houseId: booking.houseId,
            sharedEmail: booking.sharedEmail,
            sharedMobile: booking.sharedMobile,
            travelers: booking.travelers.map(({ firstName, lastName, gender, nationalId }) => ({ firstName, lastName, gender, nationalId })),
        })
        setCheckIn(day(booking.reservedDates[0]))
        setCheckOut(day(booking.reservedDates[booking.reservedDates.length - 1]))
        setStatus(booking.status)
    }, [booking, reset])

    const onSubmit = async (values: Values) => {
        if (!booking) return
        if (!checkIn || !checkOut) return toast.error('تاریخ ورود و خروج را انتخاب کنید')
        if (checkOut < checkIn) return toast.error('تاریخ خروج نمی‌تواند قبل از تاریخ ورود باشد')
        try {
            await updateAdminBooking(booking.id, {
                houseId: values.houseId,
                reservedDates: [checkIn, checkOut],
                status,
                sharedEmail: values.sharedEmail,
                sharedMobile: values.sharedMobile,
                traveler_details: booking.travelers.map((traveler, i) => ({ ...traveler, ...values.travelers[i] })),
            })
            toast.success('رزرو با موفقیت ویرایش شد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, 'ویرایش رزرو با خطا مواجه شد'))
        }
    }

    return (
        <Modal open={!!booking} onClose={onClose} title='ویرایش رزرو' className='max-w-xl'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <div className='grid gap-4 sm:grid-cols-2'>
                    <FieldBox title='شناسه ملک' error={errors.houseId?.message}>
                        <input
                            inputMode='numeric'
                            dir='ltr'
                            className={`${fieldInput} text-right`}
                            {...register('houseId', { required: 'شناسه ملک را وارد کنید', pattern: { value: /^\d+$/, message: 'شناسه ملک معتبر نیست' } })}
                        />
                    </FieldBox>
                    <FilterSelect
                        label='وضعیت رزرو'
                        value={status}
                        options={bookingStatusOptions}
                        onChange={(value) => setStatus(value as BookingStatus)}
                        allowAll={false}
                        className='w-full'
                    />
                    <JalaliDateField label='تاریخ ورود' value={checkIn} max={checkOut || undefined} onChange={setCheckIn} zIndex={POPUP_Z_INDEX} />
                    <JalaliDateField label='تاریخ خروج' value={checkOut} min={checkIn || undefined} onChange={setCheckOut} zIndex={POPUP_Z_INDEX} />
                    <FieldBox title='ایمیل' error={errors.sharedEmail?.message}>
                        <input
                            type='email'
                            dir='ltr'
                            className={`${fieldInput} text-right`}
                            {...register('sharedEmail', { pattern: { value: /^\S+@\S+\.\S+$/, message: 'ایمیل معتبر نیست' } })}
                        />
                    </FieldBox>
                    <FieldBox title='شماره موبایل'>
                        <input type='tel' inputMode='tel' dir='ltr' className={`${fieldInput} text-right`} {...register('sharedMobile')} />
                    </FieldBox>
                </div>

                {fields.map((field, i) => (
                    <section key={field.id} className='flex flex-col gap-3 rounded-2xl border border-[#0887CA33] p-3'>
                        <h4 className='text-xs font-bold text-[#0087CA]'>{`مسافر ${(i + 1).toLocaleString('fa-IR')}`}</h4>
                        <div className='grid gap-3 sm:grid-cols-2'>
                            <FieldBox title='نام' error={errors.travelers?.[i]?.firstName?.message}>
                                <input className={fieldInput} {...register(`travelers.${i}.firstName`, { required: 'نام را وارد کنید' })} />
                            </FieldBox>
                            <FieldBox title='نام خانوادگی' error={errors.travelers?.[i]?.lastName?.message}>
                                <input className={fieldInput} {...register(`travelers.${i}.lastName`, { required: 'نام خانوادگی را وارد کنید' })} />
                            </FieldBox>
                            <FieldBox title='کد ملی'>
                                <input inputMode='numeric' dir='ltr' className={`${fieldInput} text-right`} {...register(`travelers.${i}.nationalId`)} />
                            </FieldBox>
                            <FieldBox title='جنسیت'>
                                <select className={fieldInput} {...register(`travelers.${i}.gender`)}>
                                    <option value='male'>آقا</option>
                                    <option value='female'>خانم</option>
                                </select>
                            </FieldBox>
                        </div>
                    </section>
                ))}

                <div className='mt-2 flex gap-3'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
                    >
                        {isSubmitting ? 'در حال ذخیره ...' : 'ذخیره تغییرات'}
                    </button>
                    <button
                        type='button'
                        onClick={onClose}
                        className='h-10 flex-1 cursor-pointer rounded-xl border border-[#ED053F] text-sm text-[#ED053F] transition active:scale-[0.95]'
                    >
                        انصراف
                    </button>
                </div>
            </form>
        </Modal>
    )
}

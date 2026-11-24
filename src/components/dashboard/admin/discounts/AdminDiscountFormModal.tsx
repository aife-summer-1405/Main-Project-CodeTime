'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { fa } from '@/lib/format'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { createAdminDiscount, updateAdminDiscount, type AdminDiscount } from '@/lib/dashboard/adminContentApi'
import Modal from '../../components/Modal'
import { JalaliDateField } from '../../seller/reservations/BookingFilterModal'
import FieldBox, { fieldInput } from '../FieldBox'

type Props = { open: boolean; discount: AdminDiscount | null; onClose: () => void; onSaved: () => void }

const POPUP_Z_INDEX = 100001

type Values = {
    code: string
    houseId: string
    percentage: string
    validUntil: string
}

const CODE_MIN = 3
const CODE_MAX = 20

const todayValue = () => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${now.getFullYear()}-${month}-${day}`
}

const emptyValues = (): Values => ({ code: '', houseId: '', percentage: '', validUntil: '' })

const fromDiscount = (discount: AdminDiscount): Values => ({
    code: discount.code,
    houseId: discount.houseId,
    percentage: String(discount.percentage),
    validUntil: discount.validUntil ? discount.validUntil.slice(0, 10) : '',
})

export default function AdminDiscountFormModal({ open, discount, onClose, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ mode: 'onChange', defaultValues: emptyValues() })

    useEffect(() => {
        if (open) reset(discount ? fromDiscount(discount) : emptyValues())
    }, [open, discount, reset])

    const originalDate = discount?.validUntil ? discount.validUntil.slice(0, 10) : ''
    const today = todayValue()
    const minDate = originalDate && originalDate < today ? originalDate : today

    const onSubmit = async (values: Values) => {
        const body = {
            code: values.code.trim().toUpperCase(),
            house_id: Number(values.houseId),
            discount_percentage: Number(values.percentage),
            valid_until: `${values.validUntil}T23:59:59.000Z`,
        }

        try {
            if (discount) await updateAdminDiscount(discount.id, body)
            else await createAdminDiscount(body)
            toast.success(discount ? 'کد تخفیف با موفقیت ویرایش شد' : 'کد تخفیف جدید با موفقیت ثبت شد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, discount ? 'ویرایش کد تخفیف با خطا مواجه شد' : 'ثبت کد تخفیف با خطا مواجه شد'))
        }
    }

    return (
        <Modal open={open} onClose={onClose} title={discount ? 'ویرایش کد تخفیف' : 'افزودن کد تخفیف جدید'} className='max-w-md'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4'>
                <FieldBox title='کد تخفیف' error={errors.code?.message}>
                    <input
                        dir='ltr'
                        className={`${fieldInput} text-right uppercase`}
                        {...register('code', {
                            required: 'کد تخفیف را وارد کنید',
                            validate: (value) => {
                                const code = value.trim()
                                if (code.length < CODE_MIN) return `کد تخفیف باید حداقل ${fa(CODE_MIN)} کاراکتر باشد`
                                return /^[A-Za-z0-9_-]+$/.test(code) || 'کد تخفیف فقط شامل حروف انگلیسی، عدد، خط تیره و زیرخط باشد'
                            },
                            maxLength: { value: CODE_MAX, message: `کد تخفیف نباید بیشتر از ${fa(CODE_MAX)} کاراکتر باشد` },
                        })}
                    />
                </FieldBox>

                <div className='grid gap-4 sm:grid-cols-2'>
                    <FieldBox title='شناسه ملک' error={errors.houseId?.message}>
                        <input
                            type='number'
                            dir='ltr'
                            className={`${fieldInput} text-right`}
                            {...register('houseId', {
                                required: 'شناسه ملک را وارد کنید',
                                validate: (value) => (Number.isInteger(Number(value)) && Number(value) > 0) || 'شناسه ملک معتبر نیست',
                            })}
                        />
                    </FieldBox>

                    <FieldBox title='درصد تخفیف' error={errors.percentage?.message}>
                        <input
                            type='number'
                            step='any'
                            dir='ltr'
                            className={`${fieldInput} text-right`}
                            {...register('percentage', {
                                required: 'درصد تخفیف را وارد کنید',
                                validate: (value) => {
                                    const n = Number(value)
                                    if (!Number.isFinite(n) || n <= 0) return 'درصد تخفیف باید بیشتر از ۰ باشد'
                                    if (n > 100) return 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد'
                                    return /^\d+(\.\d{1,2})?$/.test(value.trim()) || 'حداکثر دو رقم اعشار مجاز است'
                                },
                            })}
                        />
                    </FieldBox>
                </div>

                <Controller
                    control={control}
                    name='validUntil'
                    rules={{
                        required: 'تاریخ انقضا را انتخاب کنید',
                        validate: (value) => value >= today || value === originalDate || 'تاریخ انقضا نمی‌تواند گذشته باشد',
                    }}
                    render={({ field, fieldState }) => (
                        <div className='flex min-w-0 flex-col gap-1'>
                            <JalaliDateField label='تاریخ انقضا' value={field.value} min={minDate} onChange={field.onChange} zIndex={POPUP_Z_INDEX} />
                            {fieldState.error && <p className='px-1 text-[11px] text-red-500'>{fieldState.error.message}</p>}
                        </div>
                    )}
                />

                <div className='mt-2 flex gap-3'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
                    >
                        {isSubmitting ? 'در حال ذخیره ...' : discount ? 'ذخیره تغییرات' : 'ثبت کد تخفیف'}
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
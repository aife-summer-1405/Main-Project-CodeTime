'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { createAdminLocation, updateAdminLocation, type AdminLocation } from '@/lib/dashboard/adminApi'
import Modal from '../../components/Modal'
import MapPicker, { type MapPosition } from '../../common/MapPicker'
import FieldBox, { fieldInput } from '../FieldBox'

type Props = { open: boolean; location: AdminLocation | null; onClose: () => void; onSaved: () => void }

type Values = { areaName: string; lat: number; lng: number }

const coordinateRules = (min: number, max: number) => ({
    valueAsNumber: true as const,
    required: 'این فیلد الزامی است',
    min: { value: min, message: `مقدار باید حداقل ${min.toLocaleString('fa-IR')} باشد` },
    max: { value: max, message: `مقدار باید حداکثر ${max.toLocaleString('fa-IR')} باشد` },
    validate: (value: number) => Number.isFinite(value) || 'مقدار معتبر نیست',
})

export default function LocationFormModal({ open, location, onClose, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<Values>({ mode: 'onChange' })
    const lat = useWatch({ control, name: 'lat' })
    const lng = useWatch({ control, name: 'lng' })

    useEffect(() => {
        if (!open) return
        reset(location ? { areaName: location.areaName, lat: location.lat, lng: location.lng } : { areaName: '', lat: undefined, lng: undefined })
    }, [open, location, reset])

    const pick = ([nextLat, nextLng]: MapPosition) => {
        setValue('lat', nextLat, { shouldValidate: true, shouldDirty: true })
        setValue('lng', nextLng, { shouldValidate: true, shouldDirty: true })
    }

    const onSubmit = async (values: Values) => {
        const body = { area_name: values.areaName.trim(), lat: values.lat, lng: values.lng }
        try {
            if (location) await updateAdminLocation(location.id, body)
            else await createAdminLocation(body)
            toast.success(location ? 'مکان با موفقیت ویرایش شد' : 'مکان جدید با موفقیت ثبت شد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, location ? 'ویرایش مکان با خطا مواجه شد' : 'ثبت مکان با خطا مواجه شد'))
        }
    }

    const position: MapPosition | null = Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null

    return (
        <Modal open={open} onClose={onClose} title={location ? 'ویرایش مکان' : 'افزودن مکان جدید'} className='max-w-xl'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4'>
                <FieldBox title='نام منطقه' error={errors.areaName?.message}>
                    <input
                        className={fieldInput}
                        {...register('areaName', {
                            required: 'نام منطقه را وارد کنید',
                            validate: (value) => value.trim().length >= 2 || 'نام منطقه باید حداقل ۲ کاراکتر باشد',
                            maxLength: { value: 60, message: 'نام منطقه نباید بیشتر از ۶۰ کاراکتر باشد' },
                        })}
                    />
                </FieldBox>

                <div className='grid gap-4 sm:grid-cols-2'>
                    <FieldBox title='عرض جغرافیایی' error={errors.lat?.message}>
                        <input type='number' step='any' dir='ltr' className={`${fieldInput} text-right`} {...register('lat', coordinateRules(-90, 90))} />
                    </FieldBox>
                    <FieldBox title='طول جغرافیایی' error={errors.lng?.message}>
                        <input type='number' step='any' dir='ltr' className={`${fieldInput} text-right`} {...register('lng', coordinateRules(-180, 180))} />
                    </FieldBox>
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='px-1 text-[11px] text-[#8A8997]'>برای انتخاب موقعیت روی نقشه کلیک کنید</span>
                    <MapPicker value={position} onChange={pick} className='h-72' />
                </div>

                <div className='mt-2 flex gap-3'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='h-10 flex-1 cursor-pointer rounded-xl bg-[#060425] text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
                    >
                        {isSubmitting ? 'در حال ذخیره ...' : location ? 'ذخیره تغییرات' : 'ثبت مکان'}
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

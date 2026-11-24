'use client'

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import { transactionOptions } from '@/lib/dashboard/sellerHousesApi'
import { updateAdminHouse, type AdminHouse } from '@/lib/dashboard/adminApi'
import Modal from '../../components/Modal'
import FilterSelect from '../../common/FilterSelect'
import MapPicker, { type MapPosition } from '../../common/MapPicker'
import FieldBox, { fieldInput } from '../FieldBox'
import { captionRules, numberFields, numberRules, splitTags, tagsRules, textRules, type HouseFormValues } from './houseRules'

type Props = { house: AdminHouse | null; onClose: () => void; onSaved: () => void }

export default function AdminHouseEditModal({ house, onClose, onSaved }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<HouseFormValues>({ mode: 'onChange' })
    const [transaction, setTransaction] = useState('')
    const lat = useWatch({ control, name: 'lat' })
    const lng = useWatch({ control, name: 'lng' })

    useEffect(() => {
        if (!house) return
        reset({
            title: house.title,
            address: house.address,
            caption: house.caption,
            category: house.category,
            yardType: house.yardType,
            tags: house.tags.join('، '),
            price: house.price,
            discountedPrice: house.discountedPrice ?? undefined,
            rate: house.rate,
            capacity: house.capacity,
            rooms: house.rooms,
            bathrooms: house.bathrooms,
            parking: house.parking,
            lat: house.location?.lat,
            lng: house.location?.lng,
        })
        setTransaction(house.transactionType)
    }, [house, reset])

    const pick = ([nextLat, nextLng]: MapPosition) => {
        setValue('lat', nextLat, { shouldValidate: true, shouldDirty: true })
        setValue('lng', nextLng, { shouldValidate: true, shouldDirty: true })
    }

    const onSubmit = async (values: HouseFormValues) => {
        if (!house) return
        if (!transaction) return toast.error('نوع معامله را انتخاب کنید')
        const hasLocation = Number.isFinite(values.lat) && Number.isFinite(values.lng)
        try {
            await updateAdminHouse(house.id, {
                title: values.title.trim(),
                address: values.address.trim(),
                caption: values.caption.trim() || null,
                rate: values.rate,
                price: values.price,
                discounted_price: Number.isFinite(values.discountedPrice) ? values.discountedPrice : null,
                photos: house.photos,
                tags: splitTags(values.tags),
                last_updated: new Date().toISOString(),
                capacity: values.capacity,
                ...(hasLocation ? { location: { lat: values.lat, lng: values.lng } } : {}),
                categories: { name: values.category.trim() },
                bathrooms: values.bathrooms,
                parking: values.parking,
                rooms: values.rooms,
                yard_type: values.yardType.trim(),
                num_comments: house.comments,
                transaction_type: transaction,
            })
            toast.success('ملک با موفقیت ویرایش شد')
            onSaved()
            onClose()
        } catch (e) {
            toast.error(getErrorMessage(e, 'ویرایش ملک با خطا مواجه شد'))
        }
    }

    return (
        <Modal open={!!house} onClose={onClose} title='ویرایش ملک' className='max-w-2xl'>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col gap-4'>
                <div className='grid gap-4 sm:grid-cols-2'>
                    <FieldBox title='عنوان' error={errors.title?.message}>
                        <input className={fieldInput} {...register('title', textRules('عنوان', 3, 100))} />
                    </FieldBox>
                    <FieldBox title='نوع ملک ( دسته بندی )' error={errors.category?.message}>
                        <input dir='ltr' className={`${fieldInput} text-right`} {...register('category', textRules('نوع ملک', 2, 50))} />
                    </FieldBox>
                </div>

                <FieldBox title='آدرس' error={errors.address?.message}>
                    <input className={fieldInput} {...register('address', textRules('آدرس', 5, 200))} />
                </FieldBox>

                <FieldBox title='توضیحات' error={errors.caption?.message}>
                    <textarea rows={3} className={`${fieldInput} resize-none leading-6`} {...register('caption', captionRules)} />
                </FieldBox>

                <div className='grid gap-4 sm:grid-cols-2'>
                    <FilterSelect
                        label='نوع معامله'
                        value={transaction}
                        options={transactionOptions}
                        onChange={setTransaction}
                        allowAll={false}
                        className='w-full'
                    />
                    <FieldBox title='نوع حیاط'>
                        <input className={fieldInput} {...register('yardType')} />
                    </FieldBox>
                </div>

                <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
                    {numberFields.map((field) => (
                        <FieldBox key={field.name} title={field.label} error={errors[field.name]?.message}>
                            <input type='number' step='any' dir='ltr' className={`${fieldInput} text-right`} {...register(field.name, numberRules(field))} />
                        </FieldBox>
                    ))}
                </div>

                <div className='flex flex-col gap-2'>
                    <span className='px-1 text-[11px] text-[#8A8997]'>برای انتخاب موقعیت ملک روی نقشه کلیک کنید</span>
                    <MapPicker value={Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null} onChange={pick} className='h-64' />
                </div>

                <FieldBox title='برچسب ها ( با ویرگول جدا کنید )' error={errors.tags?.message}>
                    <input className={fieldInput} {...register('tags', tagsRules)} />
                </FieldBox>

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

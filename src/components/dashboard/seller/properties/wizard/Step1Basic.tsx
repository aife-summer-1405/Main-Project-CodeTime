import { propertyTypeOptions, subTypeOptions } from '@/lib/dashboard/seller-data'
import { transactionOptions } from '@/lib/dashboard/sellerHousesApi'
import { RateField, SelectField, TextArea, TextField } from './Inputs'
import { getDiscountError } from './discount'
import type { StepProps } from './types'

export default function Step1Basic({ form, errors, update }: StepProps) {
    const hasType = !form.propertyType || propertyTypeOptions.some((o) => o.value === form.propertyType)
    const typeOptions = hasType
        ? propertyTypeOptions
        : [...propertyTypeOptions, { label: form.propertyType, value: form.propertyType }]

    const discountError = getDiscountError(form.price, form.discountedPrice)

    return (
        <div className='flex flex-col gap-4'>
            <div className='grid gap-4 md:grid-cols-3'>
                <TextField label='نام آپارتمان مورد نظر ....' value={form.title} onChange={(title) => update({ title })} error={errors.title} />
                <TextField
                    label='ظرفیت ( نفر )'
                    type='number'
                    value={form.capacity}
                    onChange={(capacity) => update({ capacity })}
                    error={errors.capacity}
                />
                <TextField
                    label='قیمت اصلی ( تومان )'
                    type='number'
                    value={form.price}
                    onChange={(price) => update({ price })}
                    error={errors.price}
                />
                <TextField
                    label='قیمت با تخفیف ( تومان )'
                    type='number'
                    value={form.discountedPrice}
                    onChange={(discountedPrice) => update({ discountedPrice })}
                    error={discountError}
                />
                <SelectField
                    label='نوع معامله'
                    value={form.dealType}
                    options={transactionOptions}
                    onChange={(dealType) => update({ dealType })}
                    error={errors.dealType}
                />
                <SelectField
                    label='نوع ملک'
                    value={form.propertyType}
                    options={typeOptions}
                    onChange={(propertyType) => update({ propertyType })}
                    error={errors.propertyType}
                />
                <SelectField
                    label='زیرنوع ملک'
                    value={form.subType}
                    options={subTypeOptions}
                    onChange={(subType) => update({ subType })}
                    error={errors.subType}
                />
                <RateField label='امتیاز ( ۰ تا ۵ )' value={form.rate} onChange={(rate) => update({ rate })} />
            </div>
            <TextArea label='توضیحات ملک' value={form.description} onChange={(description) => update({ description })} />
        </div>
    )
}
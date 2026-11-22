import { countOptions, tagOptions, yardOptions } from '@/lib/dashboard/seller-data'
import { MultiSelect, SelectField } from './Inputs'
import type { StepProps } from './types'

export default function Step3Amenities({ form, errors, update }: StepProps) {
    return (
        <div className='grid gap-4 md:grid-cols-3'>
            <SelectField label='تعداد اتاق' value={form.rooms} options={countOptions} onChange={(rooms) => update({ rooms })} error={errors.rooms} />
            <SelectField
                label='تعداد حمام'
                value={form.bathrooms}
                options={countOptions}
                onChange={(bathrooms) => update({ bathrooms })}
                error={errors.bathrooms}
            />
            <SelectField label='تعداد پارکینگ' value={form.parking} options={countOptions} onChange={(parking) => update({ parking })} />
            <SelectField label='نوع حیاط' value={form.yard} options={yardOptions} onChange={(yard) => update({ yard })} />
            <div className='md:col-span-2'>
                <MultiSelect label='برچسب ها' values={form.tags} options={tagOptions} onChange={(tags) => update({ tags })} />
            </div>
        </div>
    )
}

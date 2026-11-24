import { fa } from '@/lib/format'
import { getDiscountError } from '../../seller/properties/wizard/discount'

export type HouseFormValues = {
    title: string
    address: string
    caption: string
    category: string
    yardType: string
    tags: string
    price: number
    discountedPrice: number
    rate: number
    capacity: number
    rooms: number
    bathrooms: number
    parking: number
    lat: number
    lng: number
}

export type NumberFieldName = 'price' | 'discountedPrice' | 'rate' | 'capacity' | 'rooms' | 'bathrooms' | 'parking' | 'lat' | 'lng'

export type NumberFieldConfig = {
    name: NumberFieldName
    label: string
    min?: number
    max?: number
    integer?: boolean
    required?: boolean
}

export const MAX_TAGS = 10
const MAX_TAG_LENGTH = 30

export const numberFields: NumberFieldConfig[] = [
    { name: 'price', label: 'قیمت ( تومان )', min: 1, integer: true, required: true },
    { name: 'discountedPrice', label: 'قیمت با تخفیف ( تومان )', min: 1, integer: true },
    { name: 'rate', label: 'امتیاز ( ۱ تا ۵ )', min: 1, max: 5, required: true },
    { name: 'capacity', label: 'ظرفیت ( نفر )', min: 1, integer: true, required: true },
    { name: 'rooms', label: 'تعداد اتاق', min: 0, integer: true, required: true },
    { name: 'bathrooms', label: 'تعداد حمام', min: 0, integer: true, required: true },
    { name: 'parking', label: 'تعداد پارکینگ', min: 0, integer: true, required: true },
    { name: 'lat', label: 'عرض جغرافیایی', min: -90, max: 90 },
    { name: 'lng', label: 'طول جغرافیایی', min: -180, max: 180 },
]

export const splitTags = (value: string) =>
    value
        .split(/[,،]/)
        .map((tag) => tag.trim())
        .filter(Boolean)

export const textRules = (label: string, min: number, max: number) => ({
    required: `${label} را وارد کنید`,
    validate: (value: string) => value.trim().length >= min || `${label} باید حداقل ${fa(min)} کاراکتر باشد`,
    maxLength: { value: max, message: `${label} نباید بیشتر از ${fa(max)} کاراکتر باشد` },
})

export const captionRules = {
    maxLength: { value: 1000, message: `توضیحات نباید بیشتر از ${fa(1000)} کاراکتر باشد` },
}

export const tagsRules = {
    validate: (value: string) => {
        const tags = splitTags(value)
        if (tags.length > MAX_TAGS) return `حداکثر ${fa(MAX_TAGS)} برچسب مجاز است`
        if (tags.some((tag) => tag.length > MAX_TAG_LENGTH)) return `هر برچسب حداکثر ${fa(MAX_TAG_LENGTH)} کاراکتر باشد`
        return true
    },
}

export const numberRules = ({ min, max, integer, required, name }: NumberFieldConfig) => ({
    valueAsNumber: true as const,
    ...(required ? { required: 'این فیلد الزامی است' } : {}),
    ...(min !== undefined ? { min: { value: min, message: `مقدار باید حداقل ${fa(min)} باشد` } } : {}),
    ...(max !== undefined ? { max: { value: max, message: `مقدار باید حداکثر ${fa(max)} باشد` } } : {}),
    validate: {
        integer: (value: number) => !integer || !Number.isFinite(value) || Number.isInteger(value) || 'مقدار باید عدد صحیح باشد',
        ...(name === 'discountedPrice'
            ? {
                  discount: (value: number, form: HouseFormValues) =>
                      !Number.isFinite(value) || (getDiscountError(String(form.price), String(value)) ?? true),
              }
            : {}),
        ...(name === 'lat' || name === 'lng'
            ? {
                  coordinates: (value: number, form: HouseFormValues) => {
                      const other = name === 'lat' ? form.lng : form.lat
                      if (Number.isFinite(value) || !Number.isFinite(other)) return true
                      return name === 'lat' ? 'عرض جغرافیایی را هم وارد کنید' : 'طول جغرافیایی را هم وارد کنید'
                  },
              }
            : {}),
    },
    ...(name === 'price' ? { deps: ['discountedPrice' as const] } : {}),
    ...(name === 'lat' ? { deps: ['lng' as const] } : {}),
    ...(name === 'lng' ? { deps: ['lat' as const] } : {}),
})

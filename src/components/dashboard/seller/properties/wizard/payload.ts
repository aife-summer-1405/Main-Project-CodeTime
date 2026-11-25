import { transactionKey } from '@/lib/Api/dashboard/common/transactions'
import { type CreateHousePayload, type HouseDetail, type UpdateHousePayload } from '@/lib/Api/dashboard/seller/houses'
import { subTypeOptions } from '@/lib/dashboard/seller-data'
import { getDiscountError } from './discount'
import type { WizardForm } from './types'

const discountedValue = (form: WizardForm) => {
    const raw = String(form.discountedPrice ?? '').trim()
    if (!raw || getDiscountError(form.price, form.discountedPrice)) return null
    return String(Number(raw))
}

export const toCreatePayload = (form: WizardForm): CreateHousePayload => ({
    title: form.title.trim(),
    caption: form.description.trim(),
    address: form.address.trim(),
    price: String(Number(form.price)),
    discounted_price: discountedValue(form),
    capacity: Number(form.capacity),
    tags: form.tags,
    categories: { name: form.propertyType },
    rooms: Number(form.rooms),
    bathrooms: Number(form.bathrooms),
    parking: Number(form.parking || 0),
    transaction_type: transactionKey(form.dealType),
    ...(form.rate !== '' ? { rate: String(Number(form.rate)) } : {}),
    ...(form.yard ? { yard_type: form.yard } : {}),
    ...(form.lat !== null && form.lng !== null ? { location: { lat: form.lat, lng: form.lng } } : {}),
})

const orderedImages = (form: WizardForm) => {
    const main = form.images.find((i) => i.id === form.mainImage)
    const rest = form.images.filter((i) => i.id !== main?.id)
    return main ? [main, ...rest] : rest
}

export const orderedPhotoFiles = (form: WizardForm): File[] =>
    orderedImages(form).flatMap((i) => (i.file ? [i.file] : []))

export const toUpdatePayload = (form: WizardForm): UpdateHousePayload => ({
    ...toCreatePayload(form),
    photos: orderedImages(form)
        .filter((i) => !i.file)
        .map((i) => i.url),
})

export const toForm = (house: HouseDetail): WizardForm => {
    const photos = house.photos ?? []

    return {
        title: house.title,
        capacity: house.capacity ? String(house.capacity) : '',
        price: String(Number(house.price)),
        discountedPrice: house.discounted_price ? String(Number(house.discounted_price)) : '',
        rate: house.rate ? String(Number(house.rate)) : '',
        dealType: transactionKey(house.transaction_type),
        propertyType: house.categories?.name ?? '',
        subType: subTypeOptions[0].value,
        description: house.caption ?? '',
        address: house.address,
        lat: house.location?.lat ?? null,
        lng: house.location?.lng ?? null,
        rooms: house.rooms ? String(house.rooms) : '',
        bathrooms: house.bathrooms ? String(house.bathrooms) : '',
        parking: house.parking ? String(house.parking) : '',
        yard: house.yard_type ?? '',
        tags: house.tags ?? [],
        images: photos.map((url) => ({ id: url, url, file: null })),
        mainImage: photos[0] ?? null,
    }
}
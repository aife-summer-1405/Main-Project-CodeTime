export type WizardImage = { id: string; url: string; file: File | null }

export type WizardForm = {
    title: string
    capacity: string
    price: string
    rate: string
    dealType: string
    propertyType: string
    subType: string
    description: string
    address: string
    lat: number | null
    lng: number | null
    rooms: string
    bathrooms: string
    parking: string
    yard: string
    tags: string[]
    images: WizardImage[]
    mainImage: string | null
    discountedPrice: string
}

export const emptyForm: WizardForm = {
    title: '',
    capacity: '',
    price: '',
    discountedPrice: '',
    rate: '',
    dealType: '',
    propertyType: '',
    subType: '',
    description: '',
    address: '',
    lat: null,
    lng: null,
    rooms: '',
    bathrooms: '',
    parking: '',
    yard: '',
    tags: [],
    images: [],
    mainImage: null,
}

export type StepErrors = Partial<Record<keyof WizardForm, string>>

export type StepProps = {
    form: WizardForm
    errors: StepErrors
    update: (patch: Partial<WizardForm>) => void
}

const required = 'این فیلد اجباری است'

export const validateStep = (step: number, form: WizardForm): StepErrors => {
    const errors: StepErrors = {}

    if (step === 0) {
        if (!form.title.trim()) errors.title = required
        if (!Number(form.capacity)) errors.capacity = required
        if (!Number(form.price)) errors.price = required
        if (!form.dealType) errors.dealType = required
        if (!form.propertyType) errors.propertyType = required
        if (!form.subType) errors.subType = required
    }
    if (step === 1 && !form.address.trim()) errors.address = 'نشانی ملک را وارد کنید'
    if (step === 2) {
        if (!form.rooms) errors.rooms = required
        if (!form.bathrooms) errors.bathrooms = required
    }
    if (step === 3 && form.images.length === 0) errors.images = 'حداقل یک تصویر اضافه کنید'

    return errors
}
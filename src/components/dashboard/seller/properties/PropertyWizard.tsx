'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/dashboard/dashboardApi'
import {
    createSellerHouse,
    getSellerHouse,
    updateSellerHouse,
    uploadHousePhotos,
} from '@/lib/dashboard/sellerHousesApi'
import PageTitle from '../../common/PageTitle'
import WizardStepper, { wizardSteps } from './wizard/WizardStepper'
import Step1Basic from './wizard/Step1Basic'
import Step2Address from './wizard/Step2Address'
import Step3Amenities from './wizard/Step3Amenities'
import Step4Images from './wizard/Step4Images'
import Step5Review from './wizard/Step5Review'
import { orderedPhotoFiles, toCreatePayload, toForm, toUpdatePayload } from './wizard/payload'
import { emptyForm, validateStep, type StepErrors, type WizardForm } from './wizard/types'

const primary =
    'flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#10088F] px-8 text-sm text-white transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#0087CA]'
const secondary =
    'flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#10088F] px-8 text-sm text-[#10088F] transition active:scale-[0.95] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#38A9E0] dark:text-[#38A9E0]'

export default function PropertyWizard({ houseId }: { houseId?: string }) {
    const router = useRouter()
    const editing = !!houseId

    const [form, setForm] = useState<WizardForm>(emptyForm)
    const [step, setStep] = useState(0)
    const [errors, setErrors] = useState<StepErrors>({})
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(editing)

    const createdId = useRef<string | null>(null)

    useEffect(() => {
        if (!houseId) return

        getSellerHouse(houseId)
            .then((house) => setForm(toForm(house)))
            .catch((e) => {
                toast.error(getErrorMessage(e, 'دریافت اطلاعات ملک انجام نشد'))
                router.push('/dashboard/properties')
            })
            .finally(() => setLoading(false))
    }, [houseId, router])

    const update = (patch: Partial<WizardForm>) => {
        setForm((f) => ({ ...f, ...patch }))
        setErrors((e) => {
            const next = { ...e }
            Object.keys(patch).forEach((key) => delete next[key as keyof WizardForm])
            return next
        })
    }

    const next = () => {
        const found = validateStep(step, form)
        setErrors(found)
        if (Object.keys(found).length) return toast.error('لطفا فیلدهای اجباری را تکمیل کنید')
        setStep((s) => s + 1)
    }

    const back = () => {
        setErrors({})
        setStep((s) => s - 1)
    }

    const submit = async () => {
        if (submitting) return
        setSubmitting(true)
        try {
            let id = houseId ?? createdId.current

            try {
                if (houseId) {
                    await updateSellerHouse(houseId, toUpdatePayload(form))
                } else if (!id) {
                    id = await createSellerHouse(toCreatePayload(form))
                    createdId.current = id
                }
            } catch (e) {
                toast.error(getErrorMessage(e, editing ? 'ویرایش ملک انجام نشد' : 'ثبت ملک انجام نشد'))
                return
            }

            const files = orderedPhotoFiles(form)
            if (id && files.length) {
                try {
                    await uploadHousePhotos(id, files)
                } catch (e) {
                    toast.error(getErrorMessage(e, 'ملک ذخیره شد ولی آپلود تصاویر انجام نشد، دوباره تلاش کنید'))
                    return
                }
            }

            toast.success(editing ? 'تغییرات ملک ذخیره شد' : 'آگهی ملک ثبت شد')
            router.push('/dashboard/properties')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className='flex min-w-0 flex-col gap-5'>
                <PageTitle>مدیریت املاک</PageTitle>
                <div className='h-14 animate-pulse rounded-2xl bg-[#E5E5E5] dark:bg-[#1C1C1C]' />
                <div className='h-72 animate-pulse rounded-2xl bg-[#E5E5E5] dark:bg-[#1C1C1C]' />
            </div>
        )
    }

    const props = { form, errors, update }
    const last = step === wizardSteps.length - 1

    return (
        <div className='flex min-w-0 flex-col gap-5'>
            <PageTitle>مدیریت املاک</PageTitle>

            <div className='flex flex-wrap items-center justify-between gap-2'>
                <h2 className='text-sm font-bold text-[#060425] dark:text-white'>
                    {editing ? 'ویرایش آگهی ملک' : 'ساخت آگهی ملک جدید'}
                </h2>
                <Link href='/dashboard/properties' className='flex items-center gap-1 text-[11px] text-[#0087CA] underline'>
                    <ChevronRight size={13} />
                    لیست املاک من
                </Link>
            </div>

            <WizardStepper current={step} />

            <section className='min-w-0 py-2'>
                {step === 0 && <Step1Basic {...props} />}
                {step === 1 && <Step2Address {...props} />}
                {step === 2 && <Step3Amenities {...props} />}
                {step === 3 && <Step4Images {...props} />}
                {step === 4 && <>
                    <div className='w-full h-full flex justify-center items-center'>
                        <Step5Review form={form} />
                    </div>
                </>}
            </section>

            <div className='flex flex-wrap items-center justify-start gap-3'>
                {step > 0 && (
                    <button type='button' onClick={back} disabled={submitting} className={secondary}>
                        <ChevronRight size={16} />
                        مرحله قبل
                    </button>
                )}
                {last ? (
                    <button type='button' onClick={submit} disabled={submitting} className={primary}>
                        <Check size={16} />
                        {submitting ? 'در حال ذخیره...' : editing ? 'ذخیره تغییرات' : 'ثبت آگهی'}
                    </button>
                ) : (
                    <button type='button' onClick={next} className={primary}>
                        مرحله بعد
                        <ChevronLeft size={16} />
                    </button>
                )}
            </div>
        </div>
    )
}

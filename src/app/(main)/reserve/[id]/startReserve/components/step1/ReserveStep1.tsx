'use client'
import type { Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { CalendarDays, Mail, Plus } from 'lucide-react'
import { contactSchema, passengerSchema, type ContactFormData, type PassengerFormData } from '@/lib/schemas/reserve'
import { faNum, toEnDigits, toFaDigits } from '@/lib/utils/reserve'
import { Passenger, ReserveStepName } from '../../types/types'
import FormSection from '../FormSection'
import { DateField, SelectField, TextField } from '../Fields'

interface IStep {
    guests: number
    total: number
    passengers: Passenger[]
    setPassengers: Dispatch<SetStateAction<Passenger[]>>
    contact: ContactFormData | null
    setContact: (contact: ContactFormData) => void
    setStep: (step: ReserveStepName) => void
}

const genders = [
    { value: 'male', label: 'مرد' },
    { value: 'female', label: 'زن' },
]

const emptyPassenger = { nationalId: '', fullName: '', gender: '', birthDate: '' }

const Divider = () => (
    <div className='my-2 flex w-full items-center justify-center sm:my-3.5'>
        <div className='h-0.5 w-[90%] bg-[linear-gradient(90deg,#F5F5F5,#060425,#F5F5F5)] opacity-50' />
    </div>
)

const ReserveStep1 = ({ guests, total, passengers, setPassengers, contact, setContact, setStep }: IStep) => {
    const passengerForm = useForm<PassengerFormData>({
        resolver: zodResolver(passengerSchema),
        mode: 'onTouched',
        defaultValues: emptyPassenger,
    })
    const contactForm = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: 'onTouched',
        defaultValues: contact ?? { email: '', phone: '' },
    })

    const { errors } = passengerForm.formState
    const currentPassenger = Math.min(passengers.length + 1, guests)
    const remaining = guests - passengers.length

    const addPassenger = passengerForm.handleSubmit((values) => {
        const nationalId = toEnDigits(values.nationalId.trim())

        if (passengers.length >= guests) {
            toast.error(`حداکثر ${faNum(guests)} مسافر می‌توانید اضافه کنید`)
            return
        }
        if (passengers.some((p) => p.nationalId === nationalId)) {
            toast.error('این مسافر قبلاً اضافه شده است')
            return
        }

        setPassengers((prev) => [
            ...prev,
            { id: String(Date.now()), ...values, nationalId, gender: values.gender as Passenger['gender'] },
        ])
        passengerForm.reset(emptyPassenger)
        toast.success('مسافر اضافه شد')
    })

    const removePassenger = (id: string) => {
        setPassengers((prev) => prev.filter((x) => x.id !== id))
        toast.success('مسافر حذف شد')
    }

    const goNext = () => {
        if (remaining > 0) {
            toast.error(`باید اطلاعات ${faNum(guests)} مسافر را وارد کنید (${faNum(remaining)} مسافر باقی مانده)`)
            return
        }
        if (!contact) {
            toast.error('اطلاعات تماس را ثبت کنید')
            return
        }
        setStep('step2')
    }

    const saveContact = contactForm.handleSubmit((values) => {
        setContact(values)
        toast.success('اطلاعات ثبت شد')
    })

    return (
        <div className='flex w-full min-w-0 flex-col gap-5 sm:gap-6'>
            <FormSection title={`مسافران انتخاب شده ( ${faNum(passengers.length)} از ${faNum(guests)} )`}>
                {passengers.length === 0 ? (
                    <p className='rounded-xl py-4 text-center text-sm font-medium text-[#060425CC] dark:text-white-1 sm:py-5 sm:text-[15px]'>
                        هنوز مسافری انتخاب نکردید
                    </p>
                ) : (
                    <ul className='flex flex-col gap-2'>
                        {passengers.map((p) => (
                            <li
                                key={p.id}
                                className='flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl border-2 border-[#0887CAB2] px-3 py-3 text-sm text-[#060425] dark:text-white-1 sm:px-4'
                            >
                                <span className='min-w-0 max-w-full flex-1 basis-full truncate font-bold sm:basis-auto'>
                                    {p.fullName}
                                </span>
                                
                                <button
                                    type='button'
                                    onClick={() => removePassenger(p.id)}
                                    className='cursor-pointer text-red-500'
                                >
                                    حذف
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </FormSection>

            <FormSection title={`مشخصات مسافر ${faNum(currentPassenger)} از ${faNum(guests)}`}>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'>
                    <TextField
                        id='fullName'
                        label='نام و نام خانوادگی'
                        error={errors.fullName?.message}
                        {...passengerForm.register('fullName')}
                    />
                    <TextField
                        id='nationalId'
                        label='کد ملی'
                        inputMode='numeric'
                        maxLength={10}
                        error={errors.nationalId?.message}
                        {...passengerForm.register('nationalId')}
                    />
                    <Controller
                        control={passengerForm.control}
                        name='birthDate'
                        render={({ field }) => (
                            <DateField
                                label='تاریخ تولد'
                                icon={<CalendarDays size={20} />}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.birthDate?.message}
                            />
                        )}
                    />
                    <Controller
                        control={passengerForm.control}
                        name='gender'
                        render={({ field }) => (
                            <SelectField
                                label='جنسیت'
                                options={genders}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.gender?.message}
                            />
                        )}
                    />
                </div>

                <Divider />

                <button
                    type='button'
                    onClick={addPassenger}
                    className='flex h-12 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[16px] border-2 border-[#10088F] text-sm font-medium text-[#10088F] transition-all duration-300 active:scale-[0.97] dark:border-white-1 dark:text-white-1 sm:h-13'
                >
                    <Plus size={20} />
                    <span>افزودن مسافر جدید</span>
                </button>

                <Divider />
            </FormSection>

            <FormSection title='ارسال بلیط به دیگران'>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'>
                    <TextField
                        id='contactEmail'
                        label='ایمیل'
                        icon={<Mail size={20} />}
                        type='email'
                        autoComplete='email'
                        error={contactForm.formState.errors.email?.message}
                        {...contactForm.register('email')}
                    />
                    <TextField
                        id='contactPhone'
                        label='شماره تماس'
                        icon={<img src='/images/Icon.png' alt='' className='h-5 w-5 object-contain' />}
                        type='tel'
                        inputMode='numeric'
                        error={contactForm.formState.errors.phone?.message}
                        {...contactForm.register('phone')}
                    />
                </div>

                <button
                    type='button'
                    onClick={saveContact}
                    className='h-12 w-full cursor-pointer rounded-2xl bg-[#15977D] text-sm font-medium text-white transition-all duration-300 active:scale-[0.97] sm:h-13'
                >
                    ثبت اطلاعات
                </button>
            </FormSection>

            <hr className='border-[#E0E0E0]' />

            <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='text-sm font-medium text-[#060425] dark:text-white-1'>قیمت بلیط</span>
                <span className='text-sm font-bold text-[#0A7FD6] sm:text-base'>{faNum(total)} تومان</span>
            </div>

            <button
                type='button'
                onClick={goNext}
                className='h-12 w-full cursor-pointer rounded-2xl bg-[#10088F] text-sm font-medium text-white transition-all duration-300 active:scale-[0.97] sm:h-13'
            >
                تایید و ادامه فرآیند
            </button>
        </div>
    )
}

export default ReserveStep1
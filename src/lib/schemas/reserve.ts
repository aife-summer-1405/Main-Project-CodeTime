import { z } from 'zod'
import { toEnDigits } from '@/lib/utils/reserve'

export const passengerSchema = z.object({
    nationalId: z
        .string()
        .min(1, 'کد ملی را وارد کنید')
        .refine((v) => /^\d{10}$/.test(toEnDigits(v.trim())), 'کد ملی باید ۱۰ رقم باشد'),
    fullName: z.string().trim().min(3, 'نام و نام خانوادگی را وارد کنید'),
    gender: z.string().min(1, 'جنسیت را انتخاب کنید'),
    birthDate: z.string().min(1, 'تاریخ تولد را انتخاب کنید'),
})
export type PassengerFormData = z.infer<typeof passengerSchema>

export const contactSchema = z.object({
    email: z.string().trim().email('ایمیل معتبر نیست'),
    phone: z.string().refine((v) => /^09\d{9}$/.test(toEnDigits(v.trim())), 'شماره تماس معتبر نیست'),
})
export type ContactFormData = z.infer<typeof contactSchema>
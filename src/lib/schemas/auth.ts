import z from 'zod'
//login
export const loginSchema = z.object({
    email: z.string().min(1, 'ایمیل را وارد کنید').email('ایمیل معتبر نیست'),
    password: z.string().min(1, 'رمز عبور را وارد کنید'),
})

export type LoginFormData = z.infer<typeof loginSchema>

//register step1
export const registerStep1Schema = z.object({
    email: z.string().min(1, 'ایمیل را وارد کنید').email('ایمیل معتبر نیست'),
})

export type RegisterStep1FormData = z.infer<typeof registerStep1Schema>

//register step2
export const registerStep2Schema = z.object({
    verificationCode: z
        .string()
        .min(1, 'کد تایید را وارد کنید')
        .regex(/^\d+$/, 'کد تایید فقط شامل عدد است'),
})

export type RegisterStep2FormData = z.infer<typeof registerStep2Schema>

//register step3
export const registerStep3Schema = z.object({
    phoneNumber: z
        .string()
        .min(1, 'شماره تماس را وارد کنید')
        .regex(/^09\d{9}$/, 'شماره تماس معتبر نیست (مثال: 09123456789)'),
    password: z
        .string()
        .min(1, 'رمز عبور را وارد کنید')
        .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
})

export type RegisterStep3FormData = z.infer<typeof registerStep3Schema>

//forgot password step1
export const forgotStep1Schema = z.object({
    email: z.string().min(1, 'ایمیل را وارد کنید').email('ایمیل معتبر نیست'),
})
export type ForgotStep1FormData = z.infer<typeof forgotStep1Schema>

//forgot password step2
export const forgotStep2Schema = z.object({
    code: z
        .string()
        .min(1, 'کد تایید را وارد کنید')
        .regex(/^\d+$/, 'کد تایید فقط شامل عدد است'),
})
export type ForgotStep2FormData = z.infer<typeof forgotStep2Schema>

//forgot password step3
export const forgotStep3Schema = z
    .object({
        newPassword: z
            .string()
            .min(1, 'رمز عبور را وارد کنید')
            .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
        confirmPassword: z.string().min(1, 'تکرار رمز عبور را وارد کنید'),
    })
    .refine((v) => v.newPassword === v.confirmPassword, {
        message: 'رمز عبور و تکرار آن یکسان نیست',
        path: ['confirmPassword'],
    })
export type ForgotStep3FormData = z.infer<typeof forgotStep3Schema>

//register (phone) step1
export const registerPhoneStep1Schema = z.object({
    phoneNumber: z
        .string()
        .min(1, 'شماره تماس را وارد کنید')
        .regex(/^09\d{9}$/, 'شماره تماس معتبر نیست (مثال: 09123456789)'),
})
export type RegisterPhoneStep1FormData = z.infer<typeof registerPhoneStep1Schema>


//register (phone) step3
export const registerPhoneStep3Schema = z.object({
    password: z
        .string()
        .min(1, 'رمز عبور را وارد کنید')
        .min(8, 'رمز عبور باید حداقل ۸ کاراکتر باشد'),
})
export type RegisterPhoneStep3FormData = z.infer<typeof registerPhoneStep3Schema>
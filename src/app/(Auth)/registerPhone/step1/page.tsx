'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'
import AuthFloatingMenu from '../../login/popMenu/PopMenu'
import { registerPhoneStep1Schema, RegisterPhoneStep1FormData } from '@/lib/schemas/auth'
import { startRegisterPhone } from '@/lib/Api/authApi'
import { RegisterPhoneStepName } from '../types/types'
import GoogleButton from '@/components/auth/GoogleButton'

interface IStep {
    setStep: (step: RegisterPhoneStepName) => void
    setTempUserId: (id: string) => void
    setPhoneNumber: (phone: string) => void
}

export default function RegisterPhoneStep1({ setStep, setTempUserId, setPhoneNumber }: IStep) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterPhoneStep1FormData>({
        resolver: zodResolver(registerPhoneStep1Schema),
    })

    const onSubmit = async (values: RegisterPhoneStep1FormData) => {
        try {
            const { data } = await startRegisterPhone(values)

            setTempUserId(String(data.tempUserId))
            setPhoneNumber(values.phoneNumber)

            toast.success('کد تایید به شماره شما ارسال شد')
            setStep('step2')
        } catch (err) {
            const apiMessage = isAxiosError(err) ? err.response?.data?.message : undefined
            if(apiMessage==='This phone number is already registered'){
                toast.error('این شماره قبلا ثبت نام کرده است')
            }
            else{
                toast.error(
                typeof apiMessage === 'string'
                    ? apiMessage
                    : 'خطایی رخ داد، دوباره تلاش کنید'
            )
            }
        }
    }

    return (
        <div className="relative flex-1 min-w-0 xl:h-full flex flex-col">
            <div className="relative w-full h-[72px] shrink-0">
                <div className="absolute left-5 top-0 md:left-35 xl:left-20 xl:top-7 z-50 flex h-10 w-10">
                    <AuthFloatingMenu />
                </div>
                <img
                    src="/images/vec (2).svg"
                    alt="بازگشت به صفحه اصلی"
                    className="hidden xl:block absolute left-[150px] top-5 h-[140px] object-cover pointer-events-none"
                />
            </div>

            <div className="relative flex-1 flex flex-col xl:flex-row items-center justify-center px-4 md:px-0 pb-8 xl:pb-0 xl:pl-[100px]">
                <ol className="flex flex-row xl:flex-col items-start xl:items-center justify-center mb-8 xl:mb-0 xl:absolute xl:left-6 xl:top-[42%] xl:-translate-y-1/2">
                    <li className="flex flex-col xl:flex-col items-center">
                        <img src="/images/one (1).svg" alt="" className="h-9 w-9 xl:h-11 xl:w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#10088F] dark:text-white-1 font-bold">شماره تماس</span>
                        <span className="hidden xl:block my-2 h-10 border-l-2 border-dotted border-[#10088F]" />
                    </li>
                    <span className="xl:hidden mt-4 mx-2 w-8 sm:w-14 border-t-2 border-dotted border-[#10088F]" />
                    <li className="flex flex-col items-center">
                        <img src="/images/Two.svg" alt="" className="h-9 w-9 xl:h-11 xl:w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#777]">کد تایید</span>
                        <span className="hidden xl:block my-2 h-10 border-l-2 border-dotted border-[#7777778d]" />
                    </li>
                    <span className="xl:hidden mt-4 mx-2 w-8 sm:w-14 border-t-2 border-dotted border-[#7777778d]" />
                    <li className="flex flex-col items-center">
                        <img src="/images/Three.svg" alt="" className="h-9 w-9 xl:h-11 xl:w-11" />
                        <span className="mt-1.5 text-[11px] whitespace-nowrap text-[#777]">رمز عبور</span>
                    </li>
                </ol>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="w-full max-w-[520px] xl:shrink-0 flex flex-col items-center xl:-mt-8"
                >
                    <p className="text-[#060425] font-bold dark:text-white-1 text-[14px] md:text-[16px]">خوش آمدید :)</p>
                    <h1 className="text-[#060425] font-bold mt-2.5 dark:text-white-1 text-[18px] md:text-[20px]">ایجاد حساب کاربری</h1>

                    {/* Google */}
                    <GoogleButton />

                    <div className="w-full flex justify-center items-center py-3 mt-3">
                        <i className="w-full border-t-2 border-[#7777778d] dark:border-blue-3" />
                        <p className="text-[#0887CA] dark:text-blue-3 px-1.5">یا</p>
                        <i className="w-full border-t-2 border-[#7777778d] dark:border-blue-3" />
                    </div>

                    {/* phone */}
                    <div className="w-full mt-3">
                        <div className="relative cursor-pointer w-full">
                            <input
                                type="tel"
                                id="phoneNumber"
                                dir="rtl"
                                inputMode="numeric"
                                placeholder=" "
                                autoComplete="tel"
                                {...register('phoneNumber')}
                                className="peer w-full dark:text-black-1 relative pr-3.5 pl-11 h-14 rounded-[16px] border-2 border-[#0887CAB2] dark:bg-white-1 bg-transparent px-4 pt-3 pb-1 outline-none"
                            />
                            <img className="absolute left-[13px] top-[17px] h-6" src="/images/mobile.svg" alt="" />
                            <label
                                htmlFor="phoneNumber"
                                className="absolute right-4 top-[18px] -translate-y-1/6 cursor-text px-1 dark:bg-white-1 text-[#0887CAB2] transition-all duration-200
                            peer-focus:top-[10px] peer-focus:translate-y-[-50%] peer-focus:text-xs
                            peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:text-xs
                            dark:bg-[#121212]"
                            >
                                شماره تماس
                            </label>
                        </div>
                        {errors.phoneNumber && (
                            <p className="mt-1.5 text-[12px] text-red-500">{errors.phoneNumber.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 flex justify-center items-center mt-6 md:mt-8 rounded-[16px] bg-[#10088F] active:scale-[0.97] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <p className="text-white font-medium text-[16px]">
                            {isSubmitting ? 'در حال ارسال...' : 'ارسال کد'}
                        </p>
                    </button>

                    <div className="w-full flex flex-wrap justify-center items-center mt-5 gap-2">
                        <p className="text-[#060425CC] font-medium text-sm dark:text-white-1">آیا حساب دارید؟</p>
                        <Link
                            href="/login"
                            className="text-[#10088F] dark:text-[#10088F] font-bold border-b border-[#10088F] text-[14px]"
                        >
                            ورود
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

'use client'

import { Button } from '@/components/ui/button'
import api from '@/lib/interceptor/api'
import { ChevronLeft, ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import 'leaflet/dist/leaflet.css'

const FAKE_HOUSES = Array.from({ length: 7 }, (_, i) => ({
    id: i,
    title: 'املاکی غزال بانو',
    city: 'مازندران، ساری، دوداب ...',
    image: '/images/k99.png',
}))

const CurvedSlider = ({ items = FAKE_HOUSES }: { items?: typeof FAKE_HOUSES }) => {
    const n = items.length
    const [active, setActive] = useState(0)
    const [paused, setPaused] = useState(false)
    const [spacing, setSpacing] = useState(185)

    const next = () => setActive((p) => (p + 1) % n)
    const prev = () => setActive((p) => (p - 1 + n) % n)

    useEffect(() => {
        const updateSpacing = () => {
            if (window.innerWidth < 480) setSpacing(105)
            else if (window.innerWidth < 768) setSpacing(130)
            else if (window.innerWidth < 1024) setSpacing(155)
            else setSpacing(185)
        }

        updateSpacing()
        window.addEventListener('resize', updateSpacing)

        return () => window.removeEventListener('resize', updateSpacing)
    }, [])

    useEffect(() => {
        if (paused || n <= 1) return
        const t = setInterval(next, 3000)
        return () => clearInterval(t)
    }, [paused, n])

    return (
        <div
            dir="ltr"
            className="relative mx-auto h-[260px] w-full overflow-hidden sm:h-[290px]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {items.map((item, i) => {
                let d = (i - active + n) % n
                if (d > n / 2) d -= n
                const abs = Math.abs(d)
                const hidden = abs > 3

                return (
                    <div
                        key={item.id}
                        onClick={() => setActive(i)}
                        className="absolute left-1/2 top-12 h-[155px] w-[150px] cursor-pointer overflow-hidden rounded-3xl shadow-[0_8px_24px_#06042526] transition-all duration-500 ease-out sm:h-[175px] sm:w-[175px] lg:h-[190px] lg:w-[200px]"
                        style={{
                            transform: `translateX(calc(-50% + ${d * spacing}px)) translateY(${-(abs * abs) * 9}px) scale(${1 - abs * 0.13})`,
                            opacity: hidden ? 0 : abs === 0 ? 1 : 0.75 - abs * 0.1,
                            zIndex: 10 - abs,
                            pointerEvents: hidden ? 'none' : 'auto',
                        }}
                    >
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />

                        <div
                            className={`absolute inset-0 transition-all duration-500 ${abs === 0
                                ? 'bg-gradient-to-t from-black/70 via-black/10 to-transparent'
                                : 'bg-white/30 backdrop-blur-[1px]'
                                }`}
                        />

                        {abs === 0 && (
                            <div dir="rtl" className="absolute inset-x-0 bottom-3 flex flex-col items-center gap-1 text-white">
                                <strong className="text-xs sm:text-sm">{item.title}</strong>
                                <span className="text-[10px] sm:text-[11px]">{item.city}</span>
                            </div>
                        )}
                    </div>
                )
            })}

            <button
                type="button"
                onClick={next}
                aria-label="بعدی"
                className="absolute  left-[calc(50%+62px)] top-[110px] z-20 flex justify-center items-center h-6 w-6 cursor-pointer place-items-center rounded-full bg-white text-sm text-[#060425] shadow-[0_0_6px_#0604254D] transition hover:bg-blue-50 dark:bg-[#252525] dark:hover:bg-[#333] sm:left-[calc(50%+72px)] lg:left-[calc(50%+88px)]"
            >
                <ChevronRight color="#10088F" size={17} />
            </button>

            <button
                type="button"
                onClick={prev}
                aria-label="قبلی"
                className="absolute left-[calc(50%+62px)] top-[142px] z-20 flex justify-center items-center h-6 w-6 cursor-pointer place-items-center rounded-full bg-white text-sm text-[#060425] shadow-[0_0_6px_#0604254D] transition hover:bg-blue-50 dark:bg-[#252525] dark:hover:bg-[#333] sm:left-[calc(50%+72px)] lg:left-[calc(50%+88px)]"
            >
                <ChevronLeft color="#10088F" size={17} />
            </button>
        </div>
    )
}

type FieldProps = {
    id: string
    label: string
    type?: string
    icon?: string
    error?: string
    textarea?: boolean
} & React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>

const FloatingField = React.forwardRef<any, FieldProps>(
    ({ id, label, type = 'text', icon, error, textarea, ...rest }, ref) => {
        const base =
            'peer relative w-full rounded-[16px] border-2 border-[#0887CAB2] bg-[#F5F5F5] px-4 pr-3.5 text-[#060425] outline-none dark:border-[#0887CA80]  dark:text-white'

        return (
            <div className="mt-3 w-full">
                <div className="relative w-full">
                    {textarea ? (
                        <textarea
                            id={id}
                            ref={ref}
                            placeholder=" "
                            rows={6}
                            className={`${base} resize-none pt-6 pb-2`}
                            {...(rest as any)}
                        />
                    ) : (
                        <input
                            id={id}
                            ref={ref}
                            type={type}
                            placeholder=" "
                            className={`${base} h-14 pt-3 pb-1 ${icon ? 'pl-11' : 'pl-4'}`}
                            {...rest}
                        />
                    )}

                    {icon && <img className="absolute left-[15px] top-[20px] h-4" src={icon} alt="" />}

                    <label
                        htmlFor={id}
                        className="absolute right-4 top-[18px] -translate-y-1/6 cursor-text  px-1 text-[#0887CAB2] transition-all duration-200 peer-focus:top-[10px] bg-transparent peer-focus:translate-y-[-50%] peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-[-50%] peer-[:not(:placeholder-shown)]:text-xs  "
                    >
                        {label}
                    </label>
                </div>

                {error && <p className="mt-1.5 text-[12px] text-red-500">{error}</p>}
            </div>
        )
    }
)

FloatingField.displayName = 'FloatingField'

type FormValues = { fullName: string; email: string; message: string }

const ContactForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>()

    const onSubmit = async (values: FormValues) => {
        try {
            await api.post('/api/contact-us', {
                title: values.email,
                message: values.message,
            })
            reset()
            toast.success('پیام شما ارسال شد')
        } catch {
            toast.error('خطا در ارسال پیام لطفا دوباره تلاش کنید')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-full flex-col items-center">
            <h4 className="mb-2 text-center text-[15px] font-bold leading-8 text-[#060425] dark:text-white">
                ما رو دریاب :)<br />
                پیام بفرست تا کمکت کنیم!
            </h4>

            <FloatingField
                id="fullName"
                label="نام و نام خانوادگی"
                error={errors.fullName?.message}
                {...register('fullName', { required: 'نام و نام خانوادگی را وارد کنید' })}
            />

            <FloatingField
                id="email"
                type="email"
                label="ایمیل"
                icon="/images/email.svg"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email', {
                    required: 'ایمیل را وارد کنید',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'ایمیل معتبر نیست' },
                })}
            />

            <FloatingField
                id="message"
                label="پیام شما"
                textarea
                error={errors.message?.message}
                {...register('message', { required: 'پیام خود را بنویسید' })}
            />

            <div className="relative mt-6 w-full md:mt-8">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative z-10 flex h-13 w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#10088F] text-[16px] font-medium text-white transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? 'در حال ارسال...' : 'ارسال درخواست شما'}
                </button>

                <img
                    src="/images/vector (5).svg"
                    alt=""
                    className="pointer-events-none absolute -left-24 bottom-0 z-0 hidden w-36 object-contain md:block lg:-left-28 lg:w-40"
                />
            </div>
        </form>
    )
}

const Map = () => {
    const mapRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let map: import('leaflet').Map | undefined
        let marker: import('leaflet').CircleMarker | undefined
        let tiles: import('leaflet').TileLayer | undefined
        let observer: MutationObserver | undefined
        let mounted = true

        const initializeMap = async () => {
            const L = await import('leaflet')

            if (!mounted || !mapRef.current) return

            const isDark = document.documentElement.classList.contains('dark')

            map = L.map(mapRef.current).setView([36.5633, 53.0601], 14)

            tiles = L.tileLayer(
                isDark
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution: '&copy; OpenStreetMap &copy; CARTO',
                }
            ).addTo(map)

            marker = L.circleMarker([36.5633, 53.0601], {
                radius: 9,
                color: '#0887CA',
                fillColor: '#0887CA',
                fillOpacity: 0.9,
                weight: 3,
            }).addTo(map)

            map.on('click', (e) => {
                marker?.setLatLng(e.latlng)
            })

            observer = new MutationObserver(() => {
                const dark = document.documentElement.classList.contains('dark')

                tiles?.setUrl(
                    dark
                        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                )
            })

            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            })
        }

        initializeMap()

        return () => {
            mounted = false
            observer?.disconnect()
            map?.remove()
        }
    }, [])

    return (
        <div className="h-[280px] w-full overflow-hidden rounded-[50px] rounded-tr-[4px] rounded-bl-[4px] border-4 border-white shadow-[0_0_12px_#0604252B] dark:border-[#242424] sm:h-[340px] lg:h-[100%]">
            <div ref={mapRef} className="h-full w-full" />
        </div>
    )
}

const ContactUs = () => {
    return (
        <div className="w-full  text-[#060425]  dark:text-white">
            <div className="relative flex w-full flex-col items-center gap-3.5 overflow-hidden  bg-gradient-to-t from-[#f5f5f5]/40 via-[#e3f2ff]/40 to-[#f5f5f5]/40 px-4 py-10 dark:border-white/10 dark:bg-none dark:bg-[#121212] sm:px-8 lg:px-24">
                <h1 className="text-center text-lg font-bold text-[#060425] dark:text-white sm:text-xl lg:text-[24px]">
                    حس خوبت رو به ما بسپار ، ما کنارتیم!!
                </h1>

                <p className="relative text-center text-xs font-bold leading-7 text-[#06042580] dark:text-gray-400 sm:text-sm lg:text-[16px]">
                    هر خونه ای یه حس خوب داره ، ما اینجا هستیم تا کمکت کنیم حس خوبت رو پیدا کنی !! بیا با هم سفر جستجوی خونه ات رو شروع کنیم.
                </p>

                <div className="relative z-10 mt-2">

                    <Button
                        className="relative h-10 w-32 bg-white text-base font-bold text-blue-1 shadow-[0_0_6px_#0604254D] hover:bg-gray-100 dark:bg-[#242424] dark:text-blue-4 dark:hover:bg-[#303030] sm:h-12 sm:w-35 sm:text-lg"
                        render={<Link href="/register" />}
                        nativeButton={false}
                    >
                        ثبت نام
                    </Button>
                </div>

                <div className="mt-6 w-full sm:mt-10">
                    <h3 className="mb-2 text-center text-sm font-bold text-[#060425] dark:text-white sm:text-base">
                        املاک های ما در سراسر جهان
                    </h3>
                    <CurvedSlider />
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4 px-4">
                <h4 className="text-[17px] font-bold text-[#060425] dark:text-white">
                    خانه مان را با هم میسازیم
                </h4>

                <ul className="flex w-full flex-wrap justify-center gap-6 text-center text-[12px] text-[#060425] dark:text-gray-300 sm:gap-10 lg:gap-12">
                    <li>
                        <span className="mb-1 block font-bold">آدرس ما</span>
                        <p className='flex items-center gap-2'>
                            <MapPin size={18} color='#10088F' />
                            مازندران ـ ساری ـ دودانگه ـ روستای بکر سنگده
                        </p>

                    </li>

                    <li>
                        <span className="mb-1 block font-bold">آدرس ایمیل</span>
                        <p className='flex items-center gap-2'>
                            <Mail size={18} color='#10088F' />
                            RahnKadeh@gmail.com
                        </p>
                    </li>

                    <li>
                        <span className="mb-1 block font-bold">تلفن ما</span>
                        <p className='flex items-center gap-2'>
                            <Phone size={18} color='#10088F' />
                            <bdi dir="ltr">011-4444-3319 , 0911-544-2349</bdi>
                        </p>
                    </li>
                </ul>
            </div>

            <div className="mx-auto mt-12 grid w-full max-w-[1000px] grid-cols-1 items-center gap-15 px-4 pb-20 sm:px-6 md:grid-cols-2 md:gap-30">
                <ContactForm />
                <Map />
            </div>
        </div>
    )
}

export default ContactUs

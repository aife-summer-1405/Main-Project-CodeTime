'use client'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'

interface IProps {
    photos: string[]
    title: string
}

const toFa = (n: number) => n.toLocaleString('fa-IR')

const MIN_SCALE = 0.88
const MIN_OPACITY = 0.7

const HotelSlider = ({ photos, title }: IProps) => {
    const [activeIndex, setActiveIndex] = useState(Math.floor(photos.length / 2))

    if (!photos?.length) return null

    const updateSlides = (swiper: SwiperType) => {
        swiper.slides.forEach((slide) => {
            const progress = Math.min(Math.abs((slide as any).progress), 1)
            const scale = 1 - progress * (1 - MIN_SCALE)
            const opacity = 1 - progress * (1 - MIN_OPACITY)
            slide.style.transform = `scale(${scale})`
            slide.style.opacity = String(opacity)
        })
    }

    return (
        <div dir='rtl' className='w-full overflow-hidden py-6 sm:py-10'>
            <Swiper
                dir='rtl'
                speed={600}
                watchSlidesProgress
                slidesPerView='auto'
                centeredSlides
                grabCursor
                spaceBetween={12}
                initialSlide={Math.floor(photos.length / 2)}
                breakpoints={{ 768: { spaceBetween: 24 } }}
                onInit={updateSlides}
                onProgress={updateSlides}
                onSetTransition={(swiper, duration) => {
                    swiper.slides.forEach((slide) => {
                        slide.style.transitionDuration = `${duration}ms`
                    })
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {photos.map((src, i) => (
                    <SwiperSlide
                        key={src ?? i}
                        className='
                            relative !w-[88%] max-w-[880px] aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-3xl
                            md:!w-[70%] md:aspect-[16/7.2]
                            will-change-transform
                        '
                    >
                        {src === undefined ? (
                            <img
                                src={src}
                                alt={`${title} - تصویر ${toFa(i + 1)}`}
                                loading={i === 0 ? 'eager' : 'lazy'}
                                draggable={false}
                                className='w-full h-full object-cover select-none'
                            />
                        ) : (
                            <div className='w-full h-full from-lime-400 to-green-2 bg-linear-30 select-none' />
                        )}

                        <span
                            className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-1.5 rounded-lg bg-[#141828]/70 px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-[13px] text-white backdrop-blur-sm transition-opacity duration-500 ${activeIndex === i ? 'opacity-100' : 'opacity-0'
                                }`}
                        >
                            <svg
                                width='16'
                                height='16'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='1.8'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            >
                                <rect x='3' y='3' width='18' height='18' rx='3' />
                                <circle cx='9' cy='9' r='1.5' />
                                <path d='M21 15l-5-5L5 21' />
                            </svg>
                            +{toFa(photos.length)}
                        </span>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default HotelSlider
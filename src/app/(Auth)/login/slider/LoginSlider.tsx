"use client";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
    {
        title: 'وارد رهن کده شو و خونت رو پیدا کن !!!',
        description: 'وارد شو و با یک قدم ساده، به سوی خونه‌ای که همیشه آرزوش را داشتی، برو!',
        img: "/images/slider01.png",
    },
    {
        title: 'وارد رهن کده شو و خونت رو پیدا کن !!!',
        description: 'وارد شو و با یک قدم ساده، به سوی خونه‌ای که همیشه آرزوش را داشتی، برو!',
        img: "/images/slider02.png",
    },
    {
        title: "وارد رهن کده شو و خونت رو پیدا کن !!!",
        description: 'وارد شو و با یک قدم ساده، به سوی خونه‌ای که همیشه آرزوش را داشتی، برو!',
        img: "/images/slider03.png",
    },

];
interface IProps {
    registerForm: boolean;
}

export default function LoginSlider({ registerForm }: IProps) {
    return (
        <div className={`relative h-full w-full overflow-hidden ${registerForm === true ? "rounded-tl-[50px] rounded-bl-[50px]" : "rounded-tr-[50px] rounded-br-[50px]"}`}>
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{
                    clickable: true,
                    bulletClass: "swiper-pagination-bullet login-bullet",
                    bulletActiveClass:
                        "swiper-pagination-bullet-active login-bullet-active",
                }}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                loop
                slidesPerView={1}
                className="login-swiper h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className={`relative flex h-full w-full items-center justify-center `}
                        >
                            <img src={slide.img} className="w-full h-full object-cover" alt="" />
                            <div className="absolute bottom-20 z-10 mx-auto mt-10 max-w-[500px] px-8 text-center text-white">
                                <h2 className="text-2xl font-bold leading-10 md:text-3xl">
                                    {slide.title}
                                </h2>

                                <p className="mt-4 text-sm leading-8 text-white/85 md:text-base">
                                    {slide.description}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style jsx global>{`
                            .login-swiper .swiper-pagination {
                            bottom: 28px !important;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 0;
                            }

                            .login-swiper .login-bullet {
                            width: 10px;
                            height: 10px;
                            margin: 0 3px !important;
                            border-radius: 50%;
                            background: #c4c4d0;
                            opacity: 1;
                            transition: all 0.3s ease;
                            }

                            .login-swiper .login-bullet-active {
                            width: 10px;
                            height: 10px;
                            background: white;
                            }
            `}</style>
        </div>
    );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
    HiXMark,
    HiOutlineHome,
    HiOutlineMoon,
    HiOutlineSun,
} from "react-icons/hi2";
import { Menu } from "lucide-react";

export default function AuthFloatingMenu() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!open) return;

        const onPointerDown = (e: PointerEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open]);

    return (
        <div
            ref={ref}
            className=""
        >
            <button
                onClick={() => setOpen((p) => !p)}
                aria-label={open ? "بستن منو" : "باز کردن منو"}
                aria-expanded={open}
                className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-white-1 text-[#08088f] shadow-lg cursor-pointer active:scale-[0.9] transition-transform duration-200 dark:bg-[#222]"
            >
                <Menu
                    size={27}
                    className={`absolute transition-all duration-300 ${open
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                        }`}
                />
                <HiXMark
                    size={28}
                    className={`absolute text-red-500 transition-all duration-300 ${open
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                        }`}
                />
            </button>

            <div
                aria-hidden={!open}
                className={`flex flex-col items-center gap-2 rounded-full bg-[#b8e4f0] dark:bg-[#0887CA33] p-2 origin-top transition-all duration-300 ease-out ${open
                    ? "opacity-100 translate-y-1 translate-x-1.5 scale-100 pointer-events-auto"
                    : "opacity-0 -translate-y-6 scale-75 pointer-events-none"
                    }`}
            >
                <Link
                    href="/"
                    aria-label="صفحه اصلی"
                    tabIndex={open ? 0 : -1}
                    className="flex cursor-pointer dark:bg-white-1 active:scale-[0.9] transition-transform duration-200 h-14 w-14 items-center justify-center rounded-full bg-white text-[#08088f] shadow-md dark:bg-[#222] dark:text-white"
                >
                    <HiOutlineHome color="#10088F" size={28} />
                </Link>

                <button
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    aria-label="تغییر تم"
                    tabIndex={open ? 0 : -1}
                    className="flex h-14 w-14 items-center dark:bg-white-1 justify-center rounded-full bg-white text-[#08088f] shadow-md cursor-pointer active:scale-[0.9] transition-transform duration-200 dark:bg-[#222] dark:text-white"
                >
                    {mounted && theme === "dark" ? (
                        <HiOutlineSun color="#10088F" size={28} />
                    ) : (
                        <HiOutlineMoon color="#10088F" size={28} />
                    )}
                </button>
            </div>
        </div>
    );
}
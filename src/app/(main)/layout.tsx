"use client";

import { usePathname } from "next/navigation";

import SiteFooter from "@/components/footer/Footer";
import Header from "@/components/header/header";
import { ThemeToggle } from "@/components/theme-toggle";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();

    const isReservationPage = pathname.startsWith("/reserve");

    return (
        <>
            <Header />
            <main>{children}</main>
            <ThemeToggle />

            {!isReservationPage && <SiteFooter />}
        </>
    );
}
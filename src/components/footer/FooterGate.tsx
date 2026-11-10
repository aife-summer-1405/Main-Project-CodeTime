"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/footer/Footer";

export default function FooterGate() {
    const pathname = usePathname();
    const isReservationPage = pathname.startsWith("/reserve");

    if (isReservationPage) return null;

    return <SiteFooter />;
}
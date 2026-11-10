import { Suspense } from "react";

import FooterGate from "@/components/footer/FooterGate";
import Header from "@/components/header/header";
import { ThemeToggle } from "@/components/theme-toggle";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <ThemeToggle />

            <Suspense fallback={null}>
                <FooterGate />
            </Suspense>
        </>
    );
}
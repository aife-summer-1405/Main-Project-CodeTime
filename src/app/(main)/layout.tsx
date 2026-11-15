import { Suspense } from "react";

import FooterGate from "@/components/footer/FooterGate";
import Header from "@/components/header/header";
import CheckPage from "./CheckPage";


export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <Header />
            <main>{children}</main>
            <CheckPage />

            <Suspense fallback={null}>
                <FooterGate />
            </Suspense>
        </>
    );
}
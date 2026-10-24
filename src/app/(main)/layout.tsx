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
        </>
    );
}
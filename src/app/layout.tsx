import type { Metadata } from "next";
import "./globals.css";
import { iranSans } from "@/assets/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import Header from "@/components/header/header";
import { ThemeToggle } from "@/components/theme-toggle";
import { LandingArrow1, LandingArrow2 } from "@/components/svgs/landing-arrows";
import LandingArrowText from "@/components/landing-arrow-text";
import Footer from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "Rahn kadeh",
  description: "Rahn kadeh website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      dir="rtl"
      lang="fa"
      className={cn("h-full", "antialiased", iranSans.className)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LandingArrow1 />
          <div className="absolute top-110 flex flex-wrap gap-4 -rotate-90 origin-bottom-right">
            <LandingArrow2 />
            <LandingArrowText/>
          </div>
          <ThemeToggle />
          {/* <Header /> */}
          {children}
         
          {/* <Footer /> */}
        </ThemeProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: 'inherit',
              direction: 'rtl',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { iranSans } from "@/assets/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";

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
          {children}
         
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

"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const subscribe = () => () => { };
const getServerSnapshot = () => false;
const getClientSnapshot = () => true;

export function ThemeToggleDashboard() {
    const { resolvedTheme, setTheme } = useTheme();

    const mounted = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot,
    );

    return (
        <Button
            className=" relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E4EDF1] text-[#55536D] transition "
            variant="outline"
            aria-label="تغییر تم"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
            {!mounted ? null : resolvedTheme === "light" ? (
                <Moon size={30} />
            ) : (
                <Sun size={30} className="text-white-1"  />
            )}
        </Button>
    );
}

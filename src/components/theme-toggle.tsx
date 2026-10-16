"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, MoonIcon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      className={
        "bg-white-1 hover:bg-white-1 dark:bg-blue-2 hover:dark:bg-blue-2 size-10 rounded-full absolute left-7 bottom-20 shadow-[0_0_10px_#008FA440] hover:shadow-[0_0_10px_#008FA480] duration-500 cursor-pointer border-0"
      }
      variant="outline"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "light" ? (
        <Moon className="size-6 text-blue-1" />
      ) : (
        <Sun className="size-6 text-white" />
      )}
    </Button>
  );
}

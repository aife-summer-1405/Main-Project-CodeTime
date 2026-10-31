'use client'
import { HEADER_TEXTS } from "@/constants/header";
import { Button } from "../ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "../LogoutButton/LogoutButton";

const TOKEN_KEY = "access_token";

const AuthButtons = () => {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem(TOKEN_KEY));
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === TOKEN_KEY) check();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);


  return (
    <div className="flex items-center gap-8 text-lg text-blue-1 dark:text-blue-4 font-bold">
      {isLoggedIn ? (
        <>
          <Button
            className="w-35 h-12 text-lg text-blue-1 font-bold dark:text-blue-4 bg-white-1 shadow-[0_0_6px_#0604254D] hover:bg-white-1"
            render={<Link href="/panel" />}
            nativeButton={false}
          >
            پنل کاربری
          </Button>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/login" className="h-fit">
            {HEADER_TEXTS.login}
          </Link>
          <Button
            className="w-35 h-12 text-lg text-blue-1 font-bold dark:text-blue-4 bg-white-1 shadow-[0_0_6px_#0604254D] hover:bg-white-1"
            render={<Link href="/register" />}
            nativeButton={false}
          >
            {HEADER_TEXTS.register}
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
'use client'
import { HEADER_TEXTS } from "@/constants/header";
import { Button } from "../ui/button";
import Link from "next/link";

const AuthButtons = () => {
  // const logout = () => {
  //   localStorage.clear()
  // }
  return (
    <div className="flex items-center gap-8 text-lg text-blue-1 dark:text-blue-4 font-bold">
      <Link href={"/login"} className="h-fit">{HEADER_TEXTS.login}</Link>
      <Button
        className={
          "w-35 h-12 text-lg text-blue-1 font-bold dark:text-blue-4 bg-white-1 shadow-[0_0_6px_#0604254D] hover:bg-white-1"
        }
        render={<Link href={"/register"} />}
        nativeButton={false}
      >
        {HEADER_TEXTS.register}
      </Button>
      {/* <Button onClick={() => { logout() }} className={'px-10 py-2.5 bg-red-1'}>log out</Button> */}
    </div>
  );
};

export default AuthButtons;

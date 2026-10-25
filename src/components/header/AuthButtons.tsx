import { HEADER_TEXTS } from "@/constants/header";
import { Button } from "../ui/button";
import Link from "next/link";

const AuthButtons = () => {
  return (
    <div className="max-sm:hidden flex items-center gap-8 text-lg max-md:text-sm text-blue-1 dark:text-blue-4 font-bold">
      <Link href={"/login"} className="h-fit">{HEADER_TEXTS.login}</Link>
      <Button
        className={
          "w-35 h-12 max-md:w-16 max-md:h-10 text-lg max-md:text-sm  text-blue-1 font-bold dark:text-blue-4 bg-white-1 shadow-[0_0_6px_#0604254D] hover:bg-white-1"
        }
        render={<Link href={"/register"} />}
        nativeButton={false}
      >
        {HEADER_TEXTS.register}
      </Button>
    </div>
  );
};

export default AuthButtons;

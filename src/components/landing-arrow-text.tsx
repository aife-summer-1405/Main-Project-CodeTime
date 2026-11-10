"use client"
import { usePathname } from "next/navigation";

const LandingArrowText = () => {
  const pathName = usePathname();

  if (pathName !== "/") return null;

  return (
    <span className="h-fit mt-10 hidden lg:block text-xs font-medium text-green-1/50">
      اسکرول کن بعدش خوش گلدی
    </span>
  );
};

export default LandingArrowText;
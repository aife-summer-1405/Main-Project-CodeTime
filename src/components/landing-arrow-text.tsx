"use client"
import { usePathname } from "next/navigation";

const LandingArrowText = () => {
  const pathName = usePathname();
  return (
    <span className={`h-fit mt-10 text-xs font-medium text-green-1/50 ${pathName !== "/" ? "hidden" : ""}`}>
      اسکرول کن بعدش خوش گلدی
    </span>
  );
};

export default LandingArrowText;

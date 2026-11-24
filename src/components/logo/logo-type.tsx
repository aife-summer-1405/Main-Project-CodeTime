import { logoFont } from "@/assets/fonts";
import { cn } from "cn";
import Link from "next/link";
import { FC } from "react";

interface IProps {
  textSize?: string;

  textColor1?: string;
  textColor2?: string;

  darkTextColor1?: string;
  darkTextColor2?: string;
  className?: string
}

const LogoType: FC<IProps> = ({
  textSize = "32px",

  textColor1 = "#060425",
  textColor2 = "#005EA4",

  darkTextColor1 = "#F5F5F5",
  darkTextColor2 = "#005EA4",
  className,
}) => {
  return (
    <Link
      href={"/"}
      className={cn(`${logoFont.className} h-fit flex gap-1 leading-13.75 max-sm:leading-normal`, className)}
      style={
        {
          fontSize: textSize,
          "--logo-color-1": textColor1,
          "--logo-color-2": textColor2,
          "--logo-dark-color-1": darkTextColor1,
          "--logo-dark-color-2": darkTextColor2,
        } as React.CSSProperties
      }
    >
      <span className="max-sm:h-10 text-(--logo-color-1) dark:text-(--logo-dark-color-1)">
        رهن
      </span>

      <span className="max-sm:h-10 text-(--logo-color-2) dark:text-(--logo-dark-color-2)">
        کده
      </span>
    </Link>
  );
};

export default LogoType;

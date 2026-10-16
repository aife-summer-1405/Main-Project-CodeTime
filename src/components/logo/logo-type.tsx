import { logoFont } from "@/assets/fonts";
import Link from "next/link";
import { FC } from "react";

const goHomePage = () => {};

interface IProps {
  textSize?: string;

  textColor1?: string;
  textColor2?: string;

  darkTextColor1?: string;
  darkTextColor2?: string;
}

const LogoType: FC<IProps> = ({
  textSize = "32px",

  textColor1 = "#060425",
  textColor2 = "#005EA4",

  darkTextColor1 = "#F5F5F5",
  darkTextColor2 = "#005EA4",
}) => {
  return (
    <Link
      href={"/"}
      className={`${logoFont.className} flex gap-1 leading-13.75`}
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
      <span className="text-(--logo-color-1) dark:text-(--logo-dark-color-1)">
        رهن
      </span>

      <span className="text-(--logo-color-2) dark:text-(--logo-dark-color-2)">
        کده
      </span>
    </Link>
  );
};

export default LogoType;

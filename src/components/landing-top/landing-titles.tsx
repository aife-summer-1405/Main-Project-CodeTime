import { cn } from "cn";
import { FC } from "react";

interface IProps {
  text: string;
  emoji?: string | null;
  className?: string;
}
const LandingTitle: FC<IProps> = ({ emoji, text, className }) => {
  return (
    <span className={cn("text-blue-2 flex gap-1 items-center", className)}>
      {emoji ? (
        <>
          <span className="font-medium">{emoji}</span>
          <span className="text-sm">{emoji}</span>
          <span className="text-[8px]">{emoji}</span>
        </>
      ) : null}

      <span className={emoji ? "mx-2" : ""}>{text}</span>

      {emoji ? (
        <>
          <span className="text-[8px] scale-x-[-1]">{emoji}</span>
          <span className="text-sm scale-x-[-1]">{emoji}</span>
          <span className="font-medium scale-x-[-1]">{emoji}</span>
        </>
      ) : null}
    </span>
  );
};

export default LandingTitle;

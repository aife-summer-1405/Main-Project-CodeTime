import { FC } from "react";

interface IProps {
  text: string;
  emoji: string;
}
const LandingTitle: FC<IProps> = ({ emoji, text }) => {
  return (
    <span className="text-blue-2 flex gap-2 items-center">
      <span className="font-medium">{emoji}</span>
      <span className="text-sm">{emoji}</span>
      <span className="text-[8px]">{emoji}</span>
      <span className="mx-2">{text}</span>
      <span className="text-[8px] scale-x-[-1]">{emoji}</span>
      <span className="text-sm scale-x-[-1]">{emoji}</span>
      <span className="font-medium scale-x-[-1]">{emoji}</span>
    </span>
  );
};

export default LandingTitle;

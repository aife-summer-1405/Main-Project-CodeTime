import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { OnSelectHandler } from "react-day-picker";
import { selectedValueIncludes } from "@base-ui/react/internals/itemEquality";
import { cn } from "cn";
import { Dispatch, SetStateAction } from "react";

interface IProps<T extends FieldValues> {
  id: Path<T>;
  title: string;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  state: Date | undefined;
  setState: Dispatch<SetStateAction<Date | undefined>>;
  className?: string;
}

function DateInput<T extends FieldValues>({
  id,
  title,
  register,
  setValue,
  errors,
  state,
  setState,
  className,
}: IProps<T>) {
  const formattedDate = state
    ? new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(state)
    : "";
  return (
    <div className={cn("flex flex-col gap-2.5 relative", className)}>
      <Popover>
        <PopoverTrigger className={"text-right flex gap-1 cursor-pointer"}>
          {title}
          <ChevronDownIcon className="size-6" />
        </PopoverTrigger>
        <PopoverContent className={"w-fit"}>
          <Calendar
            mode="single"
            selected={state}
            onSelect={(date) => {
              setState(date);

              const value = date
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                : "";

              setValue(id, value as T[Path<T>], {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              });

              console.log("Selected date:", date);
              console.log("Form value:", value);
            }}
            className="rounded-lg"
          />

        </PopoverContent>
      </Popover>

      <input
        id={id}
        type="text"
        value={formattedDate}
        readOnly
        placeholder="انتخاب کن"
        className="w-full focus:outline-0 caret-transparent cursor-default"
        {...register(id)}
      />
      {errors[id] && (
        <p className="text-sm text-red-500 absolute -bottom-6 whitespace-nowrap">
          {String(errors[id]?.message ?? "")}
        </p>
      )}
    </div>
  );
}

export default DateInput;

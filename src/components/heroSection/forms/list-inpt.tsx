"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "cn";
import { Dispatch, SetStateAction } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

interface IProps<T extends FieldValues> {
  id: Path<T>;
  title: string;
  items: { label: string | number; value: string | number }[];
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  placeHolder: string;
  className?: string;
}

function ListInput<T extends FieldValues>({
  id,
  title,
  items,
  register,
  setValue,
  errors,
  state,
  setState,
  placeHolder,
  className,
}: IProps<T>) {
  return (
    <div className={cn("flex flex-col gap-2.5 relative",className)}>
      <Select
        items={items}
        value={state || null}
        onValueChange={(value) => {
          const newValue = value ?? "";

          setState(newValue);
          setValue(id, newValue as T[Path<T>], {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
      >
        <SelectTrigger
          iconClassName="size-6"
          className="h-6! cursor-pointer border-0 p-0"
        >
          <span>{title}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className={"max-h-60 overflow-y-scroll"}>
            {items.map((item) => (
              <SelectItem
                className={"cursor-pointer hover:bg-gray-100"}
                key={item.value}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <input
        id={id}
        type="text"
        value={state}
        placeholder={placeHolder}
        readOnly
        className="focus:outline-0 caret-transparent cursor-default w-full"
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

export default ListInput;

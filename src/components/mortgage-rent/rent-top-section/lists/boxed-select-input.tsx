import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { cn } from "cn";
import { Dispatch, SetStateAction } from "react";

interface IProps<T extends FieldValues> {
  id: Path<T>;
  title: string;
  items: { label: string | number; value: string | number }[];
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  className?: string;
}

const BoxedSelectInput = <T extends FieldValues>({
  id,
  title,
  items,
  setValue,
  errors,
  state,
  setState,
  className,
}: IProps<T>) => {
  const selectedItem = items.find((item) => String(item.value) === state);
  const displayLabel = selectedItem && selectedItem.value != "none" ? String(selectedItem.label) : title;

  return (
    <div className={cn("relative h-12 w-62.5!", className)}>
      <Select
        items={items}
        value={state || null}
        onValueChange={(value) => {
          const newValue = value != null ? String(value) : "";
          setState(newValue);
          setValue(id, newValue as T[Path<T>], {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
      >
        <SelectTrigger
          iconClassName="size-6"
          className="h-full! w-full cursor-pointer border text-sm font-normal text-blue-3/70 border-blue-3/70 dark:border-r-blue-4 dark:text-blue-4 dark:bg-black-1 px-4"
        >
          <span className={cn(selectedItem && "text-blue-3 font-medium")}>
            {displayLabel}
          </span>
        </SelectTrigger>

        <SelectContent>
          <SelectGroup className="max-h-60 overflow-y-scroll">
            {items.map((item) => (
              <SelectItem
                className="cursor-pointer hover:bg-gray-100"
                key={String(item.value)}
                value={String(item.value)}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {errors[id] && (
        <p className="text-sm text-red-500 absolute -bottom-6 whitespace-nowrap">
          {String(errors[id]?.message ?? "")}
        </p>
      )}
    </div>
  );
};

export default BoxedSelectInput;
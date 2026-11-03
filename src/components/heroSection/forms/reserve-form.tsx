"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reserveSchema,
  type ReserveFormValues,
} from "@/schemas/reserve-schema";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import ListInput from "./list-inpt";
import { useState } from "react";
import DateInput from "./date-input";

export default function ReserveForm() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReserveFormValues>({
    resolver: zodResolver(reserveSchema),
    defaultValues: {
      checkIn: "",
      checkOut: "",
      guests: 0,
      location: "",
    },
  });

  const onSubmit = (data: ReserveFormValues) => {
    console.log("اطلاعات فرم:", data);
  };

  const items = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
    { label: "a", value: "a" },
    { label: "b", value: "b" },
    { label: "c", value: "c" },
    { label: "d", value: "d" },
    { label: "e", value: "e" },
    { label: "f", value: "f" },
  ];

  const guestsItems = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
  ];

  const [location, setLocation] = useState("");
  const [count, setCount] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap items-start gap-10 w-213 mx-auto"
    >
      <ListInput
        errors={errors}
        id="location"
        items={items}
        register={register}
        setValue={setValue}
        title="مقصد"
        state={location}
        setState={setLocation}
        placeHolder="مقصد را انتخاب کنید"
        className="w-31.5"
      />

      <div className="h-13.5 border-r-2 border-black-2 opacity-20"></div>

      <DateInput
        errors={errors}
        id="checkIn"
        register={register}
        setValue={setValue}
        state={checkIn}
        setState={setCheckIn}
        title="تاریخ ورود"
        className="w-23"
      />

      <span className="h-7.75 font-bold text-xl leading-[100%]">_</span>

      <DateInput
        errors={errors}
        id="checkOut"
        register={register}
        setValue={setValue}
        state={checkOut}
        setState={setCheckOut}
        title="تاریخ خروج"
        className="w-23.75"
      />
      
      <div className="h-13.5 border-r-2 border-black-2 opacity-20"></div>

      <ListInput
        errors={errors}
        id="guests"
        items={guestsItems}
        register={register}
        title="تعداد نفرات"
        setValue={setValue}
        state={count}
        setState={setCount}
        placeHolder="انتخاب کن چند نفرین"
        className="w-31.5"
      />

      <Button
        className={"w-30! h-12 p-0 text-sm font-medium dark:bg-black-2 text-white-1"}
        type="submit"
        disabled={isSubmitting}
      >
        <SearchIcon />
        جستجو
      </Button>
    </form>
  );
}

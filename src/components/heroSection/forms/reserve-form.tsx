"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  reserveSchema,
  type ReserveFormValues,
} from "@/schemas/reserve-schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, ChevronDown, SearchIcon } from "lucide-react";

export default function ReserveForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReserveFormValues>({
    resolver: zodResolver(reserveSchema),
    defaultValues: {
      checkIn: "",
      checkOut: "",
      guests: 2,
      location: "",
    },
  });

  const onSubmit = (data: ReserveFormValues) => {
    console.log("اطلاعات فرم:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap items-start gap-4 w-213 mx-auto"
    >
      <div className="flex flex-col gap-1">
        <label className="flex gap-1 text-sm" htmlFor="location">
          مقصد
          <ChevronDown/>
        </label>
        <Input
          id="location"
          placeholder="مازندران،ساری،لفور..."
          {...register("location")}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="flex gap-1 text-sm" htmlFor="checkIn">
          تاریخ ورود
          <ChevronDown />
        </label>
        <Input id="checkIn" type="date" {...register("checkIn")} />
        {errors.checkIn && (
          <p className="text-sm text-red-500">{errors.checkIn.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex gap-1 text-sm" htmlFor="checkOut">
          تاریخ خروج
          <ChevronDown />
        </label>
        <Input id="checkOut" type="date" {...register("checkOut")} />
        {errors.checkOut && (
          <p className="text-sm text-red-500">{errors.checkOut.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="flex gap-1 text-sm" htmlFor="guests">
          تعداد نفرات
          <ChevronDown/>
        </label>
        <Input
          id="guests"
          type="number"
          {...register("guests", { valueAsNumber: true })}
        />
        {errors.guests && (
          <p className="text-sm text-red-500">{errors.guests.message}</p>
        )}
      </div>

      <Button className={"w-30! h-12 p-0 text-sm font-medium"} type="submit" disabled={isSubmitting}>
        {/* <SearchIcon /> */}
        جستجوی
      </Button>
    </form>
  );
}

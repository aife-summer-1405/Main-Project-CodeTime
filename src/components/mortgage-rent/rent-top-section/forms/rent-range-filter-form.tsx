"use client";

import StackedSelectInput from "../lists/StackedSelectInput";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  rentRangeFormSchea,
  RentRangeFormValues,
} from "@/schemas/rent-form-schema";

type SelectItem = {
  label: string;
  value: number | "";
};

const NONE_OPTION: SelectItem = { label: "هیچکدام", value: "" };

const minAreaItems: SelectItem[] = [
  NONE_OPTION,
  { label: "40 متر", value: 40 },
  { label: "50 متر", value: 50 },
  { label: "60 متر", value: 60 },
  { label: "70 متر", value: 70 },
  { label: "80 متر", value: 80 },
  { label: "90 متر", value: 90 },
  { label: "100 متر", value: 100 },
];

const maxAreaItems: SelectItem[] = [
  NONE_OPTION,
  { label: "110 متر", value: 110 },
  { label: "120 متر", value: 120 },
  { label: "130 متر", value: 130 },
  { label: "140 متر", value: 140 },
  { label: "150 متر", value: 150 },
  { label: "160 متر", value: 160 },
  { label: "170 متر", value: 170 },
  { label: "180 متر", value: 180 },
  { label: "190 متر", value: 190 },
  { label: "200 متر", value: 200 },
];

const minPriceItems: SelectItem[] = [
  NONE_OPTION,
  { label: "40 میلیون تومان", value: 40 },
  { label: "50 میلیون تومان", value: 50 },
  { label: "60 میلیون تومان", value: 60 },
  { label: "70 میلیون تومان", value: 70 },
  { label: "80 میلیون تومان", value: 80 },
  { label: "90 میلیون تومان", value: 90 },
  { label: "100 میلیون تومان", value: 100 },
];

const maxPriceItems: SelectItem[] = [
  NONE_OPTION,
  { label: "110 میلیون تومان", value: 110 },
  { label: "120 میلیون تومان", value: 120 },
  { label: "130 میلیون تومان", value: 130 },
  { label: "140 میلیون تومان", value: 140 },
  { label: "150 میلیون تومان", value: 150 },
  { label: "160 میلیون تومان", value: 160 },
  { label: "170 میلیون تومان", value: 170 },
  { label: "180 میلیون تومان", value: 180 },
  { label: "190 میلیون تومان", value: 190 },
  { label: "200 میلیون تومان", value: 200 },
];

const minRentItems: SelectItem[] = [
  NONE_OPTION,
  { label: "40 میلیون تومان", value: 40 },
  { label: "50 میلیون تومان", value: 50 },
  { label: "60 میلیون تومان", value: 60 },
  { label: "70 میلیون تومان", value: 70 },
  { label: "80 میلیون تومان", value: 80 },
  { label: "90 میلیون تومان", value: 90 },
  { label: "100 میلیون تومان", value: 100 },
];

const maxRentItems: SelectItem[] = [
  NONE_OPTION,
  { label: "110 میلیون تومان", value: 110 },
  { label: "120 میلیون تومان", value: 120 },
  { label: "130 میلیون تومان", value: 130 },
  { label: "140 میلیون تومان", value: 140 },
  { label: "150 میلیون تومان", value: 150 },
  { label: "160 میلیون تومان", value: 160 },
  { label: "170 میلیون تومان", value: 170 },
  { label: "180 میلیون تومان", value: 180 },
  { label: "190 میلیون تومان", value: 190 },
  { label: "200 میلیون تومان", value: 200 },
];

const getLabelByValue = (
  items: SelectItem[],
  paramValue: string | null,
  fallbackLabel = "",
): string => {
  if (!paramValue) return fallbackLabel;
  const numericValue = Number(paramValue);
  if (Number.isNaN(numericValue)) return fallbackLabel;
  const found = items.find((item) => item.value === numericValue);
  return found ? found.label : fallbackLabel;
};

const getValueByLabel = (
  items: SelectItem[],
  selectedLabel: string,
): string => {
  if (!selectedLabel || selectedLabel === NONE_OPTION.label) return "";
  const found = items.find((item) => item.label === selectedLabel);
  if (!found || found.value === "") return "";
  return String(found.value);
};

const RentRangeFilterForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialValues: RentRangeFormValues = {
    minArea: getLabelByValue(minAreaItems, searchParams.get("minArea")),
    maxArea: getLabelByValue(maxAreaItems, searchParams.get("maxArea")),
    minPrice: getLabelByValue(minPriceItems, searchParams.get("minPrice")),
    maxPrice: getLabelByValue(maxPriceItems, searchParams.get("maxPrice")),
    minRent: getLabelByValue(minRentItems, searchParams.get("minRent")),
    maxRent: getLabelByValue(maxRentItems, searchParams.get("maxRent")),
  };

  const [minArea, setMinArea] = useState<string>(initialValues.minArea);
  const [maxArea, setMaxArea] = useState<string>(initialValues.maxArea);
  const [minPrice, setMinPrice] = useState<string>(initialValues.minPrice);
  const [maxPrice, setMaxPrice] = useState<string>(initialValues.maxPrice);
  const [minRent, setMinRent] = useState<string>(initialValues.minRent);
  const [maxRent, setMaxRent] = useState<string>(initialValues.maxRent);

  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<RentRangeFormValues>({
    resolver: zodResolver(rentRangeFormSchea),
    defaultValues: initialValues,
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    const updates: Record<string, string> = {
      minArea: getValueByLabel(minAreaItems, minArea),
      maxArea: getValueByLabel(maxAreaItems, maxArea),
      minPrice: getValueByLabel(minPriceItems, minPrice),
      maxPrice: getValueByLabel(maxPriceItems, maxPrice),
      minRent: getValueByLabel(minRentItems, minRent),
      maxRent: getValueByLabel(maxRentItems, maxRent),
    };

    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    }
  }, [
    minArea,
    maxArea,
    minPrice,
    maxPrice,
    minRent,
    maxRent,
    pathname,
    router,
    searchParams,
  ]);

  return (
    <form className="flex gap-10 items-center h-13.5">
      <StackedSelectInput
        errors={errors}
        id="minArea"
        items={minAreaItems}
        register={register}
        setValue={setValue}
        title="حداقل متراژ"
        state={minArea}
        setState={setMinArea}
        placeHolder="انتخاب کنید"
        className="w-25"
      />
      <div className="text-xl font-bold text-black-2/20">_</div>
      <StackedSelectInput
        errors={errors}
        id="maxArea"
        items={maxAreaItems}
        register={register}
        setValue={setValue}
        title="حداکثر متراژ"
        state={maxArea}
        setState={setMaxArea}
        placeHolder="انتخاب کنید"
        className="w-25.5"
      />
      <div className="border-r h-full border-2 text-black-2/20"></div>
      <StackedSelectInput
        errors={errors}
        id="minPrice"
        items={minPriceItems}
        register={register}
        setValue={setValue}
        title="حداقل قیمت"
        state={minPrice}
        setState={setMinPrice}
        placeHolder="انتخاب کنید"
        className="w-25"
      />
      <div className="text-xl font-bold text-black-2/20">_</div>
      <StackedSelectInput
        errors={errors}
        id="maxPrice"
        items={maxPriceItems}
        register={register}
        setValue={setValue}
        title="حداکثر قیمت"
        state={maxPrice}
        setState={setMaxPrice}
        placeHolder="انتخاب کنید"
        className="w-25.5"
      />
      <div className="border-r h-full border-2 text-black-2/20"></div>
      <StackedSelectInput
        errors={errors}
        id="minRent"
        items={minRentItems}
        register={register}
        setValue={setValue}
        title="حداقل اجاره"
        state={minRent}
        setState={setMinRent}
        placeHolder="انتخاب کنید"
        className="w-25"
      />
      <div className="text-xl font-bold text-black-2/20">_</div>
      <StackedSelectInput
        errors={errors}
        id="maxRent"
        items={maxRentItems}
        register={register}
        setValue={setValue}
        title="حداکثر اجاره"
        state={maxRent}
        setState={setMaxRent}
        placeHolder="انتخاب کنید"
        className="w-25.5"
      />
    </form>
  );
};

export default RentRangeFilterForm;

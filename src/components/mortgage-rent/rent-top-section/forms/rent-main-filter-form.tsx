"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import BoxedSelectInput from "../lists/boxed-select-input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rentFormSchema, RentFormValues } from "@/schemas/rent-form-schema";

const RentMainFilterForm = () => {
  const {
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RentFormValues>({
    resolver: zodResolver(rentFormSchema),
    defaultValues: {
      location: "",
      sort: "",
    },
  });

  const sortItems = [
    { label: "هیچکدام", value: "none" },
    { label: "ارزان‌ترین", value: "priceLowToHigh" },
    { label: "گران‌ترین", value: "priceHighToLow" },
    { label: "جدیدترین", value: "newest" },
    { label: "قدیمی‌ترین", value: "oldest" },
  ];

  const locationItems = [
    { label: "هیچکدام", value: "none" },
    { label: "تهران", value: "tehran" },
    { label: "ساری", value: "sari" },
    { label: "شیراز", value: "shiraz" },
    { label: "تبریز", value: "tabriz" },
    { label: "کرج", value: "karaj" },
    { label: "اصفهان", value: "isfahan" },
    { label: "مشهد", value: " Mashhad" },
  ];

  const transactionTypeItems = [
    { label: "هیچکدام", value: "none" },
    { label: "رهن", value: "mortgage" },
    { label: "اجاره", value: "rent" },
    { label: "رهن و اجاره", value: "mortgageAndRent" },
  ];

  const [sort, setSort] = useState("");
  const [location, setLocation] = useState("");
  const [transactionType, setTransactionType] = useState("");

  return (
    <form className="flex gap-4 justify-center h-12 mb-10">
      <div className="h-full w-112.5 relative flex items-center">
        <Input
          className="h-full border border-blue-3/70 placeholder:text-blue-3/70 text-blue-3 dark:border-blue-4 dark:text-blue-4 dark:placeholder:text-blue-4/70 dark:bg-black-1"
          placeholder="نام ملک مورد نظر ..."
        />
        <Search className="text-blue-3/70 absolute left-4" />
      </div>
      <BoxedSelectInput
        errors={errors}
        id="sort"
        items={sortItems}
        setValue={setValue}
        title="مرتب سازی بر اساس ..."
        state={sort}
        setState={setSort}
        className="w-31.5"
      />
      <BoxedSelectInput
        errors={errors}
        id="location"
        items={locationItems}
        setValue={setValue}
        title="محل مورد نظر ..."
        state={location}
        setState={setLocation}
        className="w-31.5"
      />
      <BoxedSelectInput
        errors={errors}
        id="transactionType"
        items={transactionTypeItems}
        setValue={setValue}
        title="نوع معامله"
        state={transactionType}
        setState={setTransactionType}
        className="w-31.5"
      />
    </form>
  );
};

export default RentMainFilterForm;

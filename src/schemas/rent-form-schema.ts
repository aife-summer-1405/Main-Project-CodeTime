import { z } from "zod";

export const rentFormSchema = z.object({
  sort: z.string().min(1, "لطفاً یک گزینه را انتخاب کنید"),

  location: z.string().min(1, "لطفاً شهر را انتخاب کنید"),

  transactionType: z.string().min(1, "لطفاً نوع معامله را انتخاب کنید"),
});

export const rentRangeFormSchea = z.object({
  minArea: z.string(),
  maxArea: z.string(),
  minPrice: z.string(),
  maxPrice: z.string(),
  minRent: z.string(),
  maxRent: z.string(),
});

export type RentFormValues = z.infer<typeof rentFormSchema>;
export type RentRangeFormValues = z.infer<typeof rentRangeFormSchea>;

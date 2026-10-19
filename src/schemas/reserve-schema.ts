
import { z } from "zod";

export const reserveSchema = z
  .object({
    checkIn: z.string().min(1, "تاریخ ورود را انتخاب کنید"),

    checkOut: z.string().min(1, "تاریخ خروج را انتخاب کنید"),

    guests: z
      .number()
      .int("تعداد نفرات باید عدد صحیح باشد")
      .min(1, "حداقل یک نفر باید انتخاب شود")
      .max(20, "حداکثر تعداد نفرات ۲۰ نفر است"),

    location: z.string().min(1, "لطفاً مقصد را انتخاب کنید"),
  })
  .refine(
    (data) =>
      !data.checkIn ||
      !data.checkOut ||
      data.checkOut > data.checkIn,
    {
      message: "تاریخ خروج باید بعد از تاریخ ورود باشد",
      path: ["checkOut"],
    }
  );

export type ReserveFormValues = z.infer<typeof reserveSchema>;

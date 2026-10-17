import { z } from "zod"

export const eventFormSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(120, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().trim().min(2, "Venue must be at least 2 characters").max(160, "Venue is too long"),
  totalSeats: z
    .string()
    .trim()
    .min(1, "Total seats is required")
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, "Total seats must be a positive number"),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.url().safeParse(value).success, "Image URL must be valid"),
})

export type EventFormValues = z.infer<typeof eventFormSchema>

export function getFirstEventValidationMessage(error: z.ZodError<EventFormValues>) {
  return error.issues[0]?.message ?? "Please check the event details."
}

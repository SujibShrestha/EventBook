import { z } from "zod";

export const createEventSchema = z
  .object({
    title: z.string().trim().min(2).max(120),
    description: z.string().trim().min(10).max(2000),
    startsAt: z.coerce.date(),
    venue: z.string().trim().min(2).max(160),
    totalSeats: z.coerce.number().int().positive(),
    imageUrl: z.preprocess(
      (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
      z.string().trim().url().optional(),
    ),
  })
  .strict();

export const listEventsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  })
  .strict();

export const eventIdParamsSchema = z
  .object({
    id: z.string().uuid("Invalid event id"),
  })
  .strict();

export const updateEventSchema = createEventSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type ListEventsQuery = z.infer<typeof listEventsQuerySchema>;
export type EventIdParams = z.infer<typeof eventIdParamsSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

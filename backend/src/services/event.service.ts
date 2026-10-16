import { prisma } from "../config/db.js";
import type { CreateEventInput, ListEventsQuery } from "../validators/event.validator.js";

export const createEvent = async (input: CreateEventInput) => {
  return prisma.event.create({
    data: {
      title: input.title,
      description: input.description,
      startsAt: input.startsAt,
      venue: input.venue,
      totalSeats: input.totalSeats,
      imageUrl: input.imageUrl ?? null,
    },
  });
};

export const listEvents = async ({ page, limit }: ListEventsQuery) => {
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      skip,
      take: limit,
      orderBy: { startsAt: "asc" },
    }),
    prisma.event.count(),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

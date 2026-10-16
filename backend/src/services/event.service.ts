import { prisma } from "../config/db.js";
import { promoteWaitlist } from "../lib/waitlist.js";
import type { CreateEventInput, ListEventsQuery, UpdateEventInput } from "../validators/event.validator.js";

type EventUpdateData = {
  title?: string;
  description?: string;
  startsAt?: Date;
  venue?: string;
  totalSeats?: number;
  imageUrl?: string | null;
};

type LockedEventRow = {
  id: string;
  totalSeats: number;
};

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

export const getEventById = async (id: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

export const updateEvent = async (id: string, input: UpdateEventInput) => {
  return prisma.$transaction(async (tx) => {
    const lockedEvents = await tx.$queryRaw<LockedEventRow[]>`
      SELECT id, "totalSeats"
      FROM "Event"
      WHERE id = ${id}::uuid
      FOR UPDATE
    `;

    const lockedEvent = lockedEvents[0];

    if (!lockedEvent) {
      throw new Error("Event not found");
    }

    const confirmedCount = await tx.booking.count({
      where: {
        eventId: id,
        status: "CONFIRMED",
      },
    });

    const nextTotalSeats = input.totalSeats ?? lockedEvent.totalSeats;

    if (nextTotalSeats < confirmedCount) {
      throw new Error("Total seats cannot be below confirmed booking count");
    }

    const data: EventUpdateData = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.startsAt !== undefined) data.startsAt = input.startsAt;
    if (input.venue !== undefined) data.venue = input.venue;
    if (input.totalSeats !== undefined) data.totalSeats = input.totalSeats;
    if (input.imageUrl !== undefined) data.imageUrl = input.imageUrl ?? null;

    const event = await tx.event.update({
      where: { id },
      data,
    });

    await promoteWaitlist(tx, id, event.totalSeats);

    return event;
  });
};

export const deleteEvent = async (id: string) => {
  await getEventById(id);

  await prisma.event.delete({
    where: { id },
  });
};

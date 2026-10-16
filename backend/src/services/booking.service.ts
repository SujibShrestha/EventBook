import { prisma } from "../config/db.js";
import logger from "../config/logger.js";
import { AppError } from "../lib/errors.js";
import { lockEvent } from "../lib/eventLock.js";
import { promoteWaitlist } from "../lib/waitlist.js";

const isUniqueViolation = (err: unknown): boolean =>
  typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";

export const bookSeat = async (userId: string, eventId: string) => {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Lock first, so nothing below can race with another request
      const event = await lockEvent(tx, eventId);

      // 2. Rule 3: past events cannot be booked
      if (event.startsAt <= new Date()) {
        throw new AppError(400, "EVENT_PAST", "This event has already started");
      }

      // 3. Rule 1: one active booking per user per event
      const existing = await tx.booking.findFirst({
        where: { userId, eventId, status: { in: ["CONFIRMED", "WAITLISTED"] } },
        select: { status: true },
      });
      if (existing) {
        throw existing.status === "CONFIRMED"
          ? new AppError(409, "ALREADY_BOOKED", "You already have a seat for this event")
          : new AppError(409, "ALREADY_WAITLISTED", "You are already on the waitlist");
      }

      // 4. If full, join the waitlist instead of overbooking.
      const taken = await tx.booking.count({ where: { eventId, status: "CONFIRMED" } });
      const status = taken >= event.totalSeats ? "WAITLISTED" : "CONFIRMED";

      // 5. Create the booking
      const booking = await tx.booking.create({
        data: { userId, eventId, status },
        select: { id: true, eventId: true, status: true, createdAt: true },
      });

      logger.info("booking: booking created", { userId, eventId, bookingId: booking.id, status });
      return booking;
    });
  } catch (err) {
    // Backstop: the partial unique index fired
    if (isUniqueViolation(err)) {
      throw new AppError(409, "ALREADY_BOOKED", "You already have a booking for this event");
    }
    throw err;
  }
};

export const cancelBooking = async (userId: string, bookingId: string) => {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        userId: true,
        eventId: true,
        status: true,
      },
    });

    if (!booking) {
      throw new AppError(404, "BOOKING_NOT_FOUND", "Booking not found");
    }

    if (booking.userId !== userId) {
      throw new AppError(403, "FORBIDDEN", "You cannot cancel this booking");
    }

    if (booking.status === "CANCELLED") {
      throw new AppError(409, "BOOKING_ALREADY_CANCELLED", "Booking is already cancelled");
    }

    const event = await lockEvent(tx, booking.eventId);

    if (event.startsAt <= new Date()) {
      throw new AppError(400, "EVENT_PAST", "This event has already started");
    }

    const cancelledBooking = await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
      select: {
        id: true,
        eventId: true,
        status: true,
        cancelledAt: true,
      },
    });

    if (booking.status === "CONFIRMED") {
      await promoteWaitlist(tx, booking.eventId, event.totalSeats);
    }

    logger.info("booking: booking cancelled", { userId, eventId: booking.eventId, bookingId });
    return cancelledBooking;
  });
};

export const listMyBookings = async (userId: string) => {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      eventId: true,
      status: true,
      createdAt: true,
      cancelledAt: true,
      event: {
        select: {
          id: true,
          title: true,
          startsAt: true,
          venue: true,
          imageUrl: true,
        },
      },
    },
  });
};

export const listUserBookingCounts = async () => {
  const [users, bookingCounts] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    }),
    prisma.booking.groupBy({
      by: ["userId", "status"],
      _count: {
        _all: true,
      },
    }),
  ]);

  const countsByUser = new Map<
    string,
    {
      totalBookings: number;
      confirmedBookings: number;
      waitlistedBookings: number;
      cancelledBookings: number;
    }
  >();

  for (const count of bookingCounts) {
    const current = countsByUser.get(count.userId) ?? {
      totalBookings: 0,
      confirmedBookings: 0,
      waitlistedBookings: 0,
      cancelledBookings: 0,
    };

    current.totalBookings += count._count._all;

    if (count.status === "CONFIRMED") {
      current.confirmedBookings += count._count._all;
    }

    if (count.status === "WAITLISTED") {
      current.waitlistedBookings += count._count._all;
    }

    if (count.status === "CANCELLED") {
      current.cancelledBookings += count._count._all;
    }

    countsByUser.set(count.userId, current);
  }

  return users.map((user) => ({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    ...(countsByUser.get(user.id) ?? {
      totalBookings: 0,
      confirmedBookings: 0,
      waitlistedBookings: 0,
      cancelledBookings: 0,
    }),
  }));
};

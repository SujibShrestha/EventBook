import { prisma } from "../config/db.js";
import logger from "../config/logger.js";
import { AppError } from "../lib/errors.js";
import { lockEvent } from "../lib/eventLock.js";

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

      // 4. Rule 2: no overbooking (count happens while the row is locked)
      const taken = await tx.booking.count({ where: { eventId, status: "CONFIRMED" } });
      if (taken >= event.totalSeats) {
        throw new AppError(409, "SOLD_OUT", "This event is sold out. You can join the waitlist");
      }

      // 5. Create the booking
      const booking = await tx.booking.create({
        data: { userId, eventId, status: "CONFIRMED" },
        select: { id: true, eventId: true, status: true, createdAt: true },
      });

      logger.info("booking: seat booked", { userId, eventId, bookingId: booking.id });
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
import type { Request, Response } from "express";
import { AppError } from "../lib/errors.js";
import { bookSeat } from "../services/booking.service.js";

export const createBooking = async (req: Request, res: Response) => {
  
  if (!req.user) throw new AppError(401, "UNAUTHORIZED");
  const eventId = (req.params.id);
  if (!eventId || Array.isArray(eventId)) {
    throw new AppError(400, "MISSING_EVENT_ID", "Event ID is required");
  }
  const booking = await bookSeat(req.user.id, eventId);
  res.status(201).json({ booking });
};
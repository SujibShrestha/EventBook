import type { Request, Response } from "express";
import { AppError } from "../lib/errors.js";
import { bookSeat, cancelBooking, listEventBookings, listMyBookings, listUserBookingCounts } from "../services/booking.service.js";

export const createBooking = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "UNAUTHORIZED");
  const eventId = (req.params.id);
  if (!eventId || Array.isArray(eventId)) {
    throw new AppError(400, "MISSING_EVENT_ID", "Event ID is required");
  }
  const booking = await bookSeat(req.user.id, eventId);
  res.status(201).json({ booking });
};

export const cancelMyBooking = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const bookingId = req.params.id;

  if (!bookingId || Array.isArray(bookingId)) {
    return res.status(400).json({ error: "Booking ID is required" });
  }

  const booking = await cancelBooking(req.user.id, bookingId);
  
  res.status(200).json({ booking });
};

export const getMyBookings = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "UNAUTHORIZED");

  const bookings = await listMyBookings(req.user.id);
  res.status(200).json({ bookings });
};

export const getEventBookings = async (req: Request, res: Response) => {
  if (!req.user) throw new AppError(401, "UNAUTHORIZED");

  const eventId = req.params.id;

  if (!eventId || Array.isArray(eventId)) {
    throw new AppError(400, "MISSING_EVENT_ID", "Event ID is required");
  }

  const result = await listEventBookings(eventId);
  res.status(200).json(result);
};

export const getUserBookingCounts = async (_req: Request, res: Response) => {
  const users = await listUserBookingCounts();
  res.status(200).json({ users });
};

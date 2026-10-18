import { Router } from "express";
import {
  cancelMyBooking,
  createBooking,
  getEventBookings,
  getMyBookings,
  getUserBookingCounts,
} from "../controllers/booking.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const bookingRouter = Router();

bookingRouter.post(
  "/events/:id/bookings",
  requireAuth,
  createBooking,
);
bookingRouter.get("/events/:id/bookings", requireAuth, requireAdmin, getEventBookings);
bookingRouter.get("/bookings/me", requireAuth, getMyBookings);
bookingRouter.get("/bookings/admin/users", requireAuth, requireAdmin, getUserBookingCounts);
bookingRouter.patch("/bookings/:id/cancel", requireAuth, cancelMyBooking);

export default bookingRouter;

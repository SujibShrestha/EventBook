import { Router } from "express";
import { createBooking } from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.js";

const bookingRouter = Router();

bookingRouter.post(
  "/events/:id/bookings",
  requireAuth,
  createBooking,
);

export default bookingRouter;
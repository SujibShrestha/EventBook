import { Router } from "express";
import rateLimit from "express-rate-limit";

import { login, logout, me, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 10 minutes
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "RATE_LIMITED", message: "Too many requests" },
});

const authRouter = Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.get("/me", requireAuth, me);
authRouter.post("/logout", requireAuth, logout);

export default authRouter;
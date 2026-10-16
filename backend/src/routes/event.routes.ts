import { Router } from "express";

import { create, list } from "../controllers/event.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const eventRouter = Router();

eventRouter.get("/", list);
eventRouter.post("/", requireAuth, requireAdmin, create);

export default eventRouter;

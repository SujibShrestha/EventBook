import { Router } from "express";

import { create, getById, list, remove, update } from "../controllers/event.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const eventRouter = Router();

eventRouter.get("/", list);
eventRouter.get("/:id", getById);
eventRouter.post("/", requireAuth, requireAdmin, create);
eventRouter.patch("/:id", requireAuth, requireAdmin, update);
eventRouter.delete("/:id", requireAuth, requireAdmin, remove);

export default eventRouter;

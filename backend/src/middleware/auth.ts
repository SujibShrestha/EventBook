import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import logger from "../config/logger.js";
import { AppError } from "../lib/errors.js";

import type { AuthRole } from "../types/auth.js";
import { prisma } from "../config/db.js";

function isAuthRole(value: unknown): value is AuthRole {
  return value === "USER" || value === "ADMIN";
}

function getBearerToken(req: Request) {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return undefined;
  }

  return authorization.slice("Bearer ".length).trim();
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
    }

    const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ["HS256"] });

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.sub !== "string" ||
      !isAuthRole(decoded.role)
    ) {
      throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError(401, "UNAUTHORIZED", "Unauthorized"));
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    logger.info("admin access denied", { userId: req.user?.id });
    next(new AppError(403, "FORBIDDEN", "Forbidden"));
    return;
  }

  next();
}

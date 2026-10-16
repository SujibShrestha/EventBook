import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { getCurrentUser, loginUser, registerUser } from "../services/auth.service.js";
import type { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import logger from "../config/logger.js";

export async function register(req: Request, res: Response) {
  try{
    const { name, email, password } = registerSchema.parse(req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ error: "INVALID_INPUT", message: "Name, email, and password are required" });
    }
    const result = await registerUser({ name, email, password } as RegisterInput);
    if (!result) {
      return res.status(400).json({ error: "REGISTRATION_FAILED", message: "User registration failed" });
    }
    logger.info(`User registered: ${result.user.email}`);
    return res.status(201).json({
      success: true,
      data:result
    });

  } catch (error) {
  logger.error(`Registration error: ${(error as Error).message}`);
   return res.status(400).json({ error: "INVALID_INPUT", message: (error as Error).message });
   
  }
  
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginUser({ email, password } as LoginInput);
    if (!result) {
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
      });
    }

    logger.info(`User logged in: ${result.user.email}`);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      error: "INVALID_CREDENTIALS",
      message: (error as Error).message,
    });
  }
}

export async function me(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    const user = await getCurrentUser(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    logger.info(`Fetched current user: ${user.email}`);

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: (error as Error).message,
    });
  }
}

export function logout(req: Request, res: Response) {
  logger.info(`User logged out: ${req.user?.id ?? "unknown"}`);
  // Logout is stateless for JWT auth; the client deletes its token.
  res.status(204).send();
}

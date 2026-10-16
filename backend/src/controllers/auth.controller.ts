import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import { registerUser } from "../services/auth.service.js";
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
   return res.status(400).json({ error: "INVALID_INPUT", message: (error as Error).message });
   
  }
  
}

export async function login(req: Request, res: Response) {
  // const result = await loginUser(req.body as LoginInput);
  // res.status(200).json(result);
}

export async function me(req: Request, res: Response) {
  // const user = await getCurrentUser(req.user!.id);
  // res.status(200).json({ user });
}

export function logout(_req: Request, res: Response) {
  // Logout is stateless for JWT auth; the client deletes its token.
  res.status(204).send();
}

import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors.js';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'NOT_FOUND' });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.code, message: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'VALIDATION_ERROR', details: err.flatten().fieldErrors });
  }
  if ((err as any)?.code === 'P2002') {
    return res.status(409).json({ error: 'CONFLICT' });
  }
  console.error(err);
  res.status(500).json({ error: 'INTERNAL_ERROR' });
}
import type { Request, Response } from "express";

import logger from "../config/logger.js";
import { createEvent, listEvents } from "../services/event.service.js";
import { createEventSchema, listEventsQuerySchema } from "../validators/event.validator.js";
import type { CreateEventInput, ListEventsQuery } from "../validators/event.validator.js";

export async function create(req: Request, res: Response) {
  try {
    const { title, description, startsAt, venue, totalSeats, imageUrl } = createEventSchema.parse(req.body);

    if (!title || !description || !startsAt || !venue || !totalSeats) {
      return res.status(400).json({
        error: "INVALID_INPUT",
        message: "Title, description, startsAt, venue, and totalSeats are required",
      });
    }

    const input: CreateEventInput = {
      title,
      description,
      startsAt,
      venue,
      totalSeats,
      imageUrl,
    };

    const event = await createEvent(input);

    logger.info(`Event created: ${event.id}`);

    return res.status(201).json({
      success: true,
      data: { event },
    });
  } catch (error) {
    logger.error(`Event creation error: ${(error as Error).message}`);

    return res.status(400).json({
      error: "INVALID_INPUT",
      message: (error as Error).message,
    });
  }
}

export async function list(req: Request, res: Response) {
  const query = listEventsQuerySchema.parse(req.query) as ListEventsQuery;
  const result = await listEvents(query);

  return res.status(200).json({
    success: true,
    data: result,
  });
}

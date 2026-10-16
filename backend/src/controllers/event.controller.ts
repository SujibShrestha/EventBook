import type { Request, Response } from "express";

import logger from "../config/logger.js";
import { createEvent, deleteEvent, getEventById, listEvents, updateEvent } from "../services/event.service.js";
import {
  createEventSchema,
  eventIdParamsSchema,
  listEventsQuerySchema,
  updateEventSchema,
} from "../validators/event.validator.js";
import type { CreateEventInput, EventIdParams, ListEventsQuery, UpdateEventInput } from "../validators/event.validator.js";

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

export async function getById(req: Request, res: Response) {
  try {
    const { id } = eventIdParamsSchema.parse(req.params) as EventIdParams;
    if (!id) {
      return res.status(400).json({
        error: "INVALID_INPUT",
        message: "Event id is required",
      });
    }
    const event = await getEventById(id);

    return res.status(200).json({
      success: true,
      data: { event },
    });
  } catch (error) {
    const message = (error as Error).message;

    return res.status(message === "Event not found" ? 404 : 400).json({
      error: message === "Event not found" ? "EVENT_NOT_FOUND" : "INVALID_INPUT",
      message,
    });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = eventIdParamsSchema.parse(req.params) as EventIdParams;
    const input = updateEventSchema.parse(req.body) as UpdateEventInput;

    if (!id && Object.keys(input).length === 0) {
      return res.status(400).json({
        error: "INVALID_INPUT",
        message: "Event id and update input is required",
      });
    }
    const event = await updateEvent(id, input);
    if(!event) {
      return res.status(401).json({
        error: "Error while updating event",
        message: "Error while updating event",
      });
    }

    logger.info(`Event updated: ${event.id}`);

    return res.status(200).json({
      success: true,
      data: { event },
    });
  } catch (error) {
    const message = (error as Error).message;
    logger.error(`Event update error: ${message}`);

    return res.status(message === "Event not found" ? 404 : 400).json({
      error: message === "Event not found" ? "EVENT_NOT_FOUND" : "INVALID_INPUT",
      message,
    });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = eventIdParamsSchema.parse(req.params) as EventIdParams;
    await deleteEvent(id);

    logger.info(`Event deleted: ${id}`);

    return res.status(204).send();
  } catch (error) {
    const message = (error as Error).message;
    logger.error(`Event delete error: ${message}`);

    return res.status(message === "Event not found" ? 404 : 400).json({
      error: message === "Event not found" ? "EVENT_NOT_FOUND" : "INVALID_INPUT",
      message,
    });
  }
}

import type { Prisma } from "../generated/client.js";
import { AppError } from "./errors.js";

export type LockedEvent = { id: string; startsAt: Date; totalSeats: number };

// SELECT ... FOR UPDATE makes concurrent transactions on the same event wait in line.
export async function lockEvent(
  tx: Prisma.TransactionClient,
  eventId: string,
): Promise<LockedEvent> {
  const rows = await tx.$queryRaw<LockedEvent[]>`
    SELECT id, "startsAt", "totalSeats"
    FROM "Event"
    WHERE id = ${eventId}::uuid
    FOR UPDATE`;

  const event = rows[0];
  if (!event) throw new AppError(404, "EVENT_NOT_FOUND", "Event not found");
  return event;
}
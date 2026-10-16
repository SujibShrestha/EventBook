import type { Prisma } from "../generated/client.js";

export async function promoteWaitlist(
  tx: Prisma.TransactionClient,
  eventId: string,
  totalSeats: number,
) {
  const confirmedCount = await tx.booking.count({
    where: {
      eventId,
      status: "CONFIRMED",
    },
  });

  const availableSeats = totalSeats - confirmedCount;

  if (availableSeats <= 0) {
    return;
  }

  const waitlistedBookings = await tx.booking.findMany({
    where: {
      eventId,
      status: "WAITLISTED",
    },
    orderBy: {
      createdAt: "asc",
    },
    take: availableSeats,
    select: {
      id: true,
    },
  });

  if (waitlistedBookings.length === 0) {
    return;
  }

  await tx.booking.updateMany({
    where: {
      id: {
        in: waitlistedBookings.map((booking) => booking.id),
      },
    },
    data: {
      status: "CONFIRMED",
    },
  });
}

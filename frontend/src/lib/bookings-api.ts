import { api } from "@/src/lib/api"
import type { BookingStatus } from "@/src/lib/events-api"

export type MyBooking = {
  id: string
  eventId: string
  status: BookingStatus
  createdAt: string
  cancelledAt: string | null
  event: {
    id: string
    title: string
    startsAt: string
    venue: string
    imageUrl: string | null
  }
}

type MyBookingsResponse = {
  bookings: MyBooking[]
}

type CancelBookingResponse = {
  booking: {
    id: string
    eventId: string
    status: BookingStatus
    cancelledAt: string | null
  }
}

export async function listMyBookings() {
  const response = await api.get<MyBookingsResponse>("/bookings/me")

  return response.data.bookings
}

export async function cancelMyBooking(bookingId: string) {
  const response = await api.patch<CancelBookingResponse>(`/bookings/${bookingId}/cancel`)

  return response.data.booking
}

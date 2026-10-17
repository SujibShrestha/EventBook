import { api } from "@/src/lib/api"

export type PublicEvent = {
  id: string
  title: string
  description: string
  startsAt: string
  venue: string
  totalSeats: number
  confirmedBookings: number
  availableSeats: number
  imageUrl: string | null
  createdAt: string
}

export type EventsPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

type EventsResponse = {
  data: {
    events: PublicEvent[]
    pagination: EventsPagination
  }
}

type EventResponse = {
  data: {
    event: PublicEvent
  }
}

export type BookingStatus = "CONFIRMED" | "WAITLISTED" | "CANCELLED"

export type BookingRecord = {
  id: string
  eventId: string
  status: BookingStatus
  createdAt: string
}

type BookingResponse = {
  booking: BookingRecord
}

export async function listPublicEvents(page = 1, limit = 9) {
  const response = await api.get<EventsResponse>("/events", {
    params: { page, limit },
  })

  return response.data.data
}

export async function getPublicEvent(id: string) {
  const response = await api.get<EventResponse>(`/events/${id}`)

  return response.data.data.event
}

export async function bookPublicEvent(eventId: string) {
  const response = await api.post<BookingResponse>(`/events/${eventId}/bookings`)

  return response.data.booking
}

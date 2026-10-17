import { api } from "@/src/lib/api"

export type EventRecord = {
  id: string
  title: string
  description: string
  startsAt: string
  venue: string
  totalSeats: number
  imageUrl: string | null
  createdAt: string
}

export type EventsPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type EventPayload = {
  title: string
  description: string
  startsAt: string
  venue: string
  totalSeats: number
  imageUrl?: string
}

export type UserBookingCount = {
  userId: string
  name: string
  email: string
  role: "USER" | "ADMIN"
  totalBookings: number
  confirmedBookings: number
  waitlistedBookings: number
  cancelledBookings: number
}

type EventsResponse = {
  data: {
    events: EventRecord[]
    pagination: EventsPagination
  }
}

type EventResponse = {
  data: {
    event: EventRecord
  }
}

type UserBookingCountsResponse = {
  users: UserBookingCount[]
}

export async function listAdminEvents(page = 1, limit = 20) {
  const response = await api.get<EventsResponse>("/events", {
    params: { page, limit },
  })

  return response.data.data
}

export async function getAdminEvent(id: string) {
  const response = await api.get<EventResponse>(`/events/${id}`)

  return response.data.data.event
}

export async function createAdminEvent(payload: EventPayload) {
  const response = await api.post<EventResponse>("/events", payload)

  return response.data.data.event
}

export async function updateAdminEvent(id: string, payload: EventPayload) {
  const response = await api.patch<EventResponse>(`/events/${id}`, payload)

  return response.data.data.event
}

export async function deleteAdminEvent(id: string) {
  await api.delete(`/events/${id}`)
}

export async function listUserBookingCounts() {
  const response = await api.get<UserBookingCountsResponse>("/bookings/admin/users")

  return response.data.users
}

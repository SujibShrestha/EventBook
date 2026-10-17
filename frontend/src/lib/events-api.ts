import { api } from "@/src/lib/api"

export type PublicEvent = {
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

type EventsResponse = {
  data: {
    events: PublicEvent[]
    pagination: EventsPagination
  }
}

export async function listPublicEvents(page = 1, limit = 9) {
  const response = await api.get<EventsResponse>("/events", {
    params: { page, limit },
  })

  return response.data.data
}

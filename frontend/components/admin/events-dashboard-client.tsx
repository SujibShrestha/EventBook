"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  CalendarDays,
  Edit3,
  ImageIcon,
  PlusCircle,
  Search,
  TicketCheck,
  Trash2,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { deleteAdminEvent, listAdminEvents, type EventRecord, type EventsPagination } from "@/src/lib/admin-api"
import { getApiErrorMessage } from "@/src/lib/api-error"

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function getStatus(startsAt: string) {
  return new Date(startsAt).getTime() > Date.now() ? "Upcoming" : "Past"
}

export function EventsDashboardClient() {
  const router = useRouter()
  const [events, setEvents] = useState<EventRecord[]>([])
  const [pagination, setPagination] = useState<EventsPagination | null>(null)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState("")
  const [pendingDelete, setPendingDelete] = useState<EventRecord | null>(null)

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return events

    return events.filter((event) => {
      return (
        event.title.toLowerCase().includes(normalizedQuery) ||
        event.venue.toLowerCase().includes(normalizedQuery) ||
        event.description.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [events, query])

  const totalSeats = events.reduce((sum, event) => sum + event.totalSeats, 0)
  const upcomingEvents = events.filter((event) => getStatus(event.startsAt) === "Upcoming").length

  useEffect(() => {
    let isMounted = true

    async function loadEvents() {
      setIsLoading(true)

      try {
        const data = await listAdminEvents(page, 20)

        if (!isMounted) return

        setEvents(data.events)
        setPagination(data.pagination)
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Unable to load events."))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadEvents()

    return () => {
      isMounted = false
    }
  }, [page])

  async function handleDelete(event: EventRecord) {
    setDeletingId(event.id)

    try {
      await deleteAdminEvent(event.id)
      setEvents((current) => current.filter((item) => item.id !== event.id))
      setPendingDelete(null)
      toast.success("Event deleted.")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete event."))
    } finally {
      setDeletingId("")
    }
  }

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total events</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{pagination?.total ?? events.length}</p>
            </div>
            <CalendarDays className="size-8 text-indigo-600" aria-hidden="true" />
          </CardContent>
        </Card>
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Upcoming</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{upcomingEvents}</p>
            </div>
            <TicketCheck className="size-8 text-emerald-600" aria-hidden="true" />
          </CardContent>
        </Card>
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Seats listed</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{totalSeats}</p>
            </div>
            <Users className="size-8 text-amber-600" aria-hidden="true" />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Search events"
              className="pl-9"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <Link
            href="/admin/events/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <PlusCircle className="size-4" aria-hidden="true" />
            New event
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Starts</th>
                <th className="px-4 py-3">Venue</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                    Loading events...
                  </td>
                </tr>
              ) : filteredEvents.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-slate-500" colSpan={6}>
                    No events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="align-middle">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex size-12 items-center justify-center overflow-hidden rounded-lg bg-slate-100 bg-cover bg-center"
                          style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : undefined}
                        >
                          {event.imageUrl ? (
                            <span className="sr-only">Event image</span>
                          ) : (
                            <ImageIcon className="size-5 text-slate-400" aria-hidden="true" />
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/events/${event.id}/attendees`}
                            className="font-semibold text-slate-950 transition-colors hover:text-indigo-700"
                          >
                            {event.title}
                          </Link>
                          <p className="line-clamp-1 max-w-xs text-xs text-slate-500">{event.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{formatEventDate(event.startsAt)}</td>
                    <td className="px-4 py-4 text-slate-700">{event.venue}</td>
                    <td className="px-4 py-4 font-semibold text-slate-950">{event.totalSeats}</td>
                    <td className="px-4 py-4">
                      <Badge
                        className={
                          getStatus(event.startsAt) === "Upcoming"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }
                      >
                        {getStatus(event.startsAt)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="border-slate-200 bg-white text-slate-700"
                          aria-label={`View attendees for ${event.title}`}
                          onClick={() => router.push(`/admin/events/${event.id}/attendees`)}
                        >
                          <Users className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="border-slate-200 bg-white text-slate-700"
                          aria-label={`Edit ${event.title}`}
                          onClick={() => router.push(`/admin/events/${event.id}/edit`)}
                        >
                          <Edit3 className="size-4" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon-sm"
                          aria-label={`Delete ${event.title}`}
                          disabled={deletingId === event.id}
                          onClick={() => setPendingDelete(event)}
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
          <span>
            Page {pagination?.page ?? page} of {pagination?.totalPages ?? 1}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-slate-200 bg-white"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-slate-200 bg-white"
              disabled={!pagination || page >= pagination.totalPages || isLoading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      {pendingDelete ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-event-title"
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                <Trash2 className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 id="delete-event-title" className="text-lg font-semibold text-slate-950">
                  Delete event?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This will permanently delete <span className="font-semibold text-slate-950">{pendingDelete.title}</span>.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="border-slate-200 bg-white"
                disabled={deletingId === pendingDelete.id}
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deletingId === pendingDelete.id}
                onClick={() => void handleDelete(pendingDelete)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                {deletingId === pendingDelete.id ? "Deleting..." : "Delete event"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

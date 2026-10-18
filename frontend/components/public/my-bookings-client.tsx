"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { CalendarDays, CheckCircle2, Clock, MapPin, Search, Ticket, Trash2, XCircle } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cancelMyBooking, listMyBookings, type MyBooking } from "@/src/lib/bookings-api"
import { getApiErrorMessage } from "@/src/lib/api-error"

type BookingFilter = "active" | "past"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function isActiveBooking(booking: MyBooking) {
  return booking.status !== "CANCELLED" && new Date(booking.event.startsAt).getTime() > Date.now()
}

function statusClass(status: MyBooking["status"]) {
  if (status === "CONFIRMED") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (status === "WAITLISTED") return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-slate-200 bg-slate-50 text-slate-600"
}

export function MyBookingsClient() {
  const router = useRouter()
  const [bookings, setBookings] = useState<MyBooking[]>([])
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<BookingFilter>("active")
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState("")

  useEffect(() => {
    let isMounted = true

    async function loadBookings() {
      setIsLoading(true)

      try {
        const data = await listMyBookings()
        if (isMounted) setBookings(data)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error("Log in to view your bookings.")
          router.replace("/login")
          return
        }

        toast.error(getApiErrorMessage(error, "Unable to load your bookings."))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadBookings()

    return () => {
      isMounted = false
    }
  }, [router])

  const counts = useMemo(() => {
    return bookings.reduce(
      (current, booking) => ({
        active: current.active + (isActiveBooking(booking) ? 1 : 0),
        past: current.past + (!isActiveBooking(booking) ? 1 : 0),
      }),
      { active: 0, past: 0 },
    )
  }, [bookings])

  const filteredBookings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return bookings.filter((booking) => {
      const matchesFilter = filter === "active" ? isActiveBooking(booking) : !isActiveBooking(booking)
      const matchesQuery =
        !normalizedQuery ||
        booking.event.title.toLowerCase().includes(normalizedQuery) ||
        booking.event.venue.toLowerCase().includes(normalizedQuery) ||
        booking.id.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesQuery
    })
  }, [bookings, filter, query])

  async function handleCancel(booking: MyBooking) {
    const confirmed = window.confirm(`Cancel booking for "${booking.event.title}"?`)

    if (!confirmed) return

    setCancellingId(booking.id)

    try {
      const cancelled = await cancelMyBooking(booking.id)
      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id
            ? {
                ...item,
                status: cancelled.status,
                cancelledAt: cancelled.cancelledAt,
              }
            : item,
        ),
      )
      toast.success("Booking cancelled.")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to cancel booking."))
    } finally {
      setCancellingId("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex w-fit rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            className={
              filter === "active"
                ? "inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-indigo-700 shadow-sm"
                : "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-600"
            }
            onClick={() => setFilter("active")}
          >
            Active
            <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-xs">{counts.active}</span>
          </button>
          <button
            type="button"
            className={
              filter === "past"
                ? "inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-indigo-700 shadow-sm"
                : "inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-600"
            }
            onClick={() => setFilter("past")}
          >
            Past & cancelled
            <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-xs">{counts.past}</span>
          </button>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Filter by event, venue, or booking ID"
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <section className="space-y-4">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
            Loading your bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
              <Ticket className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-950">No bookings found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Browse events and reserve a seat to see your passes here.
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Browse events
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const active = isActiveBooking(booking)

            return (
              <article
                key={booking.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="grid gap-4 p-5 lg:grid-cols-[120px_minmax(0,1fr)_auto] lg:items-center">
                  <div className="flex h-28 flex-col items-center justify-center rounded-xl bg-slate-100 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                      {new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(booking.event.startsAt))}
                    </span>
                    <span className="text-4xl font-bold text-slate-950">
                      {new Intl.DateTimeFormat("en", { day: "2-digit" }).format(new Date(booking.event.startsAt))}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(booking.event.startsAt))}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={statusClass(booking.status)}>{booking.status}</Badge>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Booking #{booking.id.slice(0, 8)}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold leading-7 text-slate-950">{booking.event.title}</h2>
                    <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-indigo-600" aria-hidden="true" />
                        {formatDate(booking.event.startsAt)}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="size-4 text-rose-600" aria-hidden="true" />
                        {booking.event.venue}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:w-44">
                    <Link
                      href={`/events/${booking.eventId}`}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      <Ticket className="size-4" aria-hidden="true" />
                      Event details
                    </Link>
                    {active ? (
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={cancellingId === booking.id}
                        className="h-10 rounded-lg"
                        onClick={() => void handleCancel(booking)}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                        {cancellingId === booking.id ? "Cancelling..." : "Cancel"}
                      </Button>
                    ) : (
                      <div className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-slate-500">
                        {booking.status === "CANCELLED" ? (
                          <XCircle className="size-4" aria-hidden="true" />
                        ) : (
                          <Clock className="size-4" aria-hidden="true" />
                        )}
                        {booking.status === "CANCELLED" ? "Cancelled" : "Archived"}
                      </div>
                    )}
                  </div>
                </div>

                {booking.status === "CONFIRMED" && active ? (
                  <div className="flex items-center gap-2 border-t border-slate-100 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    Ready for check-in. Your booking is confirmed.
                  </div>
                ) : null}
              </article>
            )
          })
        )}
      </section>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CalendarDays, Mail, TicketCheck, Users } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getApiErrorMessage } from "@/src/lib/api-error"
import { listEventBookings, type EventBooking, type EventBookingsResult } from "@/src/lib/admin-api"

type EventAttendeesClientProps = {
  eventId: string
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function statusClass(status: EventBooking["status"]) {
  if (status === "CONFIRMED") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (status === "WAITLISTED") return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-slate-200 bg-slate-50 text-slate-600"
}

export function EventAttendeesClient({ eventId }: EventAttendeesClientProps) {
  const [data, setData] = useState<EventBookingsResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadBookings() {
      setIsLoading(true)

      try {
        const result = await listEventBookings(eventId)
        if (isMounted) setData(result)
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Unable to load event attendees."))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadBookings()

    return () => {
      isMounted = false
    }
  }, [eventId])

  const counts = useMemo(() => {
    return (data?.bookings ?? []).reduce(
      (current, booking) => ({
        confirmed: current.confirmed + (booking.status === "CONFIRMED" ? 1 : 0),
        waitlisted: current.waitlisted + (booking.status === "WAITLISTED" ? 1 : 0),
        cancelled: current.cancelled + (booking.status === "CANCELLED" ? 1 : 0),
      }),
      { confirmed: 0, waitlisted: 0, cancelled: 0 },
    )
  }, [data])

  if (isLoading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading attendees...</div>
  }

  if (!data) {
    return <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Event attendees unavailable.</div>
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Event attendees</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">{data.event.title}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <CalendarDays className="size-4 text-indigo-600" aria-hidden="true" />
              {formatDate(data.event.startsAt)} at {data.event.venue}
            </p>
          </div>
          <Link href="/admin/events" className="text-sm font-semibold text-indigo-700 hover:underline">
            Back to events
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Confirmed</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{counts.confirmed}</p>
            </div>
            <TicketCheck className="size-8 text-emerald-600" aria-hidden="true" />
          </CardContent>
        </Card>
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Waitlisted</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{counts.waitlisted}</p>
            </div>
            <Users className="size-8 text-amber-600" aria-hidden="true" />
          </CardContent>
        </Card>
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Cancelled</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{counts.cancelled}</p>
            </div>
            <Users className="size-8 text-slate-500" aria-hidden="true" />
          </CardContent>
        </Card>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Booked at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.bookings.length === 0 ? (
                <tr>
                  <td className="px-4 py-10 text-center text-slate-500" colSpan={4}>
                    No users have booked this event yet.
                  </td>
                </tr>
              ) : (
                data.bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-4 font-semibold text-slate-950">{booking.user.name}</td>
                    <td className="px-4 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <Mail className="size-4 text-slate-400" aria-hidden="true" />
                        {booking.user.email}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={statusClass(booking.status)}>{booking.status}</Badge>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(booking.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

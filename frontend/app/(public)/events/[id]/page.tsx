import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, MapPin, ShieldCheck, Ticket, Users } from "lucide-react"

import { BookEventPanel } from "@/components/public/book-event-panel"
import { getPublicEvent, type PublicEvent } from "@/src/lib/events-api"

export const instant = false

type EventDetailsPageProps = {
  params: Promise<{
    id: string
  }>
}

const CURRENT_TIME = new Date("2026-10-17T00:00:00+05:45").getTime()

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

async function loadEvent(id: string) {
  try {
    return await getPublicEvent(id)
  } catch {
    return null
  }
}

function EventImage({ event }: { event: PublicEvent }) {
  return (
    <div
      className="relative flex aspect-[16/9] min-h-72 items-center justify-center overflow-hidden rounded-xl bg-slate-200 bg-cover bg-center shadow-sm"
      style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : undefined}
    >
      {event.imageUrl ? null : <Ticket className="size-16 text-slate-400" aria-hidden="true" />}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 shadow-sm backdrop-blur">
        <ShieldCheck className="size-4" aria-hidden="true" />
        Verified EventBook listing
      </span>
    </div>
  )
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { id } = await params
  const event = await loadEvent(id)

  if (!event) {
    notFound()
  }

  const startsAt = new Date(event.startsAt)
  const eventStarted = startsAt.getTime() <= CURRENT_TIME

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to events
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Event
              </span>
              <span
                className={
                  eventStarted
                    ? "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600"
                    : "inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700"
                }
              >
                <span className={eventStarted ? "size-1.5 rounded-full bg-slate-500" : "size-1.5 rounded-full bg-emerald-600"} />
                {eventStarted ? "Started" : "Booking open"}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              {event.title}
            </h1>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <CalendarDays className="size-5 text-indigo-600" aria-hidden="true" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Date</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{formatDate(event.startsAt)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <Clock className="size-5 text-indigo-600" aria-hidden="true" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Time</p>
                <p className="mt-1 text-sm font-semibold text-slate-950">{formatTime(event.startsAt)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <MapPin className="size-5 text-indigo-600" aria-hidden="true" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Venue</p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-950">{event.venue}</p>
              </div>
            </div>
          </div>

          <EventImage event={event} />

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">About this event</h2>
            <div className="mt-3 h-1 w-12 rounded-full bg-indigo-600" />
            <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">{event.description}</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <Users className="size-6 text-emerald-600" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-slate-950">Capacity managed</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {event.availableSeats} of {event.totalSeats} seats available.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <CheckCircle2 className="size-6 text-indigo-600" aria-hidden="true" />
              <h3 className="mt-3 font-semibold text-slate-950">Instant confirmation</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">Confirmed bookings return immediately after checkout.</p>
            </div>
          </section>
        </div>

        <BookEventPanel
          eventId={event.id}
          eventStarted={eventStarted}
          totalSeats={event.totalSeats}
          availableSeats={event.availableSeats}
        />
      </section>
    </>
  )
}

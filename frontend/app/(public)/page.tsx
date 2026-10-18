import Link from "next/link"
import { connection } from "next/server"
import { ArrowRight, CalendarDays, MapPin, Search } from "lucide-react"

import { listPublicEvents, type PublicEvent } from "@/src/lib/events-api"

export const instant = false

type HomePageProps = {
  searchParams: Promise<{
    page?: string
    q?: string
  }>
}

function parsePage(value: string | undefined) {
  const page = Number(value)

  if (!Number.isInteger(page) || page < 1) return 1

  return page
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function eventMatchesQuery(event: PublicEvent, query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return true

  return (
    event.title.toLowerCase().includes(normalizedQuery) ||
    event.venue.toLowerCase().includes(normalizedQuery) ||
    event.description.toLowerCase().includes(normalizedQuery)
  )
}

async function getEvents(page: number) {
  try {
    const data = await listPublicEvents(page, 9)

    return { ...data, hasError: false }
  } catch {
    return {
      events: [],
      pagination: {
        page,
        limit: 9,
        total: 0,
        totalPages: 1,
      },
      hasError: true,
    }
  }
}

function buildPageHref(page: number, query: string) {
  const params = new URLSearchParams()

  if (page > 1) params.set("page", String(page))
  if (query) params.set("q", query)

  const search = params.toString()

  return search ? `/?${search}` : "/"
}

function EventCard({ event }: { event: PublicEvent }) {
  const isUpcoming = new Date(event.startsAt).getTime() > Date.now()

  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="relative flex h-48 items-center justify-center bg-slate-200 bg-cover bg-center"
        style={event.imageUrl ? { backgroundImage: `url(${event.imageUrl})` } : undefined}
      >
        {event.imageUrl ? null : <CalendarDays className="size-12 text-slate-400" aria-hidden="true" />}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold uppercase text-slate-700 shadow-sm backdrop-blur">
          <span className={isUpcoming ? "size-1.5 rounded-full bg-emerald-600" : "size-1.5 rounded-full bg-slate-500"} />
          {isUpcoming ? "Open booking" : "Past event"}
        </span>
        <span className="absolute bottom-3 left-3 rounded-md bg-slate-950/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
          {event.availableSeats} seats left
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
          <CalendarDays className="size-4" aria-hidden="true" />
          <span>{formatDate(event.startsAt)}</span>
        </div>

        <h2 className="mt-3 line-clamp-2 text-lg font-semibold leading-6 text-slate-950 transition-colors group-hover:text-indigo-700">
          {event.title}
        </h2>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{event.description}</p>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span className="truncate">{event.venue}</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">EventBook</span>
          <Link
            href={`/events/${event.id}`}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-600 px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Details
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default async function Home({ searchParams }: HomePageProps) {
  await connection()

  const resolvedSearchParams = await searchParams
  const page = parsePage(resolvedSearchParams.page)
  const query = resolvedSearchParams.q?.trim() ?? ""
  const { events, pagination, hasError } = await getEvents(page)
  const visibleEvents = events.filter((event) => eventMatchesQuery(event, query))

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            Live event catalog
          </div>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
            Find your next event
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Discover workshops, conferences, and meetups, then reserve your seat with your EventBook account.
          </p>

          <form className="mx-auto mt-8 max-w-3xl rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-sm" action="/">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative flex-1">
                <span className="sr-only">Search events</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Search events by title, topic, or venue"
                  className="h-11 w-full rounded-lg border border-transparent bg-white pl-9 pr-3 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
              >
                Find Events
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </form>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold leading-8 text-slate-950">Upcoming events</h2>
            <p className="text-sm leading-6 text-slate-600">
              Showing {visibleEvents.length} of {pagination.total} events
            </p>
          </div>
          {query ? (
            <Link href="/" className="text-sm font-semibold text-indigo-700 transition-colors hover:text-indigo-900">
              Clear search
            </Link>
          ) : null}
        </div>

        {hasError ? (
          <div className="rounded-xl border border-rose-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-rose-50 text-rose-700">
              <Search className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-950">Unable to load events</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Please check the API connection and try refreshing the page.
            </p>
          </div>
        ) : visibleEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 text-indigo-700">
              <Search className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-950">No events found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              We could not find events matching your search. Try a different keyword or check back soon.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm sm:flex-row">
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Link
              href={buildPageHref(Math.max(1, page - 1), query)}
              aria-disabled={page <= 1}
              className={
                page <= 1
                  ? "inline-flex h-9 cursor-not-allowed items-center rounded-lg border border-slate-200 px-3 font-semibold text-slate-400"
                  : "inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              }
            >
              Previous
            </Link>
            <Link
              href={buildPageHref(page + 1, query)}
              aria-disabled={page >= pagination.totalPages}
              className={
                page >= pagination.totalPages
                  ? "inline-flex h-9 cursor-not-allowed items-center rounded-lg border border-slate-200 px-3 font-semibold text-slate-400"
                  : "inline-flex h-9 items-center rounded-lg border border-slate-200 px-3 font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              }
            >
              Next
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

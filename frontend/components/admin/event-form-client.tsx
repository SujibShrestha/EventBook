"use client"

import type { FormEvent } from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { CalendarClock, ImageIcon, MapPin, Save, Ticket, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createAdminEvent, getAdminEvent, updateAdminEvent, type EventPayload } from "@/src/lib/admin-api"
import { getApiErrorMessage } from "@/src/lib/api-error"
import { eventFormSchema, getFirstEventValidationMessage } from "@/src/validators/event"

type EventFormClientProps = {
  mode: "create" | "edit"
  eventId?: string
}

function toDateInput(value: string) {
  return new Date(value).toISOString().slice(0, 10)
}

function toTimeInput(value: string) {
  return new Date(value).toTimeString().slice(0, 5)
}

export function EventFormClient({ mode, eventId }: EventFormClientProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [venue, setVenue] = useState("")
  const [totalSeats, setTotalSeats] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isLoading, setIsLoading] = useState(mode === "edit")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const capacityLabel = useMemo(() => {
    const seats = Number(totalSeats)
    if (!Number.isFinite(seats) || seats <= 0) return "Set capacity"
    if (seats < 50) return "Intimate room"
    if (seats < 200) return "Mid-size event"
    return "Large venue"
  }, [totalSeats])

  useEffect(() => {
    if (mode !== "edit" || !eventId) return

    let isMounted = true
    const currentEventId = eventId

    async function loadEvent() {
      setIsLoading(true)

      try {
        const event = await getAdminEvent(currentEventId)

        if (!isMounted) return

        setTitle(event.title)
        setDescription(event.description)
        setDate(toDateInput(event.startsAt))
        setTime(toTimeInput(event.startsAt))
        setVenue(event.venue)
        setTotalSeats(String(event.totalSeats))
        setImageUrl(event.imageUrl ?? "")
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Unable to load event."))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadEvent()

    return () => {
      isMounted = false
    }
  }, [eventId, mode])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const parsed = eventFormSchema.safeParse({
      title,
      description,
      date,
      time,
      venue,
      totalSeats,
      imageUrl,
    })

    if (!parsed.success) {
      toast.error(getFirstEventValidationMessage(parsed.error))
      return
    }

    const startsAt = new Date(`${parsed.data.date}T${parsed.data.time}`).toISOString()
    const payload: EventPayload = {
      title: parsed.data.title,
      description: parsed.data.description,
      startsAt,
      venue: parsed.data.venue,
      totalSeats: Number(parsed.data.totalSeats),
      imageUrl: parsed.data.imageUrl || undefined,
    }

    setIsSubmitting(true)

    try {
      if (mode === "edit" && eventId) {
        await updateAdminEvent(eventId, payload)
        toast.success("Event updated.")
      } else {
        await createAdminEvent(payload)
        toast.success("Event created.")
      }

      router.push("/admin/events")
    } catch (error) {
      toast.error(getApiErrorMessage(error, mode === "edit" ? "Unable to update event." : "Unable to create event."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        {isLoading ? (
          <p className="py-16 text-center text-sm text-slate-500">Loading event...</p>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Event title</Label>
                <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input id="venue" value={venue} onChange={(event) => setVenue(event.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSeats">Total seats</Label>
                <Input
                  id="totalSeats"
                  type="number"
                  min={1}
                  value={totalSeats}
                  onChange={(event) => setTotalSeats(event.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="https://example.com/event.jpg"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <Link
                href="/admin/events"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                Cancel
              </Link>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 rounded-lg bg-indigo-600 px-4 text-white hover:bg-indigo-700"
              >
                <Save className="size-4" aria-hidden="true" />
                {isSubmitting ? "Saving..." : "Save event"}
              </Button>
            </div>
          </form>
        )}
      </section>

      <aside className="space-y-4">
        <Card className="overflow-hidden rounded-lg">
          <div
            className="flex aspect-[4/3] items-center justify-center bg-slate-100 bg-cover bg-center"
            style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
          >
            {imageUrl ? (
              <span className="sr-only">Event image preview</span>
            ) : (
              <ImageIcon className="size-10 text-slate-400" aria-hidden="true" />
            )}
          </div>
          <CardContent className="space-y-4 p-5">
            <div>
              <Badge className="border-indigo-200 bg-indigo-50 text-indigo-700">{capacityLabel}</Badge>
              <h2 className="mt-3 text-lg font-semibold leading-6 text-slate-950">{title || "Event preview"}</h2>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                {description || "Event details will appear here as you write."}
              </p>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <CalendarClock className="size-4 text-indigo-600" aria-hidden="true" />
                {date && time ? `${date} at ${time}` : "Choose date and time"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-rose-600" aria-hidden="true" />
                {venue || "Set the venue"}
              </p>
              <p className="flex items-center gap-2">
                <Users className="size-4 text-emerald-600" aria-hidden="true" />
                {totalSeats || "0"} seats
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg p-5">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Ticket className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-semibold text-slate-950">Capacity guard</p>
                <p className="text-sm leading-6 text-slate-600">The API protects confirmed bookings on updates.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { ArrowRight, CheckCircle2, Clock, ShieldAlert, Ticket } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { bookPublicEvent, type BookingStatus } from "@/src/lib/events-api"
import { getApiErrorMessage } from "@/src/lib/api-error"
import { getStoredToken, getStoredUser, type AuthUser } from "@/src/lib/auth-storage"
import { listMyBookings } from "@/src/lib/bookings-api"

type BookEventPanelProps = {
  eventId: string
  eventStarted: boolean
  totalSeats: number
  availableSeats: number
}

export function BookEventPanel({ eventId, eventStarted, totalSeats, availableSeats }: BookEventPanelProps) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null)
  const [seatsLeft, setSeatsLeft] = useState(availableSeats)
  const [isLoadingBooking, setIsLoadingBooking] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isAdmin = user?.role === "ADMIN"
  const availabilityPercent = totalSeats > 0 ? (seatsLeft / totalSeats) * 100 : 0

  useEffect(() => {
    const token = getStoredToken()
    const storedUser = getStoredUser()

    if (!token || !storedUser) return

    async function loadExistingBooking() {
      setIsLoadingBooking(true)

      try {
        const bookings = await listMyBookings()
        const activeBooking = bookings.find((booking) => booking.eventId === eventId && booking.status !== "CANCELLED")

        setUser(storedUser)
        setBookingStatus(activeBooking?.status ?? null)
      } catch {
        setUser(storedUser)
      } finally {
        setIsLoadingBooking(false)
      }
    }

    void loadExistingBooking()
  }, [eventId])

  async function handleBookSeat() {
    const token = getStoredToken()
    const storedUser = getStoredUser()

    if (!token || !storedUser) {
      toast.error("Log in to book this event.")
      router.push("/login")
      return
    }

    if (storedUser.role === "ADMIN") {
      toast.error("Admins cannot book seats.")
      return
    }

    setIsSubmitting(true)

    try {
      const booking = await bookPublicEvent(eventId)
      setBookingStatus(booking.status)

      if (booking.status === "WAITLISTED") {
        toast.success("You joined the waitlist.")
      } else {
        setSeatsLeft((current) => Math.max(current - 1, 0))
        toast.success("Seat booked successfully.")
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Log in to book this event.")
        router.push("/login")
        return
      }

      if (axios.isAxiosError(error) && error.response?.status === 403) {
        toast.error("You do not have access to book seats.")
        return
      }

      toast.error(getApiErrorMessage(error, "Unable to book this event."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <aside className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Booking</p>
          <p className="mt-1 text-3xl font-bold text-slate-950">Free</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          Standard access
        </span>
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-950">
            {seatsLeft} of {totalSeats} seats left
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            {seatsLeft > 0 ? "Booking open" : "Waitlist open"}
          </span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${availabilityPercent}%` }} />
        </div>
      </div>

      {bookingStatus ? (
        <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="size-5" aria-hidden="true" />
            {bookingStatus === "WAITLISTED" ? "You're waitlisted" : "You're booked"}
          </div>
          <p className="mt-2 text-sm leading-6">
            {bookingStatus === "WAITLISTED"
              ? "We will promote you automatically if seats open."
              : "Your seat is confirmed. You can manage it from My Bookings."}
          </p>
          <Link href="/bookings" className="mt-3 inline-flex text-sm font-semibold text-emerald-800 hover:underline">
            View my bookings
          </Link>
        </div>
      ) : null}

      {isAdmin ? (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <div className="flex items-center gap-2 font-semibold">
            <ShieldAlert className="size-5" aria-hidden="true" />
            Admin accounts cannot book seats
          </div>
          <p className="mt-2 text-sm leading-6">Use a normal user account to test the booking flow.</p>
        </div>
      ) : null}

      {eventStarted ? (
        <Button
          type="button"
          disabled
          className="mt-5 h-12 w-full rounded-lg bg-slate-200 text-slate-500"
        >
          <Clock className="size-4" aria-hidden="true" />
          Event has started
        </Button>
      ) : (
        <Button
          type="button"
          disabled={isAdmin || isLoadingBooking || isSubmitting || bookingStatus !== null}
          className="mt-5 h-12 w-full rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={() => void handleBookSeat()}
        >
          <Ticket className="size-4" aria-hidden="true" />
          {isAdmin
            ? "Admin cannot book"
            : isLoadingBooking
              ? "Checking booking..."
              : isSubmitting
                ? "Booking..."
                : bookingStatus
                  ? "Booking saved"
                  : "Book a seat"}
          {!isAdmin && !isLoadingBooking && !isSubmitting && !bookingStatus ? <ArrowRight className="size-4" aria-hidden="true" /> : null}
        </Button>
      )}

    </aside>
  )
}

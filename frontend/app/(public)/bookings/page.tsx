import { AuthGate } from "@/components/auth/auth-gate"
import { MyBookingsClient } from "@/components/public/my-bookings-client"
import { CalendarCheck, Ticket, Undo2 } from "lucide-react"

export default function MyBookingsPage() {
  return (
    <AuthGate>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                <Ticket className="size-4" aria-hidden="true" />
                Ticket vault
              </div>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-slate-950">My Bookings</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Manage upcoming passes, review waitlist spots, and cancel eligible bookings.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <CalendarCheck className="size-5 text-emerald-600" aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold text-slate-950">Instant status</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Confirmed and waitlisted passes sync from the API.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Undo2 className="size-5 text-rose-600" aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold text-slate-950">Easy cancellation</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Cancel active bookings before an event starts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <MyBookingsClient />
      </section>
    </AuthGate>
  )
}

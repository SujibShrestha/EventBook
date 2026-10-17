import { AdminShell } from "@/components/admin/admin-shell"
import { AttendeesClient } from "@/components/admin/attendees-client"
import { Card, CardContent } from "@/components/ui/card"
import { Search, TicketCheck, UserRound, Users, UserX } from "lucide-react"

export default function AdminAttendeesPage() {
  return (
    <AdminShell activeHref="/admin/attendees" title="Attendees" subtitle="Review users and booking counts across all events.">
      <section className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Users</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950" id="attendees-users-count" />
            </div>
            <Users className="size-8 text-indigo-600" aria-hidden="true" />
          </CardContent>
        </Card>
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Confirmed</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950" id="attendees-confirmed-count" />
            </div>
            <TicketCheck className="size-8 text-emerald-600" aria-hidden="true" />
          </CardContent>
        </Card>
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Waitlisted</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950" id="attendees-waitlisted-count" />
            </div>
            <UserRound className="size-8 text-amber-600" aria-hidden="true" />
          </CardContent>
        </Card>
        <Card className="rounded-lg p-5">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Cancelled</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950" id="attendees-cancelled-count" />
            </div>
            <UserX className="size-8 text-rose-600" aria-hidden="true" />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <div id="attendees-search-control" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Confirmed</th>
                <th className="px-4 py-3">Waitlisted</th>
                <th className="px-4 py-3">Cancelled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200" id="attendees-table-body" />
          </table>
        </div>
      </section>

      <AttendeesClient />
    </AdminShell>
  )
}

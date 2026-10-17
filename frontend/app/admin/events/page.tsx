import { AdminShell } from "@/components/admin/admin-shell"
import { EventsDashboardClient } from "@/components/admin/events-dashboard-client"

export default function AdminEventsPage() {
  return (
    <AdminShell activeHref="/admin/events" title="Events" subtitle="Create, update, and retire event listings.">
      <EventsDashboardClient />
    </AdminShell>
  )
}

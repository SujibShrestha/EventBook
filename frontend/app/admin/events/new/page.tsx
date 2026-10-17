import { AdminShell } from "@/components/admin/admin-shell"
import { EventFormClient } from "@/components/admin/event-form-client"

export default function NewAdminEventPage() {
  return (
    <AdminShell activeHref="/admin/events/new" title="Create event" subtitle="Publish a new event for visitors to book.">
      <EventFormClient mode="create" />
    </AdminShell>
  )
}

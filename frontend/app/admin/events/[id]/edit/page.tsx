import { AdminShell } from "@/components/admin/admin-shell"
import { EventFormClient } from "@/components/admin/event-form-client"

export const instant = false

type EditAdminEventPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditAdminEventPage({ params }: EditAdminEventPageProps) {
  const { id } = await params

  return (
    <AdminShell activeHref="/admin/events" title="Edit event" subtitle="Adjust event details and capacity.">
      <EventFormClient mode="edit" eventId={id} />
    </AdminShell>
  )
}

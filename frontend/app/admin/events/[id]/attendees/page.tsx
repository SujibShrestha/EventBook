import { AdminShell } from "@/components/admin/admin-shell"
import { EventAttendeesClient } from "@/components/admin/event-attendees-client"

export const instant = false

type EventAttendeesPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EventAttendeesPage({ params }: EventAttendeesPageProps) {
  const { id } = await params

  return (
    <AdminShell activeHref="/admin/events" title="Event attendees" subtitle="View users who booked or joined the waitlist.">
      <EventAttendeesClient eventId={id} />
    </AdminShell>
  )
}

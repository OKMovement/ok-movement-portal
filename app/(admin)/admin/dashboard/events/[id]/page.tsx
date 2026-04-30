import EventRegistrationsPanel from "@/components/admin/event-registrations-panel";

export default async function AdminEventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EventRegistrationsPanel eventId={id} />;
}

import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getAdminEventDetail } from "@/lib/dal/admin-events";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/admin/EmptyState";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EventForm } from "@/components/admin/events/EventForm";
import { EventStatusActions } from "@/components/admin/events/EventStatusActions";
import { buttonVariants } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.EVENTS_MANAGE)) redirect("/admin");
  const { id } = await params;
  const detail = await getAdminEventDetail(id);
  if (!detail) notFound();

  const { event, registrations } = detail;

  return (
    <div>
      <PageHeader title={event.title} description={event.summary} action={<StatusBadge status={event.status} />} />

      <div className="mb-6"><EventStatusActions eventId={id} status={event.status} /></div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Edit Details</TabsTrigger>
          <TabsTrigger value="registrations">Registrations ({registrations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <EventForm eventId={id} defaultValues={{ ...event, capacity: event.capacity ? String(event.capacity) : "", price: String(event.price) }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Attendees</CardTitle>
              {registrations.length > 0 && (
                <a href={`/api/admin/events/${id}/export`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  <Download className="size-4" /> Export CSV
                </a>
              )}
            </CardHeader>
            <CardContent>
              {registrations.length === 0 ? (
                <EmptyState title="No registrations yet" />
              ) : (
                <AdminTable>
                  <AdminTableHead>
                    <th>Attendee</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Code</th>
                  </AdminTableHead>
                  <tbody>
                    {registrations.map((r) => (
                      <AdminTableRow key={r.id}>
                        <td>
                          <p className="text-oroko-black">{r.attendeeName}</p>
                          <p className="text-xs text-muted-foreground">{r.attendeeEmail}</p>
                        </td>
                        <td>{r.quantity}</td>
                        <td><StatusBadge status={r.status} /></td>
                        <td className="font-mono text-xs">{r.registrationCode}</td>
                      </AdminTableRow>
                    ))}
                  </tbody>
                </AdminTable>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

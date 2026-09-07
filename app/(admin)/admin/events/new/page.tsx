import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { EventForm } from "@/components/admin/events/EventForm";

export default async function NewEventPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.EVENTS_MANAGE)) redirect("/admin");
  return (
    <div>
      <PageHeader title="Create Event" description="New events start as a draft until published." />
      <Card><CardContent className="pt-4"><EventForm /></CardContent></Card>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Plus } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getAdminEvents } from "@/lib/dal/admin-events";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/admin/Pagination";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buttonVariants } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.EVENTS_MANAGE)) redirect("/admin");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { events, total, pages } = await getAdminEvents({ status: params.status, page });

  return (
    <div>
      <PageHeader
        title="Events"
        description={`${total} event${total === 1 ? "" : "s"}`}
        action={<Link href="/admin/events/new" className={buttonVariants({ size: "sm" })}><Plus className="size-4" /> Create Event</Link>}
      />

      {events.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No events yet" description="Create the first OROKO event." />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <th>Event</th>
              <th>Date</th>
              <th>Status</th>
              <th>Attendees</th>
              <th />
            </AdminTableHead>
            <tbody>
              {events.map((e) => (
                <AdminTableRow key={e.id}>
                  <td className="font-medium text-oroko-black">
                    <Link href={`/admin/events/${e.id}`} className="hover:underline">{e.title}{e.isFeatured && " ★"}</Link>
                  </td>
                  <td>{new Date(e.startDate).toLocaleDateString()}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td>{e.attendeeCount}{e.capacity ? ` / ${e.capacity}` : ""}</td>
                  <td className="text-right">
                    <Link href={`/admin/events/${e.id}`} className="text-oroko-green hover:underline text-xs font-medium">Manage</Link>
                  </td>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
          <Pagination page={page} totalPages={pages} buildHref={(p) => `/admin/events?${params.status ? `status=${params.status}&` : ""}page=${p}`} />
        </>
      )}
    </div>
  );
}

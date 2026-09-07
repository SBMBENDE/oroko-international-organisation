import { redirect } from "next/navigation";
import { Megaphone } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { connectDB } from "@/lib/db";
import Announcement from "@/models/Announcement";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AnnouncementFormDialog } from "@/components/admin/announcements/AnnouncementFormDialog";
import { AnnouncementRowActions } from "@/components/admin/announcements/AnnouncementRowActions";

export default async function AnnouncementsPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.ANNOUNCEMENTS_MANAGE)) redirect("/admin");
  await connectDB();
  const items = await Announcement.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PageHeader title="Announcements" description="Content management for organization-wide announcements." action={<AnnouncementFormDialog />} />

      {items.length === 0 ? (
        <EmptyState icon={Megaphone} title="No announcements yet" />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Title</th>
            <th>Category</th>
            <th>Author</th>
            <th>Status</th>
            <th>Date</th>
            <th />
          </AdminTableHead>
          <tbody>
            {items.map((a) => (
              <AdminTableRow key={a._id.toString()}>
                <td className="font-medium text-oroko-black max-w-xs truncate">{a.title}</td>
                <td className="capitalize">{a.category}</td>
                <td>{a.authorName}</td>
                <td><StatusBadge status={a.status} /></td>
                <td className="text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td><AnnouncementRowActions id={a._id.toString()} status={a.status} /></td>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}

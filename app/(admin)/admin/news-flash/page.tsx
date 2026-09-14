import { redirect } from "next/navigation";
import { Zap } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { connectDB } from "@/lib/db";
import NewsFlash from "@/models/NewsFlash";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { NewsFlashFormDialog } from "@/components/admin/newsflash/NewsFlashFormDialog";
import { NewsFlashRowActions } from "@/components/admin/newsflash/NewsFlashRowActions";

export default async function NewsFlashPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.NEWSFLASH_MANAGE)) redirect("/admin");
  await connectDB();
  const items = await NewsFlash.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PageHeader title="News Flash" description="Short, important organizational updates." action={<NewsFlashFormDialog />} />

      {items.length === 0 ? (
        <EmptyState icon={Zap} title="No news flashes yet" />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Title</th>
            <th>Message</th>
            <th>Author</th>
            <th>Status</th>
            <th>Expires</th>
            <th>Date</th>
            <th />
          </AdminTableHead>
          <tbody>
            {items.map((n) => (
              <AdminTableRow key={n._id.toString()}>
                <td className="font-medium text-oroko-black">{n.title}</td>
                <td className="text-muted-foreground max-w-xs truncate">{n.message}</td>
                <td>{n.authorName}</td>
                <td><StatusBadge status={n.status} /></td>
                <td className="text-muted-foreground">
                  {n.expiresAt
                    ? new Date(n.expiresAt) < new Date()
                      ? "Expired"
                      : new Date(n.expiresAt).toLocaleDateString()
                    : "No expiry"}
                </td>
                <td className="text-muted-foreground">{new Date(n.createdAt).toLocaleDateString()}</td>
                <td>
                  <NewsFlashRowActions
                    flash={{
                      id: n._id.toString(),
                      title: n.title,
                      message: n.message,
                      image: n.image,
                      expiresAt: n.expiresAt?.toISOString(),
                      status: n.status,
                    }}
                  />
                </td>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}

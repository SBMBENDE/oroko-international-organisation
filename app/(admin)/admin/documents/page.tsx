import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { connectDB } from "@/lib/db";
import GovernanceDocument from "@/models/GovernanceDocument";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/badge";
import { DocumentFormDialog } from "@/components/admin/documents/DocumentFormDialog";
import { DocumentRowActions } from "@/components/admin/documents/DocumentRowActions";

export default async function DocumentsPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.DOCUMENTS_MANAGE)) redirect("/admin");
  await connectDB();
  const documents = await GovernanceDocument.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <PageHeader title="Documents" description="Constitution, bylaws, policies, reports, minutes, and more." action={<DocumentFormDialog />} />

      {documents.length === 0 ? (
        <EmptyState icon={FileText} title="No documents uploaded yet" />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Title</th>
            <th>Category</th>
            <th>Version</th>
            <th>Visibility</th>
            <th>Date</th>
            <th />
          </AdminTableHead>
          <tbody>
            {documents.map((d) => (
              <AdminTableRow key={d._id.toString()}>
                <td className="font-medium text-oroko-black max-w-xs truncate">{d.title}</td>
                <td className="capitalize">{d.type.replace(/_/g, " ")}</td>
                <td>v{d.version}</td>
                <td>
                  <Badge variant="outline" className={d.isPublic ? "border-transparent bg-oroko-green/10 text-oroko-green" : "text-muted-foreground"}>
                    {d.isPublic ? "Published" : "Internal"}
                  </Badge>
                </td>
                <td className="text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                <td><DocumentRowActions id={d._id.toString()} isPublic={d.isPublic} /></td>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}

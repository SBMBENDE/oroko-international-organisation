import { redirect } from "next/navigation";
import { FileText } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { connectDB } from "@/lib/db";
import GovernanceDocument from "@/models/GovernanceDocument";
import { getCommittees } from "@/lib/dal/admin-committees";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/badge";
import { DocumentFormDialog } from "@/components/admin/documents/DocumentFormDialog";
import { DocumentRowActions } from "@/components/admin/documents/DocumentRowActions";

const ORGAN_LABELS: Record<string, string> = {
  general_assembly: "General Assembly",
  executive: "Executive",
  committee: "Committee",
};

export default async function DocumentsPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.DOCUMENTS_MANAGE)) redirect("/admin");
  await connectDB();
  const [documents, committees] = await Promise.all([
    GovernanceDocument.find({}).sort({ createdAt: -1 }).populate("committee", "name").lean(),
    getCommittees(),
  ]);
  const committeeOptions = committees.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div>
      <PageHeader title="Documents" description="Constitution, bylaws, policies, reports, minutes, and more." action={<DocumentFormDialog committees={committeeOptions} />} />

      {documents.length === 0 ? (
        <EmptyState icon={FileText} title="No documents uploaded yet" />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Title</th>
            <th>Category</th>
            <th>Organ</th>
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
                <td>
                  {ORGAN_LABELS[d.organ] ?? d.organ}
                  {d.organ === "committee" && d.committee && "name" in d.committee ? ` · ${d.committee.name}` : ""}
                </td>
                <td>v{d.version}</td>
                <td>
                  <Badge variant="outline" className={d.isPublic ? "border-transparent bg-oroko-green/10 text-oroko-green" : "text-muted-foreground"}>
                    {d.isPublic ? "Published" : "Internal"}
                  </Badge>
                </td>
                <td className="text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                <td>
                  <DocumentRowActions
                    id={d._id.toString()}
                    isPublic={d.isPublic}
                    organ={d.organ}
                    committeeId={d.committee && "_id" in d.committee ? d.committee._id.toString() : undefined}
                    committees={committeeOptions}
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


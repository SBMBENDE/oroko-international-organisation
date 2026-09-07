import Link from "next/link";
import { redirect } from "next/navigation";
import { UsersRound } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getCommittees } from "@/lib/dal/admin-committees";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { Badge } from "@/components/ui/badge";
import { CommitteeFormDialog } from "@/components/admin/committees/CommitteeFormDialog";
import { ToggleCommitteeButton } from "@/components/admin/committees/ToggleCommitteeButton";

export default async function CommitteesPage() {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.COMMITTEE_MANAGE)) redirect("/admin");
  const committees = await getCommittees();

  return (
    <div>
      <PageHeader title="Committees" description="Organizational groups that individual members can belong to." action={<CommitteeFormDialog mode="create" />} />

      {committees.length === 0 ? (
        <EmptyState icon={UsersRound} title="No committees yet" description="Create the first committee to get started." />
      ) : (
        <AdminTable>
          <AdminTableHead>
            <th>Committee</th>
            <th>Mandate</th>
            <th>Members</th>
            <th>Status</th>
            <th />
          </AdminTableHead>
          <tbody>
            {committees.map((c) => (
              <AdminTableRow key={c.id}>
                <td className="font-medium text-oroko-black">
                  <Link href={`/admin/committees/${c.id}`} className="hover:underline">{c.name}</Link>
                </td>
                <td className="text-muted-foreground max-w-xs truncate">{c.mandate}</td>
                <td>{c.memberCount}</td>
                <td>
                  <Badge variant="outline" className={c.isActive ? "border-transparent bg-oroko-green/10 text-oroko-green" : "text-muted-foreground"}>
                    {c.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="text-right"><ToggleCommitteeButton id={c.id} isActive={c.isActive} /></td>
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getAuditLogs } from "@/lib/dal/admin-audit-logs";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/admin/Pagination";
import { EmptyState } from "@/components/admin/EmptyState";
import { ScrollText } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ entityType?: string; page?: string }>;
}

export default async function AuditLogsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.AUDIT_LOGS_VIEW)) {
    redirect("/admin");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { logs, total, pages, entityTypes } = await getAuditLogs({ entityType: params.entityType, page });

  return (
    <div>
      <PageHeader title="Audit Logs" description={`${total} recorded administrative action${total === 1 ? "" : "s"} — immutable record.`} />

      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href="/admin/audit-logs"
          className={`rounded-full px-3 py-1.5 text-xs font-medium border ${!params.entityType ? "bg-oroko-black text-white border-oroko-black" : "border-border text-muted-foreground hover:bg-muted"}`}
        >
          All
        </Link>
        {entityTypes.map((t) => (
          <Link
            key={t}
            href={`/admin/audit-logs?entityType=${t}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium border ${params.entityType === t ? "bg-oroko-black text-white border-oroko-black" : "border-border text-muted-foreground hover:bg-muted"}`}
          >
            {t}
          </Link>
        ))}
      </div>

      {logs.length === 0 ? (
        <EmptyState icon={ScrollText} title="No audit activity yet" description="Administrative actions across the dashboard will be recorded here." />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <th>Description</th>
              <th>Entity</th>
              <th>Administrator</th>
              <th>Date</th>
            </AdminTableHead>
            <tbody>
              {logs.map((l) => (
                <AdminTableRow key={l.id}>
                  <td>{l.description}</td>
                  <td className="text-muted-foreground">{l.entityType}</td>
                  <td>{l.actorName}</td>
                  <td className="text-muted-foreground">{new Date(l.createdAt).toLocaleString()}</td>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
          <Pagination page={page} totalPages={pages} buildHref={(p) => `/admin/audit-logs?${params.entityType ? `entityType=${params.entityType}&` : ""}page=${p}`} />
        </>
      )}
    </div>
  );
}

import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { EmptyState } from "@/components/admin/EmptyState";

interface ReportTableProps {
  title: string;
  exportType: string;
  from?: string;
  to?: string;
  columns: string[];
  rows: (string | number)[][];
}

export function ReportTable({ title, exportType, from, to, columns, rows }: ReportTableProps) {
  const qs = new URLSearchParams({ type: exportType, ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-medium text-oroko-black">{title}</h3>
        <a href={`/api/admin/reports/export?${qs}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
          <Download className="size-4" /> Export CSV
        </a>
      </div>
      {rows.length === 0 ? (
        <EmptyState title="No data for this period" />
      ) : (
        <AdminTable>
          <AdminTableHead>
            {columns.map((c) => <th key={c}>{c}</th>)}
          </AdminTableHead>
          <tbody>
            {rows.map((row, i) => (
              <AdminTableRow key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </AdminTableRow>
            ))}
          </tbody>
        </AdminTable>
      )}
    </div>
  );
}

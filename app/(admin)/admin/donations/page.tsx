import { redirect } from "next/navigation";
import { HandCoins } from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getAdminDonations } from "@/lib/dal/admin-donations";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { AdminTable, AdminTableHead, AdminTableRow } from "@/components/admin/AdminTable";
import { Pagination } from "@/components/admin/Pagination";
import { EmptyState } from "@/components/admin/EmptyState";
import { StatusBadge } from "@/components/admin/StatusBadge";

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function DonationsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.DONATIONS_VIEW)) redirect("/admin");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { donations, total, pages, totalAmount, monthAmount, yearAmount, donorCount } = await getAdminDonations({ status: params.status, page });

  const currency = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      <PageHeader title="Donations" description="Financial contributions to OROKO International." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Donations" value={currency(totalAmount)} icon={HandCoins} />
        <StatCard label="This Month" value={currency(monthAmount)} />
        <StatCard label="This Year" value={currency(yearAmount)} />
        <StatCard label="Number of Donors" value={donorCount} />
      </div>

      {donations.length === 0 ? (
        <EmptyState icon={HandCoins} title="No donations recorded yet" />
      ) : (
        <>
          <AdminTable>
            <AdminTableHead>
              <th>Donor</th>
              <th>Amount</th>
              <th>Campaign</th>
              <th>Status</th>
              <th>Reference</th>
              <th>Date</th>
            </AdminTableHead>
            <tbody>
              {donations.map((d) => (
                <AdminTableRow key={d.id}>
                  <td className="font-medium text-oroko-black">{d.donorName}</td>
                  <td>{new Intl.NumberFormat("en-US", { style: "currency", currency: d.currency }).format(d.amount)}</td>
                  <td className="text-muted-foreground">{d.projectTitle ?? "General Fund"}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td className="font-mono text-xs">{d.receiptNumber ?? "—"}</td>
                  <td className="text-muted-foreground">{new Date(d.createdAt).toLocaleDateString()}</td>
                </AdminTableRow>
              ))}
            </tbody>
          </AdminTable>
          <Pagination page={page} totalPages={pages} buildHref={(p) => `/admin/donations?${params.status ? `status=${params.status}&` : ""}page=${p}`} />
        </>
      )}
    </div>
  );
}

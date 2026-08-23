import type { Metadata } from "next";
import Link from "next/link";
import { getCommittees } from "@/lib/dal/governance";
import { CommitteeCard } from "@/components/governance/CommitteeCard";
import { Users, ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Committees · Governance" };

export default async function PortalCommitteesPage() {
  const committees = await getCommittees();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/portal/governance"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-8"
      >
        <ArrowLeft className="size-3.5" /> Governance
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-sm bg-blue-100 border border-blue-200">
          <Users className="size-5 text-blue-600" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-oroko-black">Committees</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            All working groups and their mandates
          </p>
        </div>
      </div>

      {committees.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-sm">
          <Users className="size-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No committees established yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {committees.map((c) => (
            <CommitteeCard key={c.id} committee={c} />
          ))}
        </div>
      )}
    </div>
  );
}

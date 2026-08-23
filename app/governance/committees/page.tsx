import type { Metadata } from "next";
import Link from "next/link";
import { getCommittees } from "@/lib/dal/governance";
import { CommitteeCard } from "@/components/governance/CommitteeCard";
import { Users, ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Committees" };

export default async function CommitteesPage() {
  const committees = await getCommittees();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/governance"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-10"
      >
        <ArrowLeft className="size-3.5" /> Governance
      </Link>

      <div className="flex items-start gap-5 mb-12">
        <div className="p-4 rounded-sm bg-blue-100 border border-blue-200 shrink-0">
          <Users className="size-6 text-blue-600" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-oroko-black mb-3">
            Committees
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            OROKO International&apos;s committees are specialized working groups mandated
            by the General Assembly to advance specific areas of the organization&apos;s work.
          </p>
        </div>
      </div>

      {committees.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-sm">
          <Users className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-heading text-xl text-oroko-black">No committees yet</p>
          <p className="text-muted-foreground text-sm mt-1">
            Committee structures will be published after the founding assembly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {committees.map((c) => (
            <CommitteeCard key={c.id} committee={c} />
          ))}
        </div>
      )}
    </div>
  );
}

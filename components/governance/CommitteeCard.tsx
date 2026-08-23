import Link from "next/link";
import { Users, ArrowUpRight } from "lucide-react";
import type { CommitteeSummary } from "@/lib/dal/governance";

export function CommitteeCard({ committee }: { committee: CommitteeSummary }) {
  return (
    <Link
      href={`/governance/committees/${committee.slug}`}
      className="group block bg-white border border-border rounded-sm p-6 hover:border-oroko-gold/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-heading text-xl font-semibold text-oroko-black group-hover:text-oroko-green transition-colors">
          {committee.name}
        </h3>
        <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-oroko-gold transition-colors shrink-0 mt-1" />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
        {committee.mandate}
      </p>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Users className="size-3.5" />
        {committee.memberCount} {committee.memberCount === 1 ? "member" : "members"}
      </div>
    </Link>
  );
}

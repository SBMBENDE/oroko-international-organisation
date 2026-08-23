import type { Metadata } from "next";
import Link from "next/link";
import { OfficerCard } from "@/components/governance/OfficerCard";
import { getExecutiveOfficers } from "@/lib/dal/governance";
import { Building2, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Executive Council" };

export default async function ExecutivePage() {
  const officers = await getExecutiveOfficers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/governance"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-10"
      >
        <ArrowLeft className="size-3.5" /> Governance
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5 mb-12">
        <div className="p-4 rounded-sm bg-oroko-gold/10 border border-oroko-gold/20 shrink-0">
          <Building2 className="size-6 text-oroko-gold" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-oroko-black mb-3">
            Executive Council
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            The Executive Council is responsible for implementing the resolutions of
            the General Assembly and managing the organization&apos;s activities. Officers
            are elected by the General Assembly for fixed terms.
          </p>
        </div>
      </div>

      {/* Officers grid */}
      {officers.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-sm">
          <Building2 className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-heading text-xl text-oroko-black">
            Executive roster coming soon
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            Officer profiles will be published after the next election.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {officers.map((officer) => (
            <OfficerCard key={officer.id} officer={officer} />
          ))}
        </div>
      )}
    </div>
  );
}

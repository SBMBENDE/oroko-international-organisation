import type { Metadata } from "next";
import Link from "next/link";
import { getMeetings, getDocuments } from "@/lib/dal/governance";
import { MeetingCard } from "@/components/governance/MeetingCard";
import { DocumentCard } from "@/components/governance/DocumentCard";
import { Scale, ArrowLeft, Users, FileText } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "General Assembly" };

export default async function AssemblyPage() {
  const [meetings, documents] = await Promise.all([
    getMeetings({ organ: "general_assembly", publicOnly: true, limit: 6 }),
    getDocuments({ organ: "general_assembly", publicOnly: true, limit: 6 }),
  ]);

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
        <div className="p-4 rounded-sm bg-oroko-green/10 border border-oroko-green/20 shrink-0">
          <Scale className="size-6 text-oroko-green" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-oroko-black mb-3">
            General Assembly
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            The supreme deliberative body of OROKO International, comprising all
            individual members in good standing. The General Assembly meets to
            review the organization&apos;s work, adopt resolutions, and elect leadership.
          </p>
        </div>
      </div>

      {/* About the GA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        {[
          { icon: Users, title: "Composition", text: "All active individual members of OROKO International are members of the General Assembly." },
          { icon: Scale, title: "Authority", text: "The GA is the highest decision-making organ. Its resolutions are binding on all other organs." },
          { icon: FileText, title: "Frequency", text: "The Ordinary General Assembly convenes at least once per year. Extraordinary sessions may be called as needed." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-white border border-border rounded-sm p-5">
            <Icon className="size-5 text-oroko-green mb-3" strokeWidth={1.5} />
            <h3 className="font-heading text-base font-semibold text-oroko-black mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Meetings */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold text-oroko-black">Sessions</h2>
          <Link
            href="/auth/login"
            className="text-xs text-oroko-green hover:text-oroko-gold transition-colors"
          >
            Sign in for full access →
          </Link>
        </div>
        {meetings.length === 0 ? (
          <EmptyState icon={Scale} label="No sessions published yet" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((m) => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        )}
      </section>

      {/* Documents */}
      <section>
        <h2 className="font-heading text-2xl font-bold text-oroko-black mb-6">
          Public Documents
        </h2>
        {documents.length === 0 ? (
          <EmptyState icon={FileText} label="No public documents yet" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((d) => <DocumentCard key={d.id} doc={d} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ icon: Icon, label }: { icon: typeof Scale; label: string }) {
  return (
    <div className="text-center py-12 border border-dashed border-border rounded-sm">
      <Icon className="size-8 text-muted-foreground/40 mx-auto mb-2" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

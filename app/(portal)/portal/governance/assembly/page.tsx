import type { Metadata } from "next";
import Link from "next/link";
import { getMeetings, getDocuments } from "@/lib/dal/governance";
import { MeetingCard } from "@/components/governance/MeetingCard";
import { DocumentCard } from "@/components/governance/DocumentCard";
import { Scale, ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "General Assembly · Governance" };

export default async function PortalAssemblyPage() {
  const [meetings, documents] = await Promise.all([
    getMeetings({ organ: "general_assembly", limit: 10 }),
    getDocuments({ organ: "general_assembly", limit: 10 }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/portal/governance"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-8"
      >
        <ArrowLeft className="size-3.5" /> Governance
      </Link>

      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-sm bg-oroko-green/10 border border-oroko-green/20">
          <Scale className="size-5 text-oroko-green" />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-oroko-black">
            General Assembly
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            All sessions and documents — including member-only content
          </p>
        </div>
      </div>

      {/* Meetings */}
      <section className="mb-12">
        <h2 className="font-heading text-xl font-bold text-oroko-black mb-5">Sessions</h2>
        {meetings.length === 0 ? (
          <Empty label="No sessions recorded yet" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((m) => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        )}
      </section>

      {/* Documents */}
      <section>
        <h2 className="font-heading text-xl font-bold text-oroko-black mb-5">Documents</h2>
        {documents.length === 0 ? (
          <Empty label="No documents yet" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((d) => <DocumentCard key={d.id} doc={d} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="text-center py-10 border border-dashed border-border rounded-sm">
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

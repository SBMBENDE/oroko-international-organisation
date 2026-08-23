import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommitteeBySlug, getMeetings, getDocuments } from "@/lib/dal/governance";
import { MeetingCard } from "@/components/governance/MeetingCard";
import { DocumentCard } from "@/components/governance/DocumentCard";
import { Users, ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const committee = await getCommitteeBySlug(slug);
  if (!committee) return { title: "Committee Not Found" };
  return { title: committee.name };
}

const roleBadge: Record<string, string> = {
  chair: "bg-oroko-gold/10 text-oroko-gold border-oroko-gold/20",
  vice_chair: "bg-oroko-green/10 text-oroko-green border-oroko-green/20",
  secretary: "bg-blue-50 text-blue-600 border-blue-200",
  member: "bg-muted text-muted-foreground border-border",
};

const roleLabel: Record<string, string> = {
  chair: "Chair",
  vice_chair: "Vice Chair",
  secretary: "Secretary",
  member: "Member",
};

export default async function CommitteeDetailPage({ params }: Props) {
  const { slug } = await params;
  const [committee, meetings, documents] = await Promise.all([
    getCommitteeBySlug(slug),
    getMeetings({ organ: "committee", publicOnly: true, limit: 5 }),
    getDocuments({ organ: "committee", publicOnly: true, limit: 5 }),
  ]);

  if (!committee) notFound();

  const filteredMeetings = meetings;
  const filteredDocs = documents;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/governance/committees"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-10"
      >
        <ArrowLeft className="size-3.5" /> Committees
      </Link>

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-bold text-oroko-black mb-3">
          {committee.name}
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">{committee.mandate}</p>
        {committee.description && (
          <p className="text-muted-foreground leading-relaxed max-w-2xl mt-2">
            {committee.description}
          </p>
        )}
      </div>

      {/* Members */}
      <section className="mb-12">
        <h2 className="font-heading text-2xl font-bold text-oroko-black mb-6 flex items-center gap-2">
          <Users className="size-5 text-oroko-green" />
          Members ({committee.memberCount})
        </h2>
        {committee.members.length === 0 ? (
          <p className="text-muted-foreground text-sm">No members assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {committee.members.map((m) => {
              const initials = m.userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              return (
                <div
                  key={m.userId}
                  className="bg-white border border-border rounded-sm p-4 flex items-center gap-3"
                >
                  <div className="size-10 rounded-full overflow-hidden bg-oroko-green shrink-0 flex items-center justify-center">
                    {m.userPhoto ? (
                      <Image
                        src={m.userPhoto}
                        alt={m.userName}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="font-heading text-sm font-bold text-white">{initials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-oroko-black truncate">{m.userName}</p>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-sm border ${roleBadge[m.role] ?? roleBadge.member}`}>
                      {roleLabel[m.role] ?? m.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Meetings */}
      {filteredMeetings.length > 0 && (
        <section className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-oroko-black mb-6">Meetings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMeetings.map((m) => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        </section>
      )}

      {/* Documents */}
      {filteredDocs.length > 0 && (
        <section>
          <h2 className="font-heading text-2xl font-bold text-oroko-black mb-6">Reports & Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((d) => <DocumentCard key={d.id} doc={d} />)}
          </div>
        </section>
      )}
    </div>
  );
}

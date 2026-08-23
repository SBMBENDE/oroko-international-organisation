import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getMemberDirectory } from "@/lib/dal/profile";
import { MemberCard } from "@/components/members/MemberCard";
import { DirectorySearch } from "@/components/members/DirectorySearch";
import { Users, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Member Directory" };

type SearchParams = Promise<{ q?: string; country?: string; page?: string }>;

export default async function MembersPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/members");

  const { q, country, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const { members, total, pages } = await getMemberDirectory({
    q,
    country,
    page: currentPage,
    limit: 24,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-8"
      >
        <ArrowLeft className="size-3.5" /> Back to portal
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-px w-6 bg-oroko-gold" />
            <span className="text-oroko-gold text-xs tracking-[0.3em] uppercase font-medium">
              Community
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-oroko-black">Member Directory</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {total} {total === 1 ? "member" : "members"} in the OROKO community
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Users className="size-4" />
          {total} total
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <Suspense>
          <DirectorySearch />
        </Suspense>
      </div>

      {/* Grid */}
      {members.length === 0 ? (
        <div className="text-center py-20">
          <Users className="size-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="font-heading text-xl text-oroko-black">No members found</p>
          <p className="text-muted-foreground text-sm mt-1">
            {q || country ? "Try adjusting your search or filters." : "The directory is empty."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((member) => (
            <MemberCard key={member._id} member={member} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (country) params.set("country", country);
            if (p > 1) params.set("page", String(p));

            return (
              <a
                key={p}
                href={`/members?${params.toString()}`}
                className={`size-8 flex items-center justify-center text-xs rounded-sm border transition-colors ${
                  p === currentPage
                    ? "bg-oroko-gold text-oroko-black border-oroko-gold font-bold"
                    : "border-border text-muted-foreground hover:border-oroko-gold/40 hover:text-oroko-black"
                }`}
              >
                {p}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

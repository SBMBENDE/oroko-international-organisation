import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getMemberDetail } from "@/lib/dal/admin-members";
import { getMembershipTypes } from "@/lib/dal/membership-types";
import { connectDB } from "@/lib/db";
import EventRegistration from "@/models/EventRegistration";
import CommitteeMember from "@/models/CommitteeMember";
import Donation from "@/models/Donation";
import WelfareRequest from "@/models/WelfareRequest";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MemberActionsPanel } from "@/components/admin/members/MemberActionsPanel";
import { MemberNotesSection } from "@/components/admin/members/MemberNotesSection";
import { MemberEditForm } from "@/components/admin/members/MemberEditForm";
import { CalendarDays, HandCoins, HeartHandshake, UsersRound, FileText } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberProfilePage({ params }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.MEMBERS_MANAGE)) redirect("/admin");
  const { id } = await params;
  const detail = await getMemberDetail(id);
  if (!detail) notFound();

  const { user, membership } = detail;
  await connectDB();
  const [eventRegistrations, committeeMemberships, donations, welfareRequests, membershipTypes] = await Promise.all([
    EventRegistration.find({ user: id }).populate("event", "title startDate").sort({ createdAt: -1 }).lean(),
    CommitteeMember.find({ user: id, isActive: true }).populate("committee", "name").lean(),
    Donation.find({ userId: id }).sort({ createdAt: -1 }).limit(20).lean(),
    WelfareRequest.find({ member: id }).sort({ createdAt: -1 }).lean(),
    getMembershipTypes(),
  ]);

  return (
    <div>
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        description={`${membership.orokoId} · Member since ${new Date(membership.memberSince).toLocaleDateString()}`}
        action={<StatusBadge status={membership.status} />}
      />

      <div className="mb-6">
        <MemberActionsPanel memberId={id} status={membership.status} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notes">Internal Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Email" value={user.email} />
                <Row label="Phone" value={user.phone} />
                <Row label="Country of Residence" value={membership.country} />
                <Row label="City" value={membership.city} />
                <Row label="Country of Origin" value={membership.countryOfOrigin} />
                <Row label="Profession" value={membership.profession} />
                <Row label="Organization" value={membership.organization} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Membership Information</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Row label="Member ID" value={membership.orokoId} />
                <Row label="Membership Type" value={membership.membershipType} />
                <Row label="Status" value={membership.status} />
                <Row label="Payment Status" value={membership.paymentStatus} />
                <Row label="Renewal Date" value={membership.expiresAt ? new Date(membership.expiresAt).toLocaleDateString() : undefined} />
                <Row label="Application Status" value={membership.applicationStatus.replace(/_/g, " ")} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="edit" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <MemberEditForm
                memberId={id}
                membershipTypes={membershipTypes}
                defaultValues={{
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phone: user.phone ?? "",
                  country: membership.country ?? "",
                  countryOfOrigin: membership.countryOfOrigin ?? "",
                  city: membership.city ?? "",
                  profession: membership.profession ?? "",
                  organization: membership.organization ?? "",
                  membershipType: membership.membershipType,
                  paymentStatus: membership.paymentStatus,
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-4 space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="size-4" /> Events Attended</CardTitle></CardHeader>
            <CardContent>
              {eventRegistrations.length === 0 ? (
                <EmptyState title="No event registrations" />
              ) : (
                <ul className="divide-y divide-border text-sm">
                  {eventRegistrations.map((r) => (
                    <li key={r._id.toString()} className="py-2 flex justify-between">
                      <span>{(r.event as unknown as { title?: string })?.title ?? "Untitled event"}</span>
                      <StatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><UsersRound className="size-4" /> Committees</CardTitle></CardHeader>
            <CardContent>
              {committeeMemberships.length === 0 ? (
                <EmptyState title="Not a member of any committee" />
              ) : (
                <ul className="divide-y divide-border text-sm">
                  {committeeMemberships.map((c) => (
                    <li key={c._id.toString()} className="py-2 flex justify-between">
                      <span>{(c.committee as unknown as { name?: string })?.name}</span>
                      <span className="capitalize text-muted-foreground">{c.role}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><HandCoins className="size-4" /> Donations</CardTitle></CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <EmptyState title="No donations recorded" />
              ) : (
                <ul className="divide-y divide-border text-sm">
                  {donations.map((d) => (
                    <li key={d._id.toString()} className="py-2 flex justify-between">
                      <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: d.currency }).format(d.amount)}</span>
                      <StatusBadge status={d.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><HeartHandshake className="size-4" /> Welfare Requests</CardTitle></CardHeader>
            <CardContent>
              {welfareRequests.length === 0 ? (
                <EmptyState title="No welfare requests submitted" />
              ) : (
                <ul className="divide-y divide-border text-sm">
                  {welfareRequests.map((w) => (
                    <li key={w._id.toString()} className="py-2 flex justify-between">
                      <Link href={`/admin/welfare/${w._id.toString()}`} className="hover:underline capitalize">{w.requestType.replace(/_/g, " ")}</Link>
                      <StatusBadge status={w.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="size-4" /> Documents</CardTitle></CardHeader>
            <CardContent>
              <EmptyState title="No member-specific documents" description="Organization-wide documents are managed under the Documents module." />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Membership History</CardTitle></CardHeader>
            <CardContent>
              {membership.statusHistory.length === 0 ? (
                <EmptyState title="No status changes recorded yet" />
              ) : (
                <ul className="space-y-2 text-sm">
                  {[...membership.statusHistory].reverse().map((h, i) => (
                    <li key={i} className="flex items-center justify-between border-b border-border last:border-0 pb-2">
                      <div>
                        <StatusBadge status={h.status} />
                        {h.reason && <span className="ml-2 text-muted-foreground">{h.reason}</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {h.changedByName ?? "System"} · {new Date(h.changedAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <MemberNotesSection
                memberId={id}
                notes={membership.internalNotes.map((n) => ({
                  authorName: n.authorName,
                  text: n.text,
                  createdAt: n.createdAt.toISOString(),
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-oroko-black text-right capitalize">{value || "—"}</span>
    </div>
  );
}

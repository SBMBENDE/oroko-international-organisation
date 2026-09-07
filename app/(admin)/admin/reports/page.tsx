import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/PageHeader";
import { ReportDateFilter } from "@/components/admin/reports/ReportDateFilter";
import { ReportTable } from "@/components/admin/reports/ReportTable";
import { PrintButton } from "@/components/admin/reports/PrintButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  getMembershipGrowthReport, getMembersByCountryReport, getMembersByCountryOfOriginReport,
  getMembershipTypeReport, getMembershipStatusReport, getMembershipExpirationReport,
  getEventParticipationReport, getProjectParticipationReport, getDonationsReport,
  getWelfareAssistanceReport, getMemberEngagementReport,
} from "@/lib/dal/admin-reports";

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string }>;
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!hasPermission(session?.user.role, PERMISSIONS.REPORTS_VIEW)) redirect("/admin");

  const { from, to } = await searchParams;
  const range = { from, to };

  const [
    growth, byCountry, byOrigin, byType, byStatus, expiring,
    eventParticipation, projectParticipation, donations, welfare, engagement,
  ] = await Promise.all([
    getMembershipGrowthReport(range),
    getMembersByCountryReport(range),
    getMembersByCountryOfOriginReport(range),
    getMembershipTypeReport(range),
    getMembershipStatusReport(range),
    getMembershipExpirationReport(),
    getEventParticipationReport(range),
    getProjectParticipationReport(),
    getDonationsReport(range),
    getWelfareAssistanceReport(range),
    getMemberEngagementReport(),
  ]);

  return (
    <div>
      <PageHeader title="Reports" description="Organization-wide reporting with date filtering and CSV export." action={<PrintButton />} />
      <ReportDateFilter />

      <Tabs defaultValue="membership">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="events">Events &amp; Projects</TabsTrigger>
          <TabsTrigger value="finance">Donations &amp; Welfare</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="membership" className="mt-4 space-y-8">
          <ReportTable title="Membership Growth" exportType="membership-growth" from={from} to={to} columns={["Period", "New Members"]} rows={growth.map((r) => [r.period, r.count])} />
          <ReportTable title="Members by Country of Residence" exportType="members-by-country" from={from} to={to} columns={["Country", "Members"]} rows={byCountry.map((r) => [r.country, r.count])} />
          <ReportTable title="Members by Country of Origin" exportType="members-by-origin" from={from} to={to} columns={["Country", "Members"]} rows={byOrigin.map((r) => [r.country, r.count])} />
          <ReportTable title="Membership Type" exportType="membership-type" from={from} to={to} columns={["Type", "Members"]} rows={byType.map((r) => [r.type, r.count])} />
          <ReportTable title="Membership Status" exportType="membership-status" from={from} to={to} columns={["Status", "Members"]} rows={byStatus.map((r) => [r.status, r.count])} />
          <ReportTable title="Membership Expiring in 60 Days" exportType="membership-expiration" columns={["Name", "Email", "Member ID", "Expires"]} rows={expiring.map((r) => [r.name, r.email, r.orokoId, new Date(r.expiresAt).toLocaleDateString()])} />
        </TabsContent>

        <TabsContent value="events" className="mt-4 space-y-8">
          <ReportTable title="Event Participation" exportType="event-participation" from={from} to={to} columns={["Event", "Date", "Registrations", "Attendees"]} rows={eventParticipation.map((r) => [r.event, r.date ? new Date(r.date).toLocaleDateString() : "", r.registrations, r.attendees])} />
          <ReportTable title="Project Participation" exportType="project-participation" columns={["Project", "Status", "Team Size", "Progress %"]} rows={projectParticipation.map((r) => [r.project, r.status, r.teamSize, r.progressPercent])} />
        </TabsContent>

        <TabsContent value="finance" className="mt-4 space-y-8">
          <ReportTable title="Donations Over Time" exportType="donations" from={from} to={to} columns={["Period", "Total (USD)", "Count"]} rows={donations.map((r) => [r.period, r.total.toLocaleString(), r.count])} />
          <ReportTable title="Welfare Assistance" exportType="welfare" from={from} to={to} columns={["Type", "Requests", "Total Approved (USD)"]} rows={welfare.map((r) => [r.type, r.count, r.totalApproved.toLocaleString()])} />
        </TabsContent>

        <TabsContent value="engagement" className="mt-4">
          <ReportTable title="Member Engagement (by event attendance)" exportType="engagement" columns={["Name", "Email", "Events Attended"]} rows={engagement.map((r) => [r.name, r.email, r.eventCount])} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

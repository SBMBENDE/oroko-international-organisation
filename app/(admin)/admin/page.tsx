import Link from "next/link";
import {
  Users, UserCheck, ClipboardList, UserX, ShieldAlert, UserPlus, CalendarClock,
  HandCoins, HeartHandshake, CalendarDays, FolderKanban, CheckSquare,
  Megaphone, Upload, Zap,
} from "lucide-react";
import { auth } from "@/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { getDashboardStats, getRecentActivity } from "@/lib/dal/admin-dashboard";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { EmptyState } from "@/components/admin/EmptyState";
import { BarChart } from "@/components/admin/charts/BarChart";
import { LineChart } from "@/components/admin/charts/LineChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const quickActions = [
  { label: "Add Member", href: "/admin/members/new", icon: UserPlus, permission: PERMISSIONS.MEMBERS_MANAGE },
  { label: "Review Applications", href: "/admin/applications", icon: CheckSquare, permission: PERMISSIONS.APPLICATIONS_MANAGE },
  { label: "Create Event", href: "/admin/events/new", icon: CalendarDays, permission: PERMISSIONS.EVENTS_MANAGE },
  { label: "Create Project", href: "/admin/projects/new", icon: FolderKanban, permission: PERMISSIONS.PROJECTS_MANAGE },
  { label: "Post News Flash", href: "/admin/news-flash", icon: Zap, permission: PERMISSIONS.NEWSFLASH_MANAGE },
  { label: "Create Announcement", href: "/admin/announcements", icon: Megaphone, permission: PERMISSIONS.ANNOUNCEMENTS_MANAGE },
  { label: "Upload Document", href: "/admin/documents", icon: Upload, permission: PERMISSIONS.DOCUMENTS_MANAGE },
  { label: "Create Welfare Request", href: "/admin/welfare/new", icon: HeartHandshake, permission: PERMISSIONS.WELFARE_MANAGE },
];

export default async function AdminDashboardPage() {
  const session = await auth();
  const role = session?.user.role;
  const stats = await getDashboardStats();
  const activity = hasPermission(role, PERMISSIONS.AUDIT_LOGS_VIEW) ? await getRecentActivity(8) : [];

  const currency = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of OROKO International's membership and operations." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Members" value={stats.totalMembers} icon={Users} />
        <StatCard label="Active Members" value={stats.activeMembers} icon={UserCheck} tone="success" />
        <StatCard label="Pending Applications" value={stats.pendingApplications} icon={ClipboardList} tone="warning" />
        <StatCard label="Expired Memberships" value={stats.expiredMemberships} icon={UserX} tone="danger" />
        <StatCard label="Suspended Members" value={stats.suspendedMembers} icon={ShieldAlert} tone="danger" />
        <StatCard label="New This Month" value={stats.newMembersThisMonth} icon={UserPlus} />
        <StatCard label="Expiring Soon" value={stats.expiringSoon} icon={CalendarClock} tone="warning" />
        <StatCard label="Total Donations" value={currency(stats.totalDonations)} icon={HandCoins} />
        <StatCard label="Pending Welfare Requests" value={stats.pendingWelfareRequests} icon={HeartHandshake} tone="warning" />
        <StatCard label="Upcoming Events" value={stats.upcomingEvents} icon={CalendarDays} />
        <StatCard label="Active Projects" value={stats.activeProjects} icon={FolderKanban} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader><CardTitle>Membership Growth (12 months)</CardTitle></CardHeader>
          <CardContent><LineChart data={stats.membershipGrowth} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Donations Over Time</CardTitle></CardHeader>
          <CardContent><LineChart data={stats.donationsOverTime.map((d) => ({ label: d.label, count: d.amount }))} color="var(--oroko-gold)" /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Members by Country of Residence</CardTitle></CardHeader>
          <CardContent><BarChart data={stats.membershipByCountry} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Members by Membership Type</CardTitle></CardHeader>
          <CardContent><BarChart data={stats.membershipByType} color="var(--oroko-green)" /></CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Members by Membership Status</CardTitle></CardHeader>
          <CardContent><BarChart data={stats.membershipByStatus} color="var(--oroko-green-light)" /></CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <EmptyState title="No activity yet" description="Administrative actions will appear here as they happen." />
            ) : (
              <ul className="space-y-3">
                {activity.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3 text-sm border-b border-border last:border-0 pb-3 last:pb-0">
                    <div>
                      <p className="text-oroko-black">{item.description}</p>
                      <p className="text-xs text-muted-foreground">{item.actorName}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickActions
                .filter((a) => hasPermission(role, a.permission))
                .map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex flex-col items-center gap-2 rounded-lg border border-border p-3 text-center text-xs font-medium text-oroko-black hover:bg-muted transition-colors"
                  >
                    <Icon className="size-5 text-oroko-gold" />
                    {label}
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import Membership from "@/models/Membership";
import User from "@/models/User";
import Donation from "@/models/Donation";
import Event from "@/models/Event";
import Project from "@/models/Project";
import WelfareRequest from "@/models/WelfareRequest";
import ContactMessage from "@/models/ContactMessage";
import AuditLog from "@/models/AuditLog";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

/** Badge count shown on the header bell — sums items that need admin attention, scoped to what the role can act on. */
export async function getAdminNotificationCount(role: string): Promise<number> {
  await connectDB();
  let count = 0;

  if (hasPermission(role, PERMISSIONS.APPLICATIONS_MANAGE)) {
    count += await Membership.countDocuments({
      applicationStatus: { $in: ["pending", "under_review"] },
    });
  }
  if (hasPermission(role, PERMISSIONS.WELFARE_MANAGE)) {
    count += await WelfareRequest.countDocuments({
      status: { $in: ["submitted", "under_review"] },
    });
  }
  if (hasPermission(role, PERMISSIONS.CONTACT_MANAGE)) {
    count += await ContactMessage.countDocuments({ status: "new" });
  }

  return count;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  pendingApplications: number;
  expiredMemberships: number;
  suspendedMembers: number;
  newMembersThisMonth: number;
  expiringSoon: number;
  totalDonations: number;
  pendingWelfareRequests: number;
  upcomingEvents: number;
  activeProjects: number;
  membershipByCountry: { label: string; count: number }[];
  membershipByType: { label: string; count: number }[];
  membershipByStatus: { label: string; count: number }[];
  membershipGrowth: { label: string; count: number }[];
  donationsOverTime: { label: string; amount: number }[];
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  await connectDB();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalMembers,
    activeMembers,
    pendingApplications,
    expiredMemberships,
    suspendedMembers,
    newMembersThisMonth,
    expiringSoon,
    donationAgg,
    pendingWelfareRequests,
    upcomingEvents,
    activeProjects,
    byCountryRaw,
    byTypeRaw,
    byStatusRaw,
    growthRaw,
    donationsRaw,
  ] = await Promise.all([
    Membership.countDocuments({}),
    Membership.countDocuments({ status: "active" }),
    Membership.countDocuments({ applicationStatus: { $in: ["pending", "under_review", "needs_information"] } }),
    Membership.countDocuments({ status: "expired" }),
    Membership.countDocuments({ status: "suspended" }),
    Membership.countDocuments({ createdAt: { $gte: monthStart } }),
    Membership.countDocuments({ status: "active", expiresAt: { $gte: now, $lte: in30Days } }),
    Donation.aggregate([
      { $match: { status: "succeeded" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    WelfareRequest.countDocuments({ status: { $in: ["submitted", "under_review"] } }),
    Event.countDocuments({ status: "published", startDate: { $gte: now } }),
    Project.countDocuments({ status: "active" }),
    Membership.aggregate([
      { $match: { country: { $nin: [null, ""] } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    Membership.aggregate([
      { $group: { _id: "$membershipType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Membership.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Membership.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
    ]),
    Donation.aggregate([
      { $match: { status: "succeeded", createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1 } },
    ]),
  ]);

  // Build a stable 12-month timeline even for months with zero activity
  const months: { key: string; label: string; y: number; m: number }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(twelveMonthsAgo.getFullYear(), twelveMonthsAgo.getMonth() + i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth() + 1}`, label: MONTH_LABELS[d.getMonth()], y: d.getFullYear(), m: d.getMonth() + 1 });
  }

  const growthMap = new Map(growthRaw.map((g: { _id: { y: number; m: number }; count: number }) => [`${g._id.y}-${g._id.m}`, g.count]));
  const donationsMap = new Map(donationsRaw.map((g: { _id: { y: number; m: number }; amount: number }) => [`${g._id.y}-${g._id.m}`, g.amount]));

  return {
    totalMembers,
    activeMembers,
    pendingApplications,
    expiredMemberships,
    suspendedMembers,
    newMembersThisMonth,
    expiringSoon,
    totalDonations: donationAgg[0]?.total ?? 0,
    pendingWelfareRequests,
    upcomingEvents,
    activeProjects,
    membershipByCountry: byCountryRaw.map((c: { _id: string; count: number }) => ({ label: c._id, count: c.count })),
    membershipByType: byTypeRaw.map((c: { _id: string; count: number }) => ({ label: c._id ?? "Unspecified", count: c.count })),
    membershipByStatus: byStatusRaw.map((c: { _id: string; count: number }) => ({ label: c._id, count: c.count })),
    membershipGrowth: months.map((mo) => ({ label: mo.label, count: growthMap.get(mo.key) ?? 0 })),
    donationsOverTime: months.map((mo) => ({ label: mo.label, amount: donationsMap.get(mo.key) ?? 0 })),
  };
});

export interface RecentActivityItem {
  id: string;
  description: string;
  actorName: string;
  action: string;
  createdAt: string;
}

export async function getRecentActivity(limit = 10): Promise<RecentActivityItem[]> {
  await connectDB();
  const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  return logs.map((l) => ({
    id: l._id.toString(),
    description: l.description,
    actorName: l.actorName,
    action: l.action,
    createdAt: l.createdAt.toISOString(),
  }));
}

export async function getUserById(id: string) {
  await connectDB();
  return User.findById(id).lean();
}

import "server-only";
import { connectDB } from "@/lib/db";
import Membership from "@/models/Membership";
import EventRegistration from "@/models/EventRegistration";
import Event from "@/models/Event";
import Project from "@/models/Project";
import Donation from "@/models/Donation";
import WelfareRequest from "@/models/WelfareRequest";

interface DateRange {
  from?: string;
  to?: string;
}

function dateFilter(range: DateRange, field = "createdAt") {
  const filter: Record<string, Date> = {};
  if (range.from) filter.$gte = new Date(range.from);
  if (range.to) filter.$lte = new Date(range.to);
  return Object.keys(filter).length ? { [field]: filter } : {};
}

export async function getMembershipGrowthReport(range: DateRange) {
  await connectDB();
  const rows = await Membership.aggregate([
    { $match: dateFilter(range) },
    { $group: { _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);
  return rows.map((r) => ({ period: `${r._id.y}-${String(r._id.m).padStart(2, "0")}`, count: r.count }));
}

export async function getMembersByCountryReport(range: DateRange) {
  await connectDB();
  const rows = await Membership.aggregate([
    { $match: { ...dateFilter(range), country: { $nin: [null, ""] } } },
    { $group: { _id: "$country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return rows.map((r) => ({ country: r._id, count: r.count }));
}

export async function getMembersByCountryOfOriginReport(range: DateRange) {
  await connectDB();
  const rows = await Membership.aggregate([
    { $match: { ...dateFilter(range), countryOfOrigin: { $nin: [null, ""] } } },
    { $group: { _id: "$countryOfOrigin", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return rows.map((r) => ({ country: r._id, count: r.count }));
}

export async function getMembershipTypeReport(range: DateRange) {
  await connectDB();
  const rows = await Membership.aggregate([
    { $match: dateFilter(range) },
    { $group: { _id: "$membershipType", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return rows.map((r) => ({ type: r._id ?? "Unspecified", count: r.count }));
}

export async function getMembershipStatusReport(range: DateRange) {
  await connectDB();
  const rows = await Membership.aggregate([
    { $match: dateFilter(range) },
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return rows.map((r) => ({ status: r._id, count: r.count }));
}

export async function getMembershipExpirationReport() {
  await connectDB();
  const now = new Date();
  const in60Days = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
  const memberships = await Membership.find({ status: "active", expiresAt: { $gte: now, $lte: in60Days } })
    .sort({ expiresAt: 1 })
    .populate("user", "firstName lastName email")
    .lean();
  return memberships
    .filter((m) => m.user)
    .map((m) => {
      const user = m.user as unknown as { firstName: string; lastName: string; email: string };
      return { name: `${user.firstName} ${user.lastName}`, email: user.email, orokoId: m.orokoId, expiresAt: m.expiresAt!.toISOString() };
    });
}

export async function getEventParticipationReport(range: DateRange) {
  await connectDB();
  const rows = await EventRegistration.aggregate([
    { $match: dateFilter(range) },
    { $group: { _id: "$event", registrations: { $sum: 1 }, attendees: { $sum: "$quantity" } } },
    { $sort: { registrations: -1 } },
  ]);
  const eventIds = rows.map((r) => r._id);
  const events = await Event.find({ _id: { $in: eventIds } }).select("title startDate").lean();
  const eventMap = new Map(events.map((e) => [e._id.toString(), e]));
  return rows.map((r) => ({
    event: eventMap.get(r._id?.toString())?.title ?? "Unknown Event",
    date: eventMap.get(r._id?.toString())?.startDate?.toISOString() ?? "",
    registrations: r.registrations,
    attendees: r.attendees,
  }));
}

export async function getProjectParticipationReport() {
  await connectDB();
  const projects = await Project.find({}).select("title status teamMembers progressPercent").lean();
  return projects.map((p) => ({
    project: p.title,
    status: p.status,
    teamSize: p.teamMembers.length,
    progressPercent: p.progressPercent,
  }));
}

export async function getDonationsReport(range: DateRange) {
  await connectDB();
  const rows = await Donation.aggregate([
    { $match: { ...dateFilter(range), status: "succeeded" } },
    { $group: { _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);
  return rows.map((r) => ({ period: `${r._id.y}-${String(r._id.m).padStart(2, "0")}`, total: r.total, count: r.count }));
}

export async function getWelfareAssistanceReport(range: DateRange) {
  await connectDB();
  const rows = await WelfareRequest.aggregate([
    { $match: dateFilter(range) },
    { $group: { _id: "$requestType", count: { $sum: 1 }, totalApproved: { $sum: { $ifNull: ["$amountApproved", 0] } } } },
    { $sort: { count: -1 } },
  ]);
  return rows.map((r) => ({ type: r._id, count: r.count, totalApproved: r.totalApproved }));
}

export async function getMemberEngagementReport() {
  await connectDB();
  const rows = await EventRegistration.aggregate([
    { $match: { user: { $ne: null } } },
    { $group: { _id: "$user", eventCount: { $sum: 1 } } },
    { $sort: { eventCount: -1 } },
    { $limit: 50 },
  ]);
  const userIds = rows.map((r) => r._id);
  const User = (await import("@/models/User")).default;
  const users = await User.find({ _id: { $in: userIds } }).select("firstName lastName email").lean();
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));
  return rows.map((r) => {
    const user = userMap.get(r._id?.toString());
    return { name: user ? `${user.firstName} ${user.lastName}` : "Unknown", email: user?.email ?? "", eventCount: r.eventCount };
  });
}

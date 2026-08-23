import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import GovernanceRole from "@/models/GovernanceRole";
import ExecutiveMember from "@/models/ExecutiveMember";
import Committee from "@/models/Committee";
import CommitteeMember from "@/models/CommitteeMember";
import GovernanceMeeting, { type IGovernanceMeeting, type GovernanceOrgan } from "@/models/GovernanceMeeting";
import GovernanceDocument, { type IGovernanceDocument } from "@/models/GovernanceDocument";
import User from "@/models/User";
import { Types } from "mongoose";

// ─── Serialized types (plain objects for Server→Client passing) ─────────────

export type OfficerProfile = {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  roleName: string;
  roleDescription?: string;
  responsibilities: string[];
  term: string;
  bio?: string;
  order: number;
};

export type CommitteeSummary = {
  id: string;
  name: string;
  slug: string;
  mandate: string;
  description?: string;
  order: number;
  memberCount: number;
};

export type CommitteeMemberProfile = {
  userId: string;
  userName: string;
  userPhoto?: string;
  role: string;
};

export type CommitteeDetail = CommitteeSummary & {
  members: CommitteeMemberProfile[];
};

export type MeetingSummary = {
  id: string;
  organ: string;
  committeeName?: string;
  title: string;
  sessionNumber?: string;
  date: string;
  endDate?: string;
  venue?: string;
  format: string;
  status: string;
  agendaItems: string[];
  minutes?: string;
  attendeeCount?: number;
  isPublic: boolean;
};

export type DocumentSummary = {
  id: string;
  organ: string;
  committeeName?: string;
  type: string;
  reference?: string;
  title: string;
  summary?: string;
  adoptedAt?: string;
  attachmentUrl?: string;
  isPublic: boolean;
};

// ─── Queries ────────────────────────────────────────────────────────────────

export const getExecutiveOfficers = cache(async (): Promise<OfficerProfile[]> => {
  await connectDB();

  const members = await ExecutiveMember.find({ isActive: true })
    .populate("user", "firstName lastName profilePhoto")
    .populate("role", "name description responsibilities order")
    .sort({ "role.order": 1 })
    .lean();

  return members
    .filter((m) => m.user && m.role)
    .map((m) => {
      const user = m.user as unknown as { _id: Types.ObjectId; firstName: string; lastName: string; profilePhoto?: string };
      const role = m.role as unknown as { _id: Types.ObjectId; name: string; description?: string; responsibilities?: string[]; order: number };
      return {
        id: (m._id as Types.ObjectId).toString(),
        userId: user._id.toString(),
        userName: `${user.firstName} ${user.lastName}`,
        userPhoto: user.profilePhoto,
        roleName: role.name,
        roleDescription: role.description,
        responsibilities: role.responsibilities ?? [],
        term: m.term,
        bio: m.bio,
        order: role.order,
      };
    })
    .sort((a, b) => a.order - b.order);
});

export const getCommittees = cache(async (): Promise<CommitteeSummary[]> => {
  await connectDB();

  const committees = await Committee.find({ isActive: true })
    .sort({ order: 1 })
    .lean();

  const counts = await CommitteeMember.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$committee", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(counts.map((c) => [c._id.toString(), c.count as number]));

  return committees.map((c) => ({
    id: (c._id as Types.ObjectId).toString(),
    name: c.name,
    slug: c.slug,
    mandate: c.mandate,
    description: c.description,
    order: c.order,
    memberCount: countMap.get((c._id as Types.ObjectId).toString()) ?? 0,
  }));
});

export const getCommitteeBySlug = cache(async (slug: string): Promise<CommitteeDetail | null> => {
  await connectDB();

  const committee = await Committee.findOne({ slug, isActive: true }).lean();
  if (!committee) return null;

  const rawMembers = await CommitteeMember.find({
    committee: committee._id,
    isActive: true,
  })
    .populate("user", "firstName lastName profilePhoto")
    .sort({ role: 1 })
    .lean();

  const members: CommitteeMemberProfile[] = rawMembers
    .filter((m) => m.user)
    .map((m) => {
      const user = m.user as unknown as { _id: Types.ObjectId; firstName: string; lastName: string; profilePhoto?: string };
      return {
        userId: (m.user as { _id: Types.ObjectId })._id.toString(),
        userName: `${user.firstName} ${user.lastName}`,
        userPhoto: user.profilePhoto,
        role: m.role,
      };
    });

  const total = rawMembers.length;

  return {
    id: (committee._id as Types.ObjectId).toString(),
    name: committee.name,
    slug: committee.slug,
    mandate: committee.mandate,
    description: committee.description,
    order: committee.order,
    memberCount: total,
    members,
  };
});

export async function getMeetings(opts: {
  organ?: GovernanceOrgan;
  committeeId?: string;
  publicOnly?: boolean;
  limit?: number;
}): Promise<MeetingSummary[]> {
  const { organ, committeeId, publicOnly = false, limit = 20 } = opts;
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (organ) filter.organ = organ;
  if (committeeId) filter.committee = new Types.ObjectId(committeeId);
  if (publicOnly) filter.isPublic = true;

  const meetings = await GovernanceMeeting.find(filter)
    .sort({ date: -1 })
    .limit(limit)
    .populate("committee", "name")
    .lean<(IGovernanceMeeting & { committee?: { name: string } | null })[]>();

  return meetings.map((m) => ({
    id: (m._id as Types.ObjectId).toString(),
    organ: m.organ,
    committeeName: m.committee?.name,
    title: m.title,
    sessionNumber: m.sessionNumber,
    date: m.date.toISOString(),
    endDate: m.endDate?.toISOString(),
    venue: m.venue,
    format: m.format,
    status: m.status,
    agendaItems: m.agendaItems ?? [],
    minutes: m.minutes,
    attendeeCount: m.attendeeCount,
    isPublic: m.isPublic,
  }));
}

export async function getDocuments(opts: {
  organ?: GovernanceOrgan;
  committeeId?: string;
  type?: string;
  publicOnly?: boolean;
  limit?: number;
}): Promise<DocumentSummary[]> {
  const { organ, committeeId, type, publicOnly = false, limit = 20 } = opts;
  await connectDB();

  const filter: Record<string, unknown> = {};
  if (organ) filter.organ = organ;
  if (committeeId) filter.committee = new Types.ObjectId(committeeId);
  if (type) filter.type = type;
  if (publicOnly) filter.isPublic = true;

  const docs = await GovernanceDocument.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("committee", "name")
    .lean<(IGovernanceDocument & { committee?: { name: string } | null })[]>();

  return docs.map((d) => ({
    id: (d._id as Types.ObjectId).toString(),
    organ: d.organ,
    committeeName: d.committee?.name,
    type: d.type,
    reference: d.reference,
    title: d.title,
    summary: d.summary,
    adoptedAt: d.adoptedAt?.toISOString(),
    attachmentUrl: d.attachmentUrl,
    isPublic: d.isPublic,
  }));
}

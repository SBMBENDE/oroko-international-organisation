import "server-only";
import { connectDB } from "@/lib/db";
import User, { type IUser } from "@/models/User";
import Membership, { type IMembership } from "@/models/Membership";
import { Types } from "mongoose";

export interface MemberListItem {
  id: string;
  orokoId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  membershipType: string;
  status: string;
  country?: string;
  profession?: string;
  memberSince: string;
  expiresAt?: string;
}

export interface MemberListFilters {
  q?: string;
  membershipType?: string;
  status?: string;
  country?: string;
  countryOfOrigin?: string;
  profession?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function getMembers(filters: MemberListFilters) {
  await connectDB();
  const { q, membershipType, status, country, countryOfOrigin, profession, sort = "-createdAt", page = 1, limit = 20 } = filters;

  const membershipFilter: Record<string, unknown> = {};
  if (membershipType) membershipFilter.membershipType = membershipType;
  if (status) membershipFilter.status = status;
  if (country) membershipFilter.country = country;
  if (countryOfOrigin) membershipFilter.countryOfOrigin = countryOfOrigin;
  if (profession) membershipFilter.profession = profession;

  let userIds: Types.ObjectId[] | undefined;
  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const [users, memberships] = await Promise.all([
      User.find({ $or: [{ firstName: regex }, { lastName: regex }, { email: regex }, { phone: regex }] }).select("_id").lean(),
      Membership.find({ orokoId: regex }).select("user").lean(),
    ]);
    const ids = new Set<string>([
      ...users.map((u) => u._id.toString()),
      ...memberships.map((m) => m.user.toString()),
    ]);
    userIds = Array.from(ids).map((id) => new Types.ObjectId(id));
    membershipFilter.user = { $in: userIds };
  }

  const skip = (page - 1) * limit;
  const [memberships, total] = await Promise.all([
    Membership.find(membershipFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate<{ user: IUser }>("user", "firstName lastName email phone isActive")
      .lean(),
    Membership.countDocuments(membershipFilter),
  ]);

  const members: MemberListItem[] = memberships
    .filter((m) => m.user)
    .map((m) => {
      const user = m.user as unknown as IUser;
      return {
        id: (user._id as Types.ObjectId).toString(),
        orokoId: m.orokoId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        membershipType: m.membershipType,
        status: m.status,
        country: m.country,
        profession: m.profession,
        memberSince: m.memberSince.toISOString(),
        expiresAt: m.expiresAt?.toISOString(),
      };
    });

  return { members, total, pages: Math.ceil(total / limit) || 1, page };
}

export interface MemberDetail {
  user: IUser & { _id: Types.ObjectId };
  membership: IMembership & { _id: Types.ObjectId };
}

export async function getMemberDetail(userId: string): Promise<MemberDetail | null> {
  await connectDB();
  if (!Types.ObjectId.isValid(userId)) return null;

  const [user, membership] = await Promise.all([
    User.findById(userId).lean<IUser & { _id: Types.ObjectId }>(),
    Membership.findOne({ user: userId })
      .populate("reviewedBy", "firstName lastName")
      .populate("internalNotes.author", "firstName lastName")
      .lean<IMembership & { _id: Types.ObjectId }>(),
  ]);

  if (!user || !membership) return null;
  return { user, membership };
}

export async function getDistinctMemberFilters() {
  await connectDB();
  const [countries, countriesOfOrigin, professions] = await Promise.all([
    Membership.distinct("country", { country: { $nin: [null, ""] } }),
    Membership.distinct("countryOfOrigin", { countryOfOrigin: { $nin: [null, ""] } }),
    Membership.distinct("profession", { profession: { $nin: [null, ""] } }),
  ]);
  return {
    countries: countries.sort(),
    countriesOfOrigin: countriesOfOrigin.sort(),
    professions: professions.sort(),
  };
}

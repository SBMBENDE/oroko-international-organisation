import "server-only";
import { connectDB } from "@/lib/db";
import Membership, { type IMembership } from "@/models/Membership";
import User, { type IUser } from "@/models/User";
import { Types } from "mongoose";

export interface ApplicationListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  membershipType: string;
  applicationStatus: string;
  createdAt: string;
}

export async function getApplications(filters: { status?: string; page?: number; limit?: number }) {
  await connectDB();
  const { status, page = 1, limit = 20 } = filters;

  const filter: Record<string, unknown> = status
    ? { applicationStatus: status }
    : { applicationStatus: { $in: ["pending", "under_review", "needs_information"] } };

  const skip = (page - 1) * limit;
  const [memberships, total] = await Promise.all([
    Membership.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate<{ user: IUser }>("user", "firstName lastName email")
      .lean(),
    Membership.countDocuments(filter),
  ]);

  const applications: ApplicationListItem[] = memberships
    .filter((m) => m.user)
    .map((m) => {
      const user = m.user as unknown as IUser;
      return {
        id: m._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        membershipType: m.membershipType,
        applicationStatus: m.applicationStatus,
        createdAt: m.createdAt.toISOString(),
      };
    });

  return { applications, total, pages: Math.ceil(total / limit) || 1, page };
}

export async function getApplicationDetail(membershipId: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(membershipId)) return null;

  const membership = await Membership.findById(membershipId)
    .populate("internalNotes.author", "firstName lastName")
    .lean<IMembership & { _id: Types.ObjectId }>();
  if (!membership) return null;

  const user = await User.findById(membership.user).lean<IUser & { _id: Types.ObjectId }>();
  if (!user) return null;

  return { membership, user };
}

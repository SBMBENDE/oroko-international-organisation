import "server-only";
import { cache } from "react";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User, { type IUser } from "@/models/User";
import Membership, { type IMembership } from "@/models/Membership";
import { Types } from "mongoose";

export type PublicMember = {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  headline?: string;
  country?: string;
  city?: string;
  occupation?: string;
  isVerified: boolean;
  memberSince: string;
  membershipType: string;
  orokoId: string;
};

/** Current authenticated user + their membership — server-only */
export const getCurrentMember = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectDB();
  const user = await User.findById(session.user.id).lean<IUser>();
  if (!user) return null;

  const membership = await Membership.findOne({
    user: new Types.ObjectId(session.user.id),
  }).lean<IMembership>();

  return { user, membership };
});

/** Fetch any member's public profile by OROKO ID, respecting privacy settings */
export async function getMemberByOrokoId(
  orokoId: string
): Promise<PublicMember | null> {
  await connectDB();
  const membership = await Membership.findOne({ orokoId }).lean<IMembership>();
  if (!membership) return null;

  const user = await User.findById(membership.user).lean<IUser>();
  if (!user || !user.isActive) return null;
  // Only hide if explicitly opted out; absent field defaults to visible
  if (user.privacySettings?.isDirectoryVisible === false) return null;

  return buildPublicProfile(user, membership);
}

/** Directory listing with search + filter */
export async function getMemberDirectory(opts: {
  q?: string;
  country?: string;
  page?: number;
  limit?: number;
}) {
  const { q, country, page = 1, limit = 24 } = opts;
  await connectDB();

  const userFilter: Record<string, unknown> = {
    isActive: true,
    // $ne:false treats absent field as opt-in (matches true and missing)
    "privacySettings.isDirectoryVisible": { $ne: false },
  };

  if (q) {
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    userFilter.$or = [
      { firstName: regex },
      { lastName: regex },
      { occupation: regex },
      { employer: regex },
    ];
  }

  if (country) {
    userFilter.country = country;
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(userFilter)
      .select("firstName lastName profilePhoto headline country city occupation isVerified privacySettings")
      .sort({ firstName: 1 })
      .skip(skip)
      .limit(limit)
      .lean<IUser[]>(),
    User.countDocuments(userFilter),
  ]);

  const memberIds = users.map((u) => u._id);
  const memberships = await Membership.find({ user: { $in: memberIds } })
    .select("user orokoId memberSince membershipType status")
    .lean<IMembership[]>();

  const membershipMap = new Map(
    memberships.map((m) => [m.user.toString(), m])
  );

  const members: PublicMember[] = users
    .map((user) => {
      const m = membershipMap.get((user._id as Types.ObjectId).toString());
      if (!m) return null;
      return buildPublicProfile(user, m);
    })
    .filter((m): m is PublicMember => m !== null);

  return {
    members,
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

function buildPublicProfile(user: IUser, membership: IMembership): PublicMember {
  const privacy = user.privacySettings ?? {
    showCountry: true,
    showOccupation: true,
    showPhone: false,
    showEmail: false,
    isDirectoryVisible: true,
  };

  return {
    _id: (user._id as Types.ObjectId).toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    profilePhoto: user.profilePhoto,
    headline: user.headline,
    country: privacy.showCountry ? user.country : undefined,
    city: privacy.showCountry ? user.city : undefined,
    occupation: privacy.showOccupation ? user.occupation : undefined,
    isVerified: user.isVerified,
    memberSince: membership.memberSince.toISOString(),
    membershipType: membership.membershipType,
    orokoId: membership.orokoId,
  };
}

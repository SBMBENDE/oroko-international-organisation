import "server-only";
import { connectDB } from "@/lib/db";
import Committee, { type ICommittee } from "@/models/Committee";
import CommitteeMember from "@/models/CommitteeMember";
import type { IUser } from "@/models/User";
import { Types } from "mongoose";

export async function getCommittees() {
  await connectDB();
  const committees = await Committee.find({}).sort({ order: 1, name: 1 }).lean<ICommittee[]>();
  const counts = await CommitteeMember.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$committee", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c: { _id: Types.ObjectId; count: number }) => [c._id.toString(), c.count]));

  return committees.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    slug: c.slug,
    mandate: c.mandate,
    description: c.description,
    isActive: c.isActive,
    order: c.order,
    memberCount: countMap.get(c._id.toString()) ?? 0,
  }));
}

export async function getCommitteeDetail(id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return null;

  const committee = await Committee.findById(id).lean<ICommittee & { _id: Types.ObjectId }>();
  if (!committee) return null;

  const members = await CommitteeMember.find({ committee: id })
    .populate<{ user: IUser }>("user", "firstName lastName email")
    .sort({ role: 1 })
    .lean();

  return {
    committee: {
      id: committee._id.toString(),
      name: committee.name,
      mandate: committee.mandate,
      description: committee.description ?? "",
      isActive: committee.isActive,
    },
    members: members
      .filter((m) => m.user)
      .map((m) => {
        const user = m.user as unknown as IUser & { _id: Types.ObjectId };
        return {
          id: (m._id as Types.ObjectId).toString(),
          userId: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: m.role,
          isActive: m.isActive,
        };
      }),
  };
}

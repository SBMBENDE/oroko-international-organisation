import "server-only";
import { connectDB } from "@/lib/db";
import ExecutiveMember from "@/models/ExecutiveMember";
import GovernanceRole, { type IGovernanceRole } from "@/models/GovernanceRole";
import type { IUser } from "@/models/User";
import { Types } from "mongoose";

export async function getLeadershipRoles() {
  await connectDB();
  const roles = await GovernanceRole.find({}).sort({ order: 1, name: 1 }).lean<IGovernanceRole[]>();
  return roles.map((r) => ({
    id: r._id.toString(),
    name: r.name,
    organ: r.organ,
    order: r.order,
    isActive: r.isActive,
  }));
}

export async function getLeadershipMembers() {
  await connectDB();
  const members = await ExecutiveMember.find({})
    .sort({ isActive: -1, startDate: -1 })
    .populate<{ user: IUser }>("user", "firstName lastName email profilePhoto linkedIn")
    .populate<{ role: IGovernanceRole }>("role", "name order")
    .lean();

  return members
    .filter((m) => m.user && m.role)
    .map((m) => {
      const user = m.user as unknown as IUser & { _id: Types.ObjectId };
      const role = m.role as unknown as IGovernanceRole & { _id: Types.ObjectId };
      return {
        id: (m._id as Types.ObjectId).toString(),
        userId: user._id.toString(),
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        roleId: role._id.toString(),
        roleName: role.name,
        term: m.term,
        startDate: m.startDate.toISOString(),
        endDate: m.endDate?.toISOString(),
        isActive: m.isActive,
        bio: m.bio ?? "",
      };
    });
}

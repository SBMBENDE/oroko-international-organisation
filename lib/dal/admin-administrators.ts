import "server-only";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { ADMIN_ROLE_VALUES } from "@/lib/permissions";

export async function getAdministrators() {
  await connectDB();
  const users = await User.find({ role: { $in: ADMIN_ROLE_VALUES } })
    .select("firstName lastName email role isActive createdAt")
    .sort({ role: 1, firstName: 1 })
    .lean();

  return users.map((u) => ({
    id: u._id.toString(),
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
  }));
}

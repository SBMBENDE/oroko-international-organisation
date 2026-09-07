"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS, ADMIN_ROLE_VALUES } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const roleSchema = z.enum(ADMIN_ROLE_VALUES);

export async function assignAdminRole(email: string, role: string): Promise<ActionResult> {
  const parsedRole = roleSchema.safeParse(role);
  if (!parsedRole.success) return { success: false, error: "Invalid role" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.ADMINISTRATORS_MANAGE);
    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return { success: false, error: "No account found with this email" };
    if (user._id.toString() === admin.id && parsedRole.data !== "superadmin") {
      return { success: false, error: "You cannot remove your own Super Admin access" };
    }

    const previousRole = user.role;
    user.role = parsedRole.data;
    await user.save();

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      action: "administrator.role_assigned",
      entityType: "User",
      entityId: user._id.toString(),
      description: `Changed role for ${user.email} from ${previousRole} to ${parsedRole.data}`,
    });

    revalidatePath("/admin/administrators");
    return { success: true };
  } catch (err) {
    console.error("[assignAdminRole]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to assign role" };
  }
}

export async function revokeAdminAccess(userId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.ADMINISTRATORS_MANAGE);
    await connectDB();

    if (userId === admin.id) {
      return { success: false, error: "You cannot revoke your own admin access" };
    }

    const user = await User.findByIdAndUpdate(userId, { $set: { role: "member" } });
    if (!user) return { success: false, error: "User not found" };

    await logAudit({
      actorId: admin.id,
      actorName: admin.name,
      action: "administrator.access_revoked",
      entityType: "User",
      entityId: userId,
      description: `Revoked administrator access for ${user.email}`,
    });

    revalidatePath("/admin/administrators");
    return { success: true };
  } catch (err) {
    console.error("[revokeAdminAccess]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to revoke access" };
  }
}

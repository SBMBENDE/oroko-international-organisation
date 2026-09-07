"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import ExecutiveMember from "@/models/ExecutiveMember";
import GovernanceRole from "@/models/GovernanceRole";
import User from "@/models/User";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const roleSchema = z.object({
  name: z.string().min(2, "Required").max(100),
  organ: z.enum(["executive", "general_assembly", "committee"]),
});

export async function createLeadershipRole(data: unknown): Promise<ActionResult> {
  const parsed = roleSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.LEADERSHIP_MANAGE);
    await connectDB();

    const count = await GovernanceRole.countDocuments({});
    const role = await GovernanceRole.create({ ...parsed.data, order: count });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "leadership.role_created", entityType: "GovernanceRole", entityId: role._id.toString(),
      description: `Created leadership position "${role.name}"`,
    });

    revalidatePath("/admin/leadership");
    return { success: true };
  } catch (err) {
    console.error("[createLeadershipRole]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create position" };
  }
}

const assignSchema = z.object({
  email: z.string().email(),
  roleId: z.string().min(1, "Select a position"),
  term: z.string().min(1, "Required").max(50),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().optional().or(z.literal("")),
  bio: z.string().max(500).optional().or(z.literal("")),
});

export async function assignLeadershipPosition(data: unknown): Promise<ActionResult> {
  const parsed = assignSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.LEADERSHIP_MANAGE);
    await connectDB();

    const user = await User.findOne({ email: parsed.data.email.toLowerCase().trim() });
    if (!user) return { success: false, error: "No member found with this email" };

    const exec = await ExecutiveMember.create({
      user: user._id,
      role: parsed.data.roleId,
      term: parsed.data.term,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
      bio: parsed.data.bio,
      isActive: true,
    });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "leadership.assigned", entityType: "ExecutiveMember", entityId: exec._id.toString(),
      description: `Assigned ${user.firstName} ${user.lastName} to a leadership position`,
    });

    revalidatePath("/admin/leadership");
    revalidatePath("/governance/executive");
    return { success: true };
  } catch (err) {
    console.error("[assignLeadershipPosition]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to assign position" };
  }
}

export async function toggleLeadershipPosition(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.LEADERSHIP_MANAGE);
    await connectDB();

    const exec = await ExecutiveMember.findByIdAndUpdate(id, {
      $set: { isActive, endDate: isActive ? undefined : new Date() },
    });
    if (!exec) return { success: false, error: "Position not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "leadership.toggled", entityType: "ExecutiveMember", entityId: id,
      description: `${isActive ? "Activated" : "Deactivated"} a leadership position`,
    });

    revalidatePath("/admin/leadership");
    revalidatePath("/governance/executive");
    return { success: true };
  } catch (err) {
    console.error("[toggleLeadershipPosition]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update position" };
  }
}

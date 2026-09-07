"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import OrgSettings from "@/models/OrgSettings";
import MembershipType from "@/models/MembershipType";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const orgSettingsSchema = z.object({
  organizationName: z.string().min(2, "Required").max(150),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(30).optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),
  notifyOnNewApplication: z.boolean(),
  notifyOnNewDonation: z.boolean(),
  notifyOnWelfareRequest: z.boolean(),
});

export async function updateOrgSettings(data: unknown): Promise<ActionResult> {
  const parsed = orgSettingsSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.SETTINGS_MANAGE);
    await connectDB();

    const settings = await OrgSettings.findOne({});
    if (settings) {
      Object.assign(settings, parsed.data);
      await settings.save();
    } else {
      await OrgSettings.create(parsed.data);
    }

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "settings.updated", entityType: "OrgSettings",
      description: "Updated organization settings",
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    console.error("[updateOrgSettings]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update settings" };
  }
}

const membershipTypeSchema = z.object({
  name: z.string().min(2, "Required").max(60),
  description: z.string().max(500).optional().or(z.literal("")),
});

export async function createMembershipType(data: unknown): Promise<ActionResult> {
  const parsed = membershipTypeSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.SETTINGS_MANAGE);
    await connectDB();

    const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
    const existing = await MembershipType.findOne({ slug });
    if (existing) return { success: false, error: "A membership type with this name already exists" };

    const count = await MembershipType.countDocuments({});
    await MembershipType.create({ ...parsed.data, slug, order: count });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "settings.membership_type_created", entityType: "MembershipType",
      description: `Created membership type "${parsed.data.name}"`,
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    console.error("[createMembershipType]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create membership type" };
  }
}

export async function toggleMembershipType(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.SETTINGS_MANAGE);
    await connectDB();

    const type = await MembershipType.findByIdAndUpdate(id, { $set: { isActive } });
    if (!type) return { success: false, error: "Membership type not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "settings.membership_type_toggled", entityType: "MembershipType", entityId: id,
      description: `${isActive ? "Activated" : "Deactivated"} membership type "${type.name}"`,
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    console.error("[toggleMembershipType]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update membership type" };
  }
}

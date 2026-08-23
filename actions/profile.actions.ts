"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Types } from "mongoose";
import { profileSchema, privacySchema } from "@/lib/validations/profile";
import type { ActionResult } from "@/types";

async function requireUser(): Promise<string> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("Unauthorized — no active session");
  return id;
}

export async function updateProfile(data: unknown): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    const userId = await requireUser();
    await connectDB();

    const updated = await User.findByIdAndUpdate(
      new Types.ObjectId(userId),
      { $set: parsed.data },
      { new: false, strict: false }
    );

    if (!updated) {
      return { success: false, error: "Member account not found. Please sign out and sign in again." };
    }

    revalidatePath("/portal/profile");
    revalidatePath("/portal");
    return { success: true };
  } catch (err) {
    console.error("[updateProfile]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function updateProfilePhoto(photoUrl: string): Promise<ActionResult> {
  if (!photoUrl || typeof photoUrl !== "string") {
    return { success: false, error: "Invalid photo URL" };
  }

  try {
    const userId = await requireUser();
    await connectDB();

    const updated = await User.findByIdAndUpdate(
      new Types.ObjectId(userId),
      { $set: { profilePhoto: photoUrl } },
      { new: false, strict: false }
    );

    if (!updated) {
      return { success: false, error: "Member account not found. Please sign out and sign in again." };
    }

    revalidatePath("/portal/profile");
    revalidatePath("/portal");
    return { success: true };
  } catch (err) {
    console.error("[updateProfilePhoto]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

export async function updatePrivacySettings(data: unknown): Promise<ActionResult> {
  const parsed = privacySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid privacy settings" };
  }

  try {
    const userId = await requireUser();
    await connectDB();

    const updated = await User.findByIdAndUpdate(
      new Types.ObjectId(userId),
      { $set: { privacySettings: parsed.data } },
      { new: false, strict: false }
    );

    if (!updated) {
      return { success: false, error: "Member account not found. Please sign out and sign in again." };
    }

    revalidatePath("/portal/profile");
    return { success: true };
  } catch (err) {
    console.error("[updatePrivacySettings]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}

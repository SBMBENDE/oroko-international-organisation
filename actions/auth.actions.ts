"use server";

import { signIn, signOut } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Membership from "@/models/Membership";
import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { headers } from "next/headers";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function registerUser(
  data: unknown
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message;
    return { success: false, error: firstError ?? "Invalid form data" };
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return { success: false, error: "An account with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "member",
      membershipStatus: "pending",
      isEmailVerified: false,
      isActive: true,
      // Explicit defaults so the fields exist in the document for directory queries
      privacySettings: {
        showEmail: false,
        showPhone: false,
        showCountry: true,
        showOccupation: true,
        isDirectoryVisible: true,
      },
    });

    await Membership.create({
      user: user._id,
      memberSince: new Date(),
      membershipType: "regular",
      status: "pending",
    });

    return { success: true };
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err?.code === 11000) {
      return { success: false, error: "An account with this email already exists" };
    }
    console.error("Registration error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function loginUser(
  email: string,
  password: string,
  callbackUrl?: string
): Promise<ActionResult> {
  try {
    const headersList = await headers();
    // x-forwarded-host is the real domain on Vercel; avoids AUTH_URL normalization
    const fwdHost = headersList.get("x-forwarded-host");
    const host = fwdHost ?? headersList.get("host") ?? "localhost:3000";
    const proto = host.includes("localhost") ? "http" : "https";
    const redirectTo = `${proto}://${host}${callbackUrl ?? "/portal"}`;

    await signIn("credentials", { email, password, redirectTo });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email or password" };
        default:
          return { success: false, error: "Authentication failed. Please try again." };
      }
    }
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  const headersList = await headers();
  const fwdHost = headersList.get("x-forwarded-host");
  const host = fwdHost ?? headersList.get("host") ?? "localhost:3000";
  const proto = host.includes("localhost") ? "http" : "https";
  await signOut({ redirectTo: `${proto}://${host}/` });
}

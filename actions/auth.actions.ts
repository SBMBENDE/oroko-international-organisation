"use server";

import { signIn, signOut } from "@/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Membership from "@/models/Membership";
import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

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
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? "/portal",
    });
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
    // Next.js redirect() throws internally — re-throw to allow the redirect
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

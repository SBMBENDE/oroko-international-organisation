"use server";

import { connectDB } from "@/lib/db";
import Donation from "@/models/Donation";
import Project from "@/models/Project";
import { stripe, formatAmountForStripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { z } from "zod";
import type { ActionResult } from "@/types";

const donationSchema = z.object({
  donorName: z.string().min(2, "Name is required").max(100),
  donorEmail: z.string().email("Valid email required"),
  amount: z.number().min(1, "Minimum donation is $1").max(50000),
  currency: z.string().default("USD"),
  type: z.enum(["general", "project"]).default("general"),
  projectId: z.string().optional(),
  message: z.string().max(500).optional(),
  isAnonymous: z.boolean().default(false),
  frequency: z.enum(["once", "monthly", "annually"]).default("once"),
});

export type DonationInput = z.infer<typeof donationSchema>;

export async function createPaymentIntent(
  data: unknown
): Promise<ActionResult & { clientSecret?: string; donationId?: string }> {
  const parsed = donationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const { donorName, donorEmail, amount, currency, type, projectId, message, isAnonymous, frequency } = parsed.data;

  try {
    const session = await auth();
    await connectDB();

    const stripeAmount = formatAmountForStripe(amount, currency);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: stripeAmount,
      currency: currency.toLowerCase(),
      metadata: {
        donorName: isAnonymous ? "Anonymous" : donorName,
        donorEmail,
        type,
        projectId: projectId ?? "",
        frequency,
      },
      receipt_email: donorEmail,
    });

    // Create a pending donation record (no card data stored)
    const donation = await Donation.create({
      donorName: isAnonymous ? "Anonymous" : donorName,
      donorEmail,
      userId: session?.user?.id ?? undefined,
      amount,
      currency,
      type,
      project: projectId ?? undefined,
      message,
      isAnonymous,
      frequency,
      stripePaymentIntentId: paymentIntent.id,
      status: "pending",
    });

    // Update project funding raised when donation is completed (via webhook in production)
    // For now we optimistically track it here too

    return {
      success: true,
      clientSecret: paymentIntent.client_secret ?? undefined,
      donationId: donation._id.toString(),
    };
  } catch (err) {
    console.error("[createPaymentIntent]", err);
    const msg = err instanceof Error ? err.message : "Payment setup failed";
    return { success: false, error: msg };
  }
}

export async function confirmDonation(donationId: string): Promise<ActionResult> {
  try {
    await connectDB();
    const donation = await Donation.findByIdAndUpdate(
      donationId,
      { $set: { status: "succeeded", receiptNumber: `OROKO-${Date.now()}` } },
      { new: false }
    );
    if (!donation) return { success: false, error: "Donation not found" };

    // Update project fundingRaised
    if (donation.project) {
      await Project.findByIdAndUpdate(donation.project, {
        $inc: { fundingRaised: donation.amount },
      });
    }

    return { success: true };
  } catch (err) {
    console.error("[confirmDonation]", err);
    return { success: false, error: "Failed to confirm donation" };
  }
}

export async function getDonationHistory(): Promise<{
  id: string; amount: number; currency: string; type: string;
  projectTitle?: string; status: string; receiptNumber?: string; createdAt: string;
}[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  await connectDB();

  const donations = await Donation.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("project", "title")
    .lean();

  return donations.map((d) => ({
    id: d._id.toString(),
    amount: d.amount,
    currency: d.currency,
    type: d.type,
    projectTitle: (d.project as { title?: string } | null)?.title,
    status: d.status,
    receiptNumber: d.receiptNumber,
    createdAt: d.createdAt.toISOString(),
  }));
}

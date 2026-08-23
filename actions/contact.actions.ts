"use server";

import { z } from "zod";
import { connectDB } from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import type { ActionResult } from "@/types";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email required"),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
});

export async function sendContactMessage(data: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  try {
    await connectDB();
    await ContactMessage.create(parsed.data);
    return { success: true };
  } catch (err) {
    console.error("[sendContactMessage]", err);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

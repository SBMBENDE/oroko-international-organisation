"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import EventRegistration from "@/models/EventRegistration";
import { z } from "zod";
import { Types } from "mongoose";
import type { ActionResult } from "@/types";

const registrationSchema = z.object({
  eventId: z.string().min(1),
  ticketTypeId: z.string().min(1),
  attendeeName: z.string().min(2, "Name is required").max(100),
  attendeeEmail: z.string().email("Valid email required"),
  quantity: z.number().int().min(1).max(10),
  notes: z.string().max(300).optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export async function registerForEvent(
  data: unknown
): Promise<ActionResult & { registrationId?: string; registrationCode?: string }> {
  const parsed = registrationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const { eventId, ticketTypeId, attendeeName, attendeeEmail, quantity, notes } = parsed.data;

  try {
    const session = await auth();
    await connectDB();

    const event = await Event.findById(new Types.ObjectId(eventId));
    if (!event) return { success: false, error: "Event not found" };
    if (event.status !== "published") return { success: false, error: "Registrations are closed" };

    const now = new Date();
    if (event.registrationDeadline && now > event.registrationDeadline) {
      return { success: false, error: "Registration deadline has passed" };
    }

    const ticket = event.ticketTypes.find(
      (t) => (t as { _id?: Types.ObjectId })?._id?.toString() === ticketTypeId
    );
    if (!ticket || !ticket.isActive) return { success: false, error: "Ticket type not available" };

    if (ticket.capacity != null && ticket.sold + quantity > ticket.capacity) {
      return { success: false, error: "Not enough spots available for this ticket type" };
    }
    if (event.capacity != null && event.attendeeCount + quantity > event.capacity) {
      return { success: false, error: "Event capacity reached" };
    }

    // One registration per email per event
    const existing = await EventRegistration.findOne({
      event: new Types.ObjectId(eventId),
      attendeeEmail,
      status: { $in: ["confirmed", "pending"] },
    });
    if (existing) return { success: false, error: "You are already registered for this event" };

    const totalAmount = ticket.price * quantity;

    const reg = await EventRegistration.create({
      event: new Types.ObjectId(eventId),
      user: session?.user?.id ? new Types.ObjectId(session.user.id) : undefined,
      attendeeName,
      attendeeEmail,
      ticketTypeId,
      ticketTypeName: ticket.name,
      ticketPrice: ticket.price,
      currency: ticket.currency,
      quantity,
      totalAmount,
      status: ticket.isFree ? "confirmed" : "pending",
      notes,
    });

    // Update counts
    await Event.findByIdAndUpdate(new Types.ObjectId(eventId), {
      $inc: { attendeeCount: quantity, "ticketTypes.$[t].sold": quantity },
    }, {
      arrayFilters: [{ "t._id": (ticket as { _id?: Types.ObjectId })?._id }],
    });

    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/portal/events");

    return {
      success: true,
      registrationId: reg._id.toString(),
      registrationCode: reg.registrationCode,
    };
  } catch (err) {
    console.error("[registerForEvent]", err);
    return { success: false, error: err instanceof Error ? err.message : "Registration failed" };
  }
}

export async function cancelRegistration(registrationId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    await connectDB();
    const reg = await EventRegistration.findOne({
      _id: new Types.ObjectId(registrationId),
      user: new Types.ObjectId(session.user.id),
      status: { $in: ["confirmed", "pending"] },
    });
    if (!reg) return { success: false, error: "Registration not found" };

    await EventRegistration.findByIdAndUpdate(registrationId, { $set: { status: "cancelled" } });

    // Return spots
    await Event.findByIdAndUpdate(reg.event, {
      $inc: { attendeeCount: -reg.quantity },
    });

    revalidatePath("/portal/events");
    return { success: true };
  } catch (err) {
    console.error("[cancelRegistration]", err);
    return { success: false, error: "Failed to cancel" };
  }
}

/** Void-returning wrapper for use as a Next.js form action via .bind() */
export async function cancelRegistrationVoid(registrationId: string): Promise<void> {
  await cancelRegistration(registrationId);
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import { requireAdminSession } from "@/lib/admin-auth";
import { PERMISSIONS } from "@/lib/permissions";
import { logAudit } from "@/lib/audit";
import type { ActionResult } from "@/types";

const eventSchema = z.object({
  title: z.string().min(2, "Required").max(200),
  summary: z.string().min(2, "Required").max(300),
  description: z.string().optional().or(z.literal("")),
  type: z.enum(["convention", "seminar", "cultural", "meeting", "webinar", "social", "fundraising", "other"]),
  format: z.enum(["in_person", "virtual", "hybrid"]),
  startDate: z.string().min(1, "Required"),
  endDate: z.string().optional().or(z.literal("")),
  venueName: z.string().optional().or(z.literal("")),
  venueCity: z.string().optional().or(z.literal("")),
  venueCountry: z.string().optional().or(z.literal("")),
  virtualLink: z.string().optional().or(z.literal("")),
  capacity: z.number().int().min(0).optional(),
  isPublic: z.boolean(),
  isFeatured: z.boolean(),
  isFree: z.boolean(),
  price: z.number().min(0).optional(),
});

function toEventDoc(data: z.infer<typeof eventSchema>) {
  return {
    title: data.title,
    summary: data.summary,
    description: data.description,
    type: data.type,
    format: data.format,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    venue: { name: data.venueName, city: data.venueCity, country: data.venueCountry, virtualLink: data.virtualLink },
    capacity: data.capacity,
    isPublic: data.isPublic,
    isFeatured: data.isFeatured,
    ticketTypes: [{
      name: "General Admission",
      price: data.isFree ? 0 : (data.price ?? 0),
      currency: "USD",
      capacity: data.capacity,
      sold: 0,
      isFree: data.isFree,
      isMembersOnly: false,
      isActive: true,
    }],
  };
}

export async function createEvent(data: unknown): Promise<ActionResult & { id?: string }> {
  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.EVENTS_MANAGE);
    await connectDB();

    const event = await Event.create({ ...toEventDoc(parsed.data), status: "draft" });

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "event.created", entityType: "Event", entityId: event._id.toString(),
      description: `Created event "${event.title}"`,
    });

    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true, id: event._id.toString() };
  } catch (err) {
    console.error("[createEvent]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create event" };
  }
}

export async function updateEvent(id: string, data: unknown): Promise<ActionResult> {
  const parsed = eventSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const admin = await requireAdminSession(PERMISSIONS.EVENTS_MANAGE);
    await connectDB();

    const event = await Event.findById(id);
    if (!event) return { success: false, error: "Event not found" };

    const doc = toEventDoc(parsed.data);
    Object.assign(event, doc);
    if (event.ticketTypes.length > 0) {
      event.ticketTypes[0].isFree = doc.ticketTypes[0].isFree;
      event.ticketTypes[0].price = doc.ticketTypes[0].price;
      event.ticketTypes[0].capacity = doc.ticketTypes[0].capacity;
    } else {
      event.ticketTypes = doc.ticketTypes as unknown as typeof event.ticketTypes;
    }
    await event.save();

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "event.updated", entityType: "Event", entityId: id,
      description: `Updated event "${event.title}"`,
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    revalidatePath("/events");
    return { success: true };
  } catch (err) {
    console.error("[updateEvent]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update event" };
  }
}

const STATUS_VALUES = ["draft", "published", "cancelled", "completed"] as const;

export async function updateEventStatus(id: string, status: (typeof STATUS_VALUES)[number]): Promise<ActionResult> {
  try {
    const admin = await requireAdminSession(PERMISSIONS.EVENTS_MANAGE);
    await connectDB();

    const event = await Event.findByIdAndUpdate(id, { $set: { status } });
    if (!event) return { success: false, error: "Event not found" };

    await logAudit({
      actorId: admin.id, actorName: admin.name,
      action: "event.status_changed", entityType: "Event", entityId: id,
      description: `Changed event "${event.title}" status to ${status}`,
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    revalidatePath("/events");
    return { success: true };
  } catch (err) {
    console.error("[updateEventStatus]", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update status" };
  }
}

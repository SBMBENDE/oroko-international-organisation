import "server-only";
import { connectDB } from "@/lib/db";
import Event, { type IEvent } from "@/models/Event";
import EventRegistration, { type IEventRegistration } from "@/models/EventRegistration";
import { Types } from "mongoose";

export async function getAdminEvents(filters: { status?: string; page?: number; limit?: number }) {
  await connectDB();
  const { status, page = 1, limit = 20 } = filters;
  const filter: Record<string, unknown> = status ? { status } : {};

  const skip = (page - 1) * limit;
  const [events, total] = await Promise.all([
    Event.find(filter).sort({ startDate: -1 }).skip(skip).limit(limit).lean<IEvent[]>(),
    Event.countDocuments(filter),
  ]);

  return {
    events: events.map((e) => ({
      id: e._id.toString(),
      title: e.title,
      slug: e.slug,
      status: e.status,
      startDate: e.startDate.toISOString(),
      attendeeCount: e.attendeeCount,
      capacity: e.capacity,
      isFeatured: e.isFeatured,
    })),
    total,
    pages: Math.ceil(total / limit) || 1,
    page,
  };
}

export async function getAdminEventDetail(id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return null;

  const event = await Event.findById(id).lean<IEvent & { _id: Types.ObjectId }>();
  if (!event) return null;

  const registrations = await EventRegistration.find({ event: id })
    .sort({ createdAt: -1 })
    .lean<IEventRegistration[]>();

  return {
    event: {
      id: event._id.toString(),
      title: event.title,
      summary: event.summary,
      description: event.description ?? "",
      type: event.type,
      status: event.status,
      format: event.format,
      startDate: event.startDate.toISOString().slice(0, 16),
      endDate: event.endDate?.toISOString().slice(0, 16) ?? "",
      venueName: event.venue?.name ?? "",
      venueCity: event.venue?.city ?? "",
      venueCountry: event.venue?.country ?? "",
      virtualLink: event.venue?.virtualLink ?? "",
      capacity: event.capacity,
      isPublic: event.isPublic,
      isFeatured: event.isFeatured,
      isFree: event.ticketTypes[0]?.isFree ?? true,
      price: event.ticketTypes[0]?.price ?? 0,
    },
    registrations: registrations.map((r) => ({
      id: r._id.toString(),
      attendeeName: r.attendeeName,
      attendeeEmail: r.attendeeEmail,
      quantity: r.quantity,
      status: r.status,
      registrationCode: r.registrationCode,
      checkedInAt: r.checkedInAt?.toISOString(),
    })),
  };
}

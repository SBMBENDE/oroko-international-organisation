import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import Event, { type IEvent } from "@/models/Event";
import EventRegistration, { type IEventRegistration } from "@/models/EventRegistration";
import { auth } from "@/auth";
import { Types } from "mongoose";

export type EventSummary = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  type: string;
  status: string;
  format: string;
  coverImage?: string;
  startDate: string;
  endDate?: string;
  city?: string;
  country?: string;
  isFeatured: boolean;
  isFree: boolean;
  lowestPrice: number;
  currency: string;
  capacity?: number;
  attendeeCount: number;
  registrationDeadline?: string;
  spotsLeft?: number;
};

export type EventDetail = EventSummary & {
  description?: string;
  timezone: string;
  venue: { name?: string; address?: string; city?: string; country?: string; virtualLink?: string };
  ticketTypes: {
    id: string; name: string; description?: string; price: number;
    currency: string; capacity?: number; sold: number; isFree: boolean;
    isMembersOnly: boolean; isActive: boolean; spotsLeft?: number;
  }[];
  schedule: { time: string; title: string; speaker?: string; description?: string }[];
  tags: string[];
};

export type MyRegistration = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventSlug: string;
  eventStartDate: string;
  eventFormat: string;
  ticketTypeName: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  status: string;
  registrationCode: string;
  checkedInAt?: string;
};

export const getUpcomingEvents = cache(async (limit = 12): Promise<EventSummary[]> => {
  await connectDB();
  const now = new Date();
  const events = await Event.find({
    status: "published",
    isPublic: true,
    startDate: { $gte: now },
  })
    .sort({ isFeatured: -1, startDate: 1 })
    .limit(limit)
    .lean<IEvent[]>();
  return events.map(toSummary);
});

export const getPastEvents = cache(async (limit = 6): Promise<EventSummary[]> => {
  await connectDB();
  const now = new Date();
  const events = await Event.find({
    status: { $in: ["published", "completed"] },
    isPublic: true,
    startDate: { $lt: now },
  })
    .sort({ startDate: -1 })
    .limit(limit)
    .lean<IEvent[]>();
  return events.map(toSummary);
});

export const getEventBySlug = cache(async (slug: string): Promise<EventDetail | null> => {
  await connectDB();
  const event = await Event.findOne({ slug, isPublic: true }).lean<IEvent>();
  if (!event) return null;
  return toDetail(event);
});

export async function getMyRegistrations(): Promise<MyRegistration[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  await connectDB();

  const regs = await EventRegistration.find({ user: new Types.ObjectId(session.user.id) })
    .sort({ createdAt: -1 })
    .populate("event", "title slug startDate format")
    .lean<(IEventRegistration & { event: Pick<IEvent, "title" | "slug" | "startDate" | "format"> | null })[]>();

  return regs
    .filter((r) => r.event)
    .map((r) => ({
      id: (r._id as Types.ObjectId).toString(),
      eventId: (r.event as { _id?: Types.ObjectId })?._id?.toString() ?? "",
      eventTitle: r.event!.title,
      eventSlug: r.event!.slug,
      eventStartDate: r.event!.startDate.toISOString(),
      eventFormat: r.event!.format,
      ticketTypeName: r.ticketTypeName,
      quantity: r.quantity,
      totalAmount: r.totalAmount,
      currency: r.currency,
      status: r.status,
      registrationCode: r.registrationCode,
      checkedInAt: r.checkedInAt?.toISOString(),
    }));
}

export async function getRegistrationById(id: string): Promise<MyRegistration | null> {
  await connectDB();
  const reg = await EventRegistration.findById(id)
    .populate("event", "title slug startDate format")
    .lean<IEventRegistration & { event: Pick<IEvent, "title" | "slug" | "startDate" | "format"> | null }>();
  if (!reg || !reg.event) return null;
  return {
    id: (reg._id as Types.ObjectId).toString(),
    eventId: (reg.event as { _id?: Types.ObjectId })?._id?.toString() ?? "",
    eventTitle: reg.event.title,
    eventSlug: reg.event.slug,
    eventStartDate: reg.event.startDate.toISOString(),
    eventFormat: reg.event.format,
    ticketTypeName: reg.ticketTypeName,
    quantity: reg.quantity,
    totalAmount: reg.totalAmount,
    currency: reg.currency,
    status: reg.status,
    registrationCode: reg.registrationCode,
    checkedInAt: reg.checkedInAt?.toISOString(),
  };
}

function toSummary(e: IEvent): EventSummary {
  const activeTickets = e.ticketTypes.filter((t) => t.isActive);
  const prices = activeTickets.map((t) => t.price);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const isFree = lowestPrice === 0;
  const totalCapacity = e.capacity;
  const spotsLeft = totalCapacity != null ? Math.max(0, totalCapacity - e.attendeeCount) : undefined;

  return {
    id: (e._id as Types.ObjectId).toString(),
    title: e.title,
    slug: e.slug,
    summary: e.summary,
    type: e.type,
    status: e.status,
    format: e.format,
    coverImage: e.coverImage,
    startDate: e.startDate.toISOString(),
    endDate: e.endDate?.toISOString(),
    city: e.venue?.city,
    country: e.venue?.country,
    isFeatured: e.isFeatured,
    isFree,
    lowestPrice,
    currency: activeTickets[0]?.currency ?? "USD",
    capacity: e.capacity,
    attendeeCount: e.attendeeCount,
    registrationDeadline: e.registrationDeadline?.toISOString(),
    spotsLeft,
  };
}

function toDetail(e: IEvent): EventDetail {
  return {
    ...toSummary(e),
    description: e.description,
    timezone: e.timezone,
    venue: {
      name: e.venue?.name,
      address: e.venue?.address,
      city: e.venue?.city,
      country: e.venue?.country,
      virtualLink: e.venue?.virtualLink,
    },
    ticketTypes: e.ticketTypes.map((t) => ({
      id: (t as { _id?: Types.ObjectId })?._id?.toString() ?? "",
      name: t.name,
      description: t.description,
      price: t.price,
      currency: t.currency,
      capacity: t.capacity,
      sold: t.sold,
      isFree: t.isFree,
      isMembersOnly: t.isMembersOnly,
      isActive: t.isActive,
      spotsLeft: t.capacity != null ? Math.max(0, t.capacity - t.sold) : undefined,
    })),
    schedule: e.schedule.map((s) => ({ time: s.time, title: s.title, speaker: s.speaker, description: s.description })),
    tags: e.tags,
  };
}

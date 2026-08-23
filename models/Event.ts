import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type EventType =
  | "convention" | "seminar" | "cultural" | "meeting"
  | "webinar" | "social" | "fundraising" | "other";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type EventFormat = "in_person" | "virtual" | "hybrid";

export interface ITicketType {
  name: string;
  description?: string;
  price: number;
  currency: string;
  capacity?: number;
  sold: number;
  isFree: boolean;
  isMembersOnly: boolean;
  isActive: boolean;
}

export interface IScheduleItem {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

export interface IVenue {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  virtualLink?: string;
}

export interface IEvent extends Document {
  title: string;
  slug: string;
  summary: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  format: EventFormat;
  coverImage?: string;
  venue: IVenue;
  startDate: Date;
  endDate?: Date;
  timezone: string;
  registrationDeadline?: Date;
  capacity?: number;
  attendeeCount: number;
  ticketTypes: ITicketType[];
  schedule: IScheduleItem[];
  isPublic: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TicketTypeSchema = new Schema<ITicketType>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },
    capacity: { type: Number, min: 0 },
    sold: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    isMembersOnly: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const ScheduleSchema = new Schema<IScheduleItem>(
  {
    time: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    speaker: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const VenueSchema = new Schema<IVenue>(
  {
    name: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    virtualLink: { type: String, trim: true },
  },
  { _id: false }
);

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true, lowercase: true },
    summary: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String },
    type: {
      type: String,
      enum: ["convention","seminar","cultural","meeting","webinar","social","fundraising","other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft","published","cancelled","completed"],
      default: "draft",
    },
    format: { type: String, enum: ["in_person","virtual","hybrid"], default: "in_person" },
    coverImage: { type: String, trim: true },
    venue: { type: VenueSchema, default: () => ({}) },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    timezone: { type: String, default: "UTC" },
    registrationDeadline: { type: Date },
    capacity: { type: Number, min: 0 },
    attendeeCount: { type: Number, default: 0 },
    ticketTypes: { type: [TicketTypeSchema], default: [] },
    schedule: { type: [ScheduleSchema], default: [] },
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String, trim: true, lowercase: true }],
  },
  { timestamps: true }
);

EventSchema.pre("save", function () {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
});

EventSchema.index({ status: 1, startDate: 1 });
EventSchema.index({ slug: 1 });
EventSchema.index({ isFeatured: 1, status: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);

export default Event;

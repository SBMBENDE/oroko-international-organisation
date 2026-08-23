import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type RegistrationStatus = "confirmed" | "pending" | "cancelled" | "attended";

export interface IEventRegistration extends Document {
  event: Types.ObjectId;
  user?: Types.ObjectId;
  attendeeName: string;
  attendeeEmail: string;
  ticketTypeId: string;
  ticketTypeName: string;
  ticketPrice: number;
  currency: string;
  quantity: number;
  totalAmount: number;
  status: RegistrationStatus;
  registrationCode: string;
  stripePaymentIntentId?: string;
  checkedInAt?: Date;
  reminderSentAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    attendeeName: { type: String, required: true, trim: true },
    attendeeEmail: { type: String, required: true, lowercase: true, trim: true },
    ticketTypeId: { type: String, required: true },
    ticketTypeName: { type: String, required: true, trim: true },
    ticketPrice: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    quantity: { type: Number, default: 1, min: 1, max: 10 },
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["confirmed","pending","cancelled","attended"],
      default: "pending",
    },
    // Unique code for check-in — human readable
    registrationCode: { type: String, unique: true, trim: true },
    stripePaymentIntentId: { type: String, select: false },
    checkedInAt: { type: Date },
    reminderSentAt: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

EventRegistrationSchema.pre("save", function () {
  if (this.isNew && !this.registrationCode) {
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.registrationCode = `ORK-${rand}`;
  }
});

EventRegistrationSchema.index({ event: 1, attendeeEmail: 1 });
EventRegistrationSchema.index({ user: 1 });
EventRegistrationSchema.index({ registrationCode: 1 });
EventRegistrationSchema.index({ status: 1 });

const EventRegistration: Model<IEventRegistration> =
  mongoose.models.EventRegistration ??
  mongoose.model<IEventRegistration>("EventRegistration", EventRegistrationSchema);

export default EventRegistration;

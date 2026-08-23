import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type GovernanceOrgan = "general_assembly" | "executive" | "committee";
export type MeetingFormat = "in_person" | "virtual" | "hybrid";
export type MeetingStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface IGovernanceMeeting extends Document {
  organ: GovernanceOrgan;
  committee?: Types.ObjectId;
  title: string;
  sessionNumber?: string;
  date: Date;
  endDate?: Date;
  venue?: string;
  format: MeetingFormat;
  status: MeetingStatus;
  agendaItems: string[];
  minutes?: string;
  attendeeCount?: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GovernanceMeetingSchema = new Schema<IGovernanceMeeting>(
  {
    organ: {
      type: String,
      enum: ["general_assembly", "executive", "committee"],
      required: true,
    },
    committee: { type: Schema.Types.ObjectId, ref: "Committee" },
    title: { type: String, required: true, trim: true },
    sessionNumber: { type: String, trim: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    venue: { type: String, trim: true },
    format: {
      type: String,
      enum: ["in_person", "virtual", "hybrid"],
      default: "in_person",
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    agendaItems: [{ type: String, trim: true }],
    minutes: { type: String },
    attendeeCount: { type: Number },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GovernanceMeetingSchema.index({ organ: 1, date: -1 });
GovernanceMeetingSchema.index({ committee: 1, date: -1 });
GovernanceMeetingSchema.index({ status: 1 });

const GovernanceMeeting: Model<IGovernanceMeeting> =
  mongoose.models.GovernanceMeeting ??
  mongoose.model<IGovernanceMeeting>("GovernanceMeeting", GovernanceMeetingSchema);

export default GovernanceMeeting;

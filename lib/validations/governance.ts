import { z } from "zod";

export const meetingSchema = z.object({
  organ: z.enum(["general_assembly", "executive", "committee"]),
  committeeId: z.string().optional(),
  title: z.string().min(3, "Title is required").max(200),
  sessionNumber: z.string().max(50).optional(),
  date: z.string().min(1, "Date is required"),
  endDate: z.string().optional(),
  venue: z.string().max(200).optional(),
  format: z.enum(["in_person", "virtual", "hybrid"]),
  status: z.enum(["scheduled", "in_progress", "completed", "cancelled"]),
  agendaItems: z.array(z.string().max(300)).default([]),
  minutes: z.string().optional(),
  attendeeCount: z.number().int().min(0).optional(),
  isPublic: z.boolean().default(false),
});

export const documentSchema = z.object({
  organ: z.enum(["general_assembly", "executive", "committee"]),
  committeeId: z.string().optional(),
  meetingId: z.string().optional(),
  type: z.enum(["resolution", "decision", "minutes", "report", "agenda", "statute", "bylaw"]),
  title: z.string().min(3).max(300),
  reference: z.string().max(50).optional(),
  summary: z.string().max(500).optional(),
  content: z.string().optional(),
  attachmentUrl: z.string().url().optional().or(z.literal("")),
  adoptedAt: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export type MeetingInput = z.infer<typeof meetingSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;

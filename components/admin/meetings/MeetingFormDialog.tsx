"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { createMeeting, updateMeeting } from "@/actions/governance.actions";
import { Plus } from "lucide-react";

const ORGANS = [
  { value: "general_assembly", label: "General Assembly" },
  { value: "executive", label: "Executive" },
  { value: "committee", label: "Committee" },
];
const FORMATS = [
  { value: "in_person", label: "In Person" },
  { value: "virtual", label: "Virtual" },
  { value: "hybrid", label: "Hybrid" },
];
const STATUSES = ["scheduled", "in_progress", "completed", "cancelled"];

// toISOString() and datetime-local inputs disagree on trailing seconds/Z — trim to match
function toDateTimeLocal(iso?: string) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

export type MeetingFormInitial = {
  id: string;
  organ: string;
  committeeId?: string;
  title: string;
  sessionNumber?: string;
  date: string;
  endDate?: string;
  venue?: string;
  format: string;
  status: string;
  agendaItems: string[];
  minutes?: string;
  attendeeCount?: number;
  isPublic: boolean;
};

type Props = {
  committees?: { id: string; name: string }[];
  meeting?: MeetingFormInitial;
  trigger?: React.ReactElement;
};

export function MeetingFormDialog({ committees = [], meeting, trigger }: Props) {
  const router = useRouter();
  const isEdit = !!meeting;
  const [open, setOpen] = useState(false);
  const [organ, setOrgan] = useState(meeting?.organ ?? "general_assembly");
  const [committeeId, setCommitteeId] = useState(meeting?.committeeId ?? "");
  const [title, setTitle] = useState(meeting?.title ?? "");
  const [sessionNumber, setSessionNumber] = useState(meeting?.sessionNumber ?? "");
  const [date, setDate] = useState(toDateTimeLocal(meeting?.date));
  const [endDate, setEndDate] = useState(toDateTimeLocal(meeting?.endDate));
  const [venue, setVenue] = useState(meeting?.venue ?? "");
  const [format, setFormat] = useState(meeting?.format ?? "in_person");
  const [status, setStatus] = useState(meeting?.status ?? "scheduled");
  const [agendaItems, setAgendaItems] = useState(meeting?.agendaItems?.join("\n") ?? "");
  const [minutes, setMinutes] = useState(meeting?.minutes ?? "");
  const [attendeeCount, setAttendeeCount] = useState(meeting?.attendeeCount?.toString() ?? "");
  const [isPublic, setIsPublic] = useState(meeting?.isPublic ?? false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      organ, committeeId: organ === "committee" ? committeeId : undefined,
      title, sessionNumber: sessionNumber || undefined,
      date, endDate: endDate || undefined,
      venue: venue || undefined, format, status,
      agendaItems: agendaItems.split("\n").map((a) => a.trim()).filter(Boolean),
      minutes: minutes || undefined,
      attendeeCount: attendeeCount ? Number(attendeeCount) : undefined,
      isPublic,
    };
    const result = isEdit ? await updateMeeting(meeting.id, payload) : await createMeeting(payload);
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed"); return; }
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? <Button size="sm"><Plus className="size-4" /> New Session</Button>} />
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Session" : "New Session"}</DialogTitle>
          <DialogDescription>Record a meeting of the General Assembly, Executive, or a committee.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="m-title">Title</Label>
            <Input id="m-title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Inaugural General Meeting" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Organ</Label>
              <Select value={organ} onValueChange={(v) => setOrgan(v ?? "general_assembly")}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ORGANS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-session">Session Number (optional)</Label>
              <Input id="m-session" value={sessionNumber} onChange={(e) => setSessionNumber(e.target.value)} placeholder="e.g. 1st Ordinary Session" />
            </div>
          </div>
          {organ === "committee" && (
            <div className="space-y-1.5">
              <Label>Committee</Label>
              <Select value={committeeId} onValueChange={(v) => setCommitteeId(v ?? "")}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select committee" /></SelectTrigger>
                <SelectContent>
                  {committees.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="m-date">Date &amp; Time</Label>
              <Input id="m-date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-end-date">End Date &amp; Time (optional)</Label>
              <Input id="m-end-date" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v ?? "in_person")}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FORMATS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v ?? "scheduled")}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-venue">Venue (optional)</Label>
            <Input id="m-venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-agenda">Agenda Items (one per line)</Label>
            <Textarea id="m-agenda" value={agendaItems} onChange={(e) => setAgendaItems(e.target.value)} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-minutes">Minutes / Summary (optional)</Label>
            <Textarea id="m-minutes" value={minutes} onChange={(e) => setMinutes(e.target.value)} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="m-attendees">Attendee Count (optional)</Label>
            <Input id="m-attendees" type="number" min={0} value={attendeeCount} onChange={(e) => setAttendeeCount(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="size-4 accent-oroko-gold" />
            Publish to public site
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : isEdit ? "Save" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { createEvent, updateEvent } from "@/actions/admin/events.actions";

export interface EventFormValues {
  title: string;
  summary: string;
  description: string;
  type: string;
  format: string;
  startDate: string;
  endDate: string;
  venueName: string;
  venueCity: string;
  venueCountry: string;
  virtualLink: string;
  capacity: string;
  isPublic: boolean;
  isFeatured: boolean;
  isFree: boolean;
  price: string;
}

const DEFAULTS: EventFormValues = {
  title: "", summary: "", description: "", type: "meeting", format: "in_person",
  startDate: "", endDate: "", venueName: "", venueCity: "", venueCountry: "", virtualLink: "",
  capacity: "", isPublic: true, isFeatured: false, isFree: true, price: "",
};

export function EventForm({ eventId, defaultValues }: { eventId?: string; defaultValues?: Partial<EventFormValues> }) {
  const router = useRouter();
  const [values, setValues] = useState<EventFormValues>({ ...DEFAULTS, ...defaultValues });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set<K extends keyof EventFormValues>(key: K, v: EventFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload = {
      ...values,
      capacity: values.capacity ? Number(values.capacity) : undefined,
      price: values.price ? Number(values.price) : undefined,
    };
    const result = eventId ? await updateEvent(eventId, payload) : await createEvent(payload);
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed to save"); return; }
    const nextId = eventId ?? ("id" in result ? result.id : undefined);
    router.push(`/admin/events/${nextId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={values.title} onChange={(e) => set("title", e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" value={values.summary} onChange={(e) => set("summary", e.target.value)} rows={2} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Full Description</Label>
        <Textarea id="description" value={values.description} onChange={(e) => set("description", e.target.value)} rows={4} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={values.type} onValueChange={(v) => set("type", v ?? values.type)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["convention", "seminar", "cultural", "meeting", "webinar", "social", "fundraising", "other"].map((t) => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Format</Label>
          <Select value={values.format} onValueChange={(v) => set("format", v ?? values.format)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="in_person">In Person</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Start Date &amp; Time</Label>
          <Input id="startDate" type="datetime-local" value={values.startDate} onChange={(e) => set("startDate", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">End Date &amp; Time</Label>
          <Input id="endDate" type="datetime-local" value={values.endDate} onChange={(e) => set("endDate", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="venueName">Venue Name</Label>
          <Input id="venueName" value={values.venueName} onChange={(e) => set("venueName", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="venueCity">City</Label>
          <Input id="venueCity" value={values.venueCity} onChange={(e) => set("venueCity", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="venueCountry">Country</Label>
          <Input id="venueCountry" value={values.venueCountry} onChange={(e) => set("venueCountry", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="virtualLink">Virtual Link</Label>
          <Input id="virtualLink" value={values.virtualLink} onChange={(e) => set("virtualLink", e.target.value)} />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" type="number" min={0} value={values.capacity} onChange={(e) => set("capacity", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Ticket Price (USD)</Label>
          <Input id="price" type="number" min={0} step="0.01" value={values.price} onChange={(e) => set("price", e.target.value)} disabled={values.isFree} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input id="isFree" type="checkbox" checked={values.isFree} onChange={(e) => set("isFree", e.target.checked)} className="size-4 accent-oroko-gold" />
          <Label htmlFor="isFree">Free event</Label>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={values.isPublic} onChange={(e) => set("isPublic", e.target.checked)} className="size-4 accent-oroko-gold" />
          Publicly listed
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={values.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="size-4 accent-oroko-gold" />
          Featured
        </label>
      </div>

      <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : eventId ? "Save Changes" : "Create Event"}</Button>
    </form>
  );
}

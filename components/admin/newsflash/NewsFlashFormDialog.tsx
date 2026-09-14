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
import { createNewsFlash, updateNewsFlash } from "@/actions/admin/newsflash.actions";
import { Plus } from "lucide-react";

const DURATIONS = [
  { value: "0", label: "No expiry" },
  { value: "1", label: "1 day" },
  { value: "3", label: "3 days" },
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
];

export type NewsFlashFormInitial = {
  id: string;
  title: string;
  message: string;
  image?: string;
  expiresAt?: string;
};

// Rounds remaining time to the nearest duration option so the edit form has a sensible default
function durationFromExpiry(expiresAt?: string): string {
  if (!expiresAt) return "0";
  const daysLeft = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  const option = DURATIONS.map((d) => Number(d.value)).filter((v) => v > 0).find((v) => daysLeft <= v);
  return String(option ?? 30);
}

type Props = { flash?: NewsFlashFormInitial; trigger?: React.ReactElement };

export function NewsFlashFormDialog({ flash, trigger }: Props) {
  const router = useRouter();
  const isEdit = !!flash;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(flash?.title ?? "");
  const [message, setMessage] = useState(flash?.message ?? "");
  const [image, setImage] = useState(flash?.image ?? "");
  const [duration, setDuration] = useState(flash ? durationFromExpiry(flash.expiresAt) : "7");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const durationDays = Number(duration) || undefined;
    const result = isEdit
      ? await updateNewsFlash(flash.id, { title, message, image, durationDays })
      : await createNewsFlash({ title, message, image, durationDays });
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed"); return; }
    if (!isEdit) { setTitle(""); setMessage(""); setImage(""); }
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? <Button size="sm"><Plus className="size-4" /> Post News Flash</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit News Flash" : "Post News Flash"}</DialogTitle>
          <DialogDescription>Short, important organizational updates.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="nf-title">Title</Label>
            <Input id="nf-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nf-message">Message</Label>
            <Textarea id="nf-message" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nf-image">Image URL (optional)</Label>
            <Input id="nf-image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://…" />
          </div>
          <div className="space-y-1.5">
            <Label>Show for</Label>
            <Select value={duration} onValueChange={(v) => setDuration(v ?? "7")}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DURATIONS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">After this it stops showing on the homepage automatically, even if still marked Published.</p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Save as Draft"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


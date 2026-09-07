"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { createNewsFlash } from "@/actions/admin/newsflash.actions";
import { Plus } from "lucide-react";

export function NewsFlashFormDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await createNewsFlash({ title, message, image });
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed"); return; }
    setTitle(""); setMessage(""); setImage("");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm"><Plus className="size-4" /> Post News Flash</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post News Flash</DialogTitle>
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
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Posting…" : "Save as Draft"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

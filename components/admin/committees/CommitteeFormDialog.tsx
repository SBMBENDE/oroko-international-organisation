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
import { createCommittee, updateCommittee } from "@/actions/admin/committees.actions";
import { Plus } from "lucide-react";

interface CommitteeFormDialogProps {
  mode: "create" | "edit";
  committeeId?: string;
  defaultValues?: { name: string; mandate: string; description: string };
  trigger?: React.ReactNode;
}

export function CommitteeFormDialog({ mode, committeeId, defaultValues, trigger }: CommitteeFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [mandate, setMandate] = useState(defaultValues?.mandate ?? "");
  const [description, setDescription] = useState(defaultValues?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const data = { name, mandate, description };
    const result = mode === "create" ? await createCommittee(data) : await updateCommittee(committeeId!, data);
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed to save"); return; }
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement ?? <Button size="sm"><Plus className="size-4" /> New Committee</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New Committee" : "Edit Committee"}</DialogTitle>
          <DialogDescription>Committees are organizational groups — not chapters.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Name</Label>
            <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-mandate">Mandate</Label>
            <Input id="c-mandate" value={mandate} onChange={(e) => setMandate(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-description">Description</Label>
            <Textarea id="c-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

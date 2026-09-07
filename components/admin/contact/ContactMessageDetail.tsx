"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { updateContactMessageStatus, addContactMessageNote } from "@/actions/admin/contact.actions";

interface ContactMessageDetailProps {
  message: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    status: string;
    createdAt: string;
    internalNotes: { authorName: string; text: string; createdAt: string }[];
  };
}

const STATUSES = ["new", "in_progress", "resolved", "archived"];

export function ContactMessageDetail({ message }: ContactMessageDetailProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(status: string) {
    startTransition(async () => {
      await updateContactMessageStatus(message.id, status as "new" | "in_progress" | "resolved" | "archived");
      router.refresh();
    });
  }

  function handleAddNote() {
    if (!note.trim()) return;
    startTransition(async () => {
      await addContactMessageNote(message.id, note.trim());
      setNote("");
      router.refresh();
    });
  }

  return (
    <>
      <Button size="xs" variant="outline" onClick={() => setOpen(true)}>View</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{message.subject || "Contact Message"}</DialogTitle>
            <DialogDescription>{message.name} · {message.email}{message.phone ? ` · ${message.phone}` : ""}</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-oroko-black whitespace-pre-wrap">{message.message}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <Select value={message.status} onValueChange={(v) => v && handleStatusChange(v)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s} value={s}><StatusBadge status={s} /></SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {message.internalNotes.length > 0 && (
            <ul className="space-y-2 max-h-32 overflow-y-auto">
              {[...message.internalNotes].reverse().map((n, i) => (
                <li key={i} className="rounded-lg bg-muted/50 p-2 text-xs">
                  <p className="text-oroko-black">{n.text}</p>
                  <p className="text-muted-foreground mt-0.5">{n.authorName} · {new Date(n.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}

          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add internal note…" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Close</Button>
            <Button type="button" onClick={handleAddNote} disabled={isPending}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

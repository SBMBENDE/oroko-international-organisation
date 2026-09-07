"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addInternalNote } from "@/actions/admin/members.actions";

interface Note {
  authorName: string;
  text: string;
  createdAt: string;
}

export function MemberNotesSection({ memberId, notes }: { memberId: string; notes: Note[] }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!text.trim()) {
      setError("Note cannot be empty");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await addInternalNote(memberId, text.trim());
      if (!result.success) {
        setError(result.error ?? "Failed to add note");
        return;
      }
      setText("");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Visible only to administrators — never shown to the member.
      </p>
      <div className="space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add an internal note…"
          rows={3}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="button" size="sm" onClick={handleAdd} disabled={isPending}>
          {isPending ? "Adding…" : "Add Note"}
        </Button>
      </div>

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No internal notes yet.</p>
      ) : (
        <ul className="space-y-3">
          {[...notes].reverse().map((note, i) => (
            <li key={i} className="rounded-lg bg-muted/50 p-3 text-sm">
              <p className="text-oroko-black whitespace-pre-wrap">{note.text}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {note.authorName} · {new Date(note.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

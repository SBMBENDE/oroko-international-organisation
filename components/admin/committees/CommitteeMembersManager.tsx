"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { addCommitteeMember, removeCommitteeMember } from "@/actions/admin/committees.actions";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function CommitteeMembersManager({ committeeId, members }: { committeeId: string; members: Member[] }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError("Email is required"); return; }
    setError(null);
    setIsSubmitting(true);
    const result = await addCommitteeMember(committeeId, email.trim(), role);
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed"); return; }
    setEmail("");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Member email" className="flex-1" />
        <Select value={role} onValueChange={(v) => setRole(v ?? "member")}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="chair">Chair</SelectItem>
            <SelectItem value="vice_chair">Vice Chair</SelectItem>
            <SelectItem value="secretary">Secretary</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding…" : "Add"}</Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">No members assigned yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="text-oroko-black">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.email} · <span className="capitalize">{m.role.replace("_", " ")}</span></p>
              </div>
              <ConfirmButton
                label="Remove"
                title="Remove committee member"
                description="This removes the member from the committee. They can be re-added later."
                variant="destructive"
                onConfirm={() => removeCommitteeMember(m.id, committeeId)}
                onDone={() => startTransition(() => router.refresh())}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

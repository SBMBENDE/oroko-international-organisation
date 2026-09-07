"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { updateWelfareStatus, addWelfareNote } from "@/actions/admin/welfare.actions";

export function WelfareReviewActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  function handleApprove() {
    startTransition(async () => {
      const result = await updateWelfareStatus(id, "approved", amount ? Number(amount) : undefined);
      if (!result.success) { setError(result.error ?? "Failed"); return; }
      refresh();
    });
  }

  function submitNote() {
    if (!note.trim()) return;
    startTransition(async () => {
      await addWelfareNote(id, note.trim());
      setNote("");
      refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        {status !== "under_review" && status !== "approved" && status !== "paid" && status !== "closed" && (
          <ConfirmButton
            label="Mark Under Review"
            title="Mark under review"
            description="Flags this request as being actively reviewed."
            onConfirm={() => updateWelfareStatus(id, "under_review")}
            onDone={refresh}
          />
        )}
        {(status === "submitted" || status === "under_review") && (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Amount Approved</Label>
              <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-36" />
            </div>
            <Button type="button" size="sm" onClick={handleApprove} disabled={isPending}>Approve</Button>
            <ConfirmButton
              label="Reject"
              title="Reject welfare request"
              description="This marks the request as rejected."
              variant="destructive"
              onConfirm={() => updateWelfareStatus(id, "rejected")}
              onDone={refresh}
            />
          </>
        )}
        {status === "approved" && (
          <ConfirmButton
            label="Mark Paid"
            title="Mark as paid"
            description="Confirms disbursement of the approved amount."
            onConfirm={() => updateWelfareStatus(id, "paid")}
            onDone={refresh}
          />
        )}
        {status === "paid" && (
          <ConfirmButton
            label="Close Request"
            title="Close request"
            description="Archives this welfare request."
            onConfirm={() => updateWelfareStatus(id, "closed")}
            onDone={refresh}
          />
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="space-y-2 border-t border-border pt-4">
        <p className="text-sm font-medium text-oroko-black">Internal Notes</p>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add a note…" />
        <Button type="button" size="sm" variant="outline" onClick={submitNote} disabled={isPending}>Add Note</Button>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import {
  setApplicationUnderReview,
  requestMoreInformation,
  approveApplication,
  rejectApplication,
  addApplicationNote,
} from "@/actions/admin/applications.actions";

interface ApplicationActionsProps {
  membershipId: string;
  applicationStatus: string;
}

export function ApplicationActions({ membershipId, applicationStatus }: ApplicationActionsProps) {
  const router = useRouter();
  const [infoOpen, setInfoOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  function submitInfoRequest() {
    if (!message.trim()) { setError("Message is required"); return; }
    setError(null);
    startTransition(async () => {
      const result = await requestMoreInformation(membershipId, message.trim());
      if (!result.success) { setError(result.error ?? "Failed"); return; }
      setInfoOpen(false);
      setMessage("");
      refresh();
    });
  }

  function submitReject() {
    if (!reason.trim()) { setError("Reason is required"); return; }
    setError(null);
    startTransition(async () => {
      const result = await rejectApplication(membershipId, reason.trim());
      if (!result.success) { setError(result.error ?? "Failed"); return; }
      setRejectOpen(false);
      setReason("");
      refresh();
    });
  }

  function submitNote() {
    if (!note.trim()) return;
    startTransition(async () => {
      await addApplicationNote(membershipId, note.trim());
      setNote("");
      refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {applicationStatus === "pending" && (
          <ConfirmButton
            label="Mark Under Review"
            title="Mark under review"
            description="This flags the application as being actively reviewed."
            onConfirm={() => setApplicationUnderReview(membershipId)}
            onDone={refresh}
          />
        )}
        {applicationStatus !== "approved" && applicationStatus !== "rejected" && (
          <>
            <Button type="button" variant="outline" size="sm" onClick={() => setInfoOpen(true)}>
              Request More Information
            </Button>
            <ConfirmButton
              label="Approve"
              title="Approve application"
              description="This activates the member's account, sets status to Active, and their Member ID becomes usable immediately."
              confirmLabel="Approve"
              variant="default"
              onConfirm={() => approveApplication(membershipId)}
              onDone={refresh}
            />
            <Button type="button" variant="destructive" size="sm" onClick={() => setRejectOpen(true)}>
              Reject
            </Button>
          </>
        )}
      </div>

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Additional Information</DialogTitle>
            <DialogDescription>This message is recorded for the applicant.</DialogDescription>
          </DialogHeader>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="What information is missing?" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setInfoOpen(false)} disabled={isPending}>Cancel</Button>
            <Button type="button" onClick={submitInfoRequest} disabled={isPending}>{isPending ? "Sending…" : "Send Request"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Provide a reason. The applicant&apos;s account will be deactivated.</DialogDescription>
          </DialogHeader>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="Reason for rejection" />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRejectOpen(false)} disabled={isPending}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={submitReject} disabled={isPending}>{isPending ? "Rejecting…" : "Reject Application"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-2 border-t border-border pt-4">
        <p className="text-sm font-medium text-oroko-black">Internal Notes</p>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add a note…" />
        <Button type="button" size="sm" variant="outline" onClick={submitNote} disabled={isPending}>Add Note</Button>
      </div>
    </div>
  );
}

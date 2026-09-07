"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { changeMemberStatus, renewMembership } from "@/actions/admin/members.actions";

interface MemberActionsPanelProps {
  memberId: string;
  status: string;
}

export function MemberActionsPanel({ memberId, status }: MemberActionsPanelProps) {
  const router = useRouter();
  const [renewOpen, setRenewOpen] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [renewError, setRenewError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  function handleRenew() {
    if (!expiresAt) {
      setRenewError("Choose a new renewal date");
      return;
    }
    setRenewError(null);
    startTransition(async () => {
      const result = await renewMembership(memberId, expiresAt);
      if (!result.success) {
        setRenewError(result.error ?? "Failed to renew");
        return;
      }
      setRenewOpen(false);
      refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "active" && (
        <ConfirmButton
          label="Reactivate"
          title="Reactivate member"
          description="This member will regain active status and portal access."
          onConfirm={() => changeMemberStatus(memberId, "active", "Reactivated by admin")}
          onDone={refresh}
        />
      )}
      {status !== "suspended" && (
        <ConfirmButton
          label="Suspend"
          title="Suspend member"
          description="The member will lose active status until reactivated."
          variant="destructive"
          onConfirm={() => changeMemberStatus(memberId, "suspended", "Suspended by admin")}
          onDone={refresh}
        />
      )}
      {status !== "resigned" && (
        <ConfirmButton
          label="Mark Resigned"
          title="Mark member as resigned"
          description="This records that the member has voluntarily resigned."
          onConfirm={() => changeMemberStatus(memberId, "resigned", "Marked as resigned by admin")}
          onDone={refresh}
        />
      )}
      <Button type="button" size="sm" variant="outline" onClick={() => setRenewOpen(true)}>
        Renew Membership
      </Button>

      <Dialog open={renewOpen} onOpenChange={setRenewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Membership</DialogTitle>
            <DialogDescription>Sets status to active and updates the renewal date.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="expiresAt">New renewal date</Label>
            <Input id="expiresAt" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
          {renewError && <p className="text-sm text-destructive">{renewError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRenewOpen(false)} disabled={isPending}>Cancel</Button>
            <Button type="button" onClick={handleRenew} disabled={isPending}>{isPending ? "Saving…" : "Renew"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

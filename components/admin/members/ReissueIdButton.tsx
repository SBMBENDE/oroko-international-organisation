"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { reissueMemberId } from "@/actions/admin/members.actions";

export function ReissueIdButton({ memberId }: { memberId: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <ConfirmButton
      label="Reissue ID"
      title="Reissue Member ID"
      description="This generates a new unique OROKO Member ID for this individual. The previous ID will no longer be valid."
      confirmLabel="Reissue"
      onConfirm={() => reissueMemberId(memberId)}
      onDone={() => startTransition(() => router.refresh())}
    />
  );
}

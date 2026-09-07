"use client";

import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { revokeAdminAccess } from "@/actions/admin/administrators.actions";

export function RevokeAccessButton({ userId }: { userId: string }) {
  const router = useRouter();
  return (
    <ConfirmButton
      label="Revoke"
      title="Revoke administrator access"
      description="This user will be downgraded to a regular member and lose access to the admin dashboard."
      variant="destructive"
      confirmLabel="Revoke Access"
      onConfirm={() => revokeAdminAccess(userId)}
      onDone={() => router.refresh()}
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { toggleCommitteeActive } from "@/actions/admin/committees.actions";

export function ToggleCommitteeButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  return (
    <ConfirmButton
      label={isActive ? "Deactivate" : "Activate"}
      title={isActive ? "Deactivate committee" : "Activate committee"}
      description={isActive ? "Members will remain assigned but the committee will be marked inactive." : "This committee will become active again."}
      variant={isActive ? "destructive" : "outline"}
      onConfirm={() => toggleCommitteeActive(id, !isActive)}
      onDone={() => router.refresh()}
    />
  );
}

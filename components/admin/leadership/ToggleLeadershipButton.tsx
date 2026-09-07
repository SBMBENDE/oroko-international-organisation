"use client";

import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { toggleLeadershipPosition } from "@/actions/admin/leadership.actions";

export function ToggleLeadershipButton({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  return (
    <ConfirmButton
      label={isActive ? "Deactivate" : "Reactivate"}
      title={isActive ? "Deactivate position" : "Reactivate position"}
      description={isActive ? "This ends the member's term today." : "This resumes the member's term."}
      variant={isActive ? "destructive" : "outline"}
      onConfirm={() => toggleLeadershipPosition(id, !isActive)}
      onDone={() => router.refresh()}
    />
  );
}

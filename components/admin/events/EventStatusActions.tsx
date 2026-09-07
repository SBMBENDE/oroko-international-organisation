"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { updateEventStatus } from "@/actions/admin/events.actions";

export function EventStatusActions({ eventId, status }: { eventId: string; status: string }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="flex flex-wrap gap-2">
      {status === "draft" && (
        <Button size="sm" onClick={async () => { await updateEventStatus(eventId, "published"); refresh(); }}>
          Publish
        </Button>
      )}
      {status === "published" && (
        <Button size="sm" variant="outline" onClick={async () => { await updateEventStatus(eventId, "draft"); refresh(); }}>
          Unpublish
        </Button>
      )}
      {(status === "draft" || status === "published") && (
        <ConfirmButton
          label="Cancel Event"
          title="Cancel this event"
          description="Registrants will no longer be able to register."
          variant="destructive"
          onConfirm={() => updateEventStatus(eventId, "cancelled")}
          onDone={refresh}
        />
      )}
      {status === "published" && (
        <Button size="sm" variant="outline" onClick={async () => { await updateEventStatus(eventId, "completed"); refresh(); }}>
          Mark Completed
        </Button>
      )}
    </div>
  );
}

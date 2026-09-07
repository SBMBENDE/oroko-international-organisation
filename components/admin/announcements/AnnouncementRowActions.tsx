"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { setAnnouncementStatus, deleteAnnouncement } from "@/actions/admin/announcements.actions";

export function AnnouncementRowActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="flex justify-end gap-2">
      {status === "draft" ? (
        <Button size="xs" onClick={async () => { await setAnnouncementStatus(id, "published"); refresh(); }}>Publish</Button>
      ) : (
        <Button size="xs" variant="outline" onClick={async () => { await setAnnouncementStatus(id, "draft"); refresh(); }}>Unpublish</Button>
      )}
      <ConfirmButton
        label="Delete"
        title="Delete announcement"
        description="This cannot be undone."
        variant="destructive"
        size="xs"
        onConfirm={() => deleteAnnouncement(id)}
        onDone={refresh}
      />
    </div>
  );
}

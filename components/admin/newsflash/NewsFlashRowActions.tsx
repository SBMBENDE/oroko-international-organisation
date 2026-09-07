"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { setNewsFlashStatus, deleteNewsFlash } from "@/actions/admin/newsflash.actions";

export function NewsFlashRowActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="flex justify-end gap-2">
      {status === "draft" ? (
        <Button size="xs" onClick={async () => { await setNewsFlashStatus(id, "published"); refresh(); }}>Publish</Button>
      ) : (
        <Button size="xs" variant="outline" onClick={async () => { await setNewsFlashStatus(id, "draft"); refresh(); }}>Unpublish</Button>
      )}
      <ConfirmButton
        label="Delete"
        title="Delete news flash"
        description="This cannot be undone."
        variant="destructive"
        size="xs"
        onConfirm={() => deleteNewsFlash(id)}
        onDone={refresh}
      />
    </div>
  );
}

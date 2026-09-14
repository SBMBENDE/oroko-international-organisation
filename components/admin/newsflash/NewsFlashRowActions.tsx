"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { setNewsFlashStatus, deleteNewsFlash } from "@/actions/admin/newsflash.actions";
import { NewsFlashFormDialog, type NewsFlashFormInitial } from "@/components/admin/newsflash/NewsFlashFormDialog";

export function NewsFlashRowActions({ flash }: { flash: NewsFlashFormInitial & { status: string } }) {
  const router = useRouter();
  const refresh = () => router.refresh();
  const { id, status } = flash;

  return (
    <div className="flex justify-end gap-2">
      <NewsFlashFormDialog flash={flash} trigger={<Button size="xs" variant="outline">Edit</Button>} />
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

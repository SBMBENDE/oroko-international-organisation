"use client";

import { useRouter } from "next/navigation";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { togglePublishAlbum } from "@/actions/admin/gallery.actions";

export function ToggleAlbumButton({ id, isPublished }: { id: string; isPublished: boolean }) {
  const router = useRouter();
  return (
    <ConfirmButton
      label={isPublished ? "Unpublish" : "Publish"}
      title={isPublished ? "Unpublish album" : "Publish album"}
      description={isPublished ? "This album will no longer appear on the public gallery." : "This album will appear on the public gallery."}
      variant={isPublished ? "destructive" : "default"}
      onConfirm={() => togglePublishAlbum(id, !isPublished)}
      onDone={() => router.refresh()}
    />
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toggleDocumentPublished, deleteDocument, replaceDocumentVersion } from "@/actions/admin/documents.actions";
import { UploadCloud } from "lucide-react";

// Called by CldUploadWidget — extract URL from whichever result shape arrives
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractUploadUrl(result: any): string | undefined {
  const info = result?.info ?? result;
  return typeof info === "object" ? info?.secure_url : undefined;
}

export function DocumentRowActions({ id, isPublic }: { id: string; isPublic: boolean }) {
  const router = useRouter();
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const refresh = () => router.refresh();

  async function handleReplace() {
    if (!url.trim()) { setError("File URL is required"); return; }
    setIsSubmitting(true);
    const result = await replaceDocumentVersion(id, url.trim());
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed"); return; }
    setUrl(""); setReplaceOpen(false);
    refresh();
  }

  return (
    <div className="flex justify-end gap-2">
      <Button size="xs" variant="outline" onClick={() => setReplaceOpen(true)}>Replace Version</Button>
      {isPublic ? (
        <Button size="xs" variant="outline" onClick={async () => { await toggleDocumentPublished(id, false); refresh(); }}>Unpublish</Button>
      ) : (
        <Button size="xs" onClick={async () => { await toggleDocumentPublished(id, true); refresh(); }}>Publish</Button>
      )}
      <ConfirmButton label="Delete" title="Delete document" description="This cannot be undone." variant="destructive" size="xs" onConfirm={() => deleteDocument(id)} onDone={refresh} />

      <Dialog open={replaceOpen} onOpenChange={setReplaceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Document Version</DialogTitle>
            <DialogDescription>The previous file remains accessible in version history.</DialogDescription>
          </DialogHeader>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="New file URL" />
          {cloudName && (
            <CldUploadWidget
              uploadPreset="oroko_documents"
              options={{ maxFiles: 1, resourceType: "auto" }}
              onSuccess={(result) => {
                const newUrl = extractUploadUrl(result);
                if (newUrl) setUrl(newUrl);
              }}
            >
              {({ open }) => (
                <Button type="button" variant="outline" size="sm" onClick={() => open()}>
                  <UploadCloud className="size-4" /> Upload new file
                </Button>
              )}
            </CldUploadWidget>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setReplaceOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="button" onClick={handleReplace} disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Replace"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

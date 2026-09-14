"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { toggleDocumentPublished, deleteDocument, replaceDocumentVersion, updateDocumentOrgan } from "@/actions/admin/documents.actions";
import { UploadCloud } from "lucide-react";

// Called by CldUploadWidget — extract URL from whichever result shape arrives
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractUploadUrl(result: any): string | undefined {
  const info = result?.info ?? result;
  return typeof info === "object" ? info?.secure_url : undefined;
}

const ORGANS = [
  { value: "general_assembly", label: "General Assembly" },
  { value: "executive", label: "Executive" },
  { value: "committee", label: "Committee" },
];

type Props = {
  id: string;
  isPublic: boolean;
  organ: string;
  committeeId?: string;
  committees?: { id: string; name: string }[];
};

export function DocumentRowActions({ id, isPublic, organ, committeeId, committees = [] }: Props) {
  const router = useRouter();
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [newOrgan, setNewOrgan] = useState(organ);
  const [newCommitteeId, setNewCommitteeId] = useState(committeeId ?? "");
  const [moveError, setMoveError] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);
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

  async function handleMove() {
    setIsMoving(true);
    const result = await updateDocumentOrgan(id, newOrgan, newCommitteeId);
    setIsMoving(false);
    if (!result.success) { setMoveError(result.error ?? "Failed"); return; }
    setMoveOpen(false);
    refresh();
  }

  return (
    <div className="flex justify-end gap-2">
      <Button size="xs" variant="outline" onClick={() => setMoveOpen(true)}>Move</Button>
      <Button size="xs" variant="outline" onClick={() => setReplaceOpen(true)}>Replace Version</Button>
      {isPublic ? (
        <Button size="xs" variant="outline" onClick={async () => { await toggleDocumentPublished(id, false); refresh(); }}>Unpublish</Button>
      ) : (
        <Button size="xs" onClick={async () => { await toggleDocumentPublished(id, true); refresh(); }}>Publish</Button>
      )}
      <ConfirmButton label="Delete" title="Delete document" description="This cannot be undone." variant="destructive" size="xs" onConfirm={() => deleteDocument(id)} onDone={refresh} />

      <Dialog open={moveOpen} onOpenChange={setMoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Document</DialogTitle>
            <DialogDescription>Choose which organ this document is published under.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Publish under</Label>
              <Select value={newOrgan} onValueChange={(v) => setNewOrgan(v ?? "general_assembly")}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ORGANS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {newOrgan === "committee" && (
              <div className="space-y-1.5">
                <Label>Committee</Label>
                <Select value={newCommitteeId} onValueChange={(v) => setNewCommitteeId(v ?? "")}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select committee" /></SelectTrigger>
                  <SelectContent>
                    {committees.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          {moveError && <p className="text-sm text-destructive">{moveError}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setMoveOpen(false)} disabled={isMoving}>Cancel</Button>
            <Button type="button" onClick={handleMove} disabled={isMoving}>{isMoving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

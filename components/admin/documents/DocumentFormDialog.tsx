"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { uploadDocument } from "@/actions/admin/documents.actions";
import { Plus, UploadCloud } from "lucide-react";

// Called by CldUploadWidget — extract URL from whichever result shape arrives
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractUploadUrl(result: any): string | undefined {
  const info = result?.info ?? result;
  return typeof info === "object" ? info?.secure_url : undefined;
}

const TYPES = ["constitution", "bylaw", "policy", "report", "minutes", "form", "financial", "committee_document", "resolution", "decision", "agenda", "statute", "other"];
const ORGANS = [
  { value: "general_assembly", label: "General Assembly" },
  { value: "executive", label: "Executive" },
  { value: "committee", label: "Committee" },
];

type Props = { committees?: { id: string; name: string }[] };

export function DocumentFormDialog({ committees = [] }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("report");
  const [summary, setSummary] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [organ, setOrgan] = useState("general_assembly");
  const [committeeId, setCommitteeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const result = await uploadDocument({ title, type, summary, attachmentUrl, isPublic, organ, committeeId });
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed"); return; }
    setTitle(""); setSummary(""); setAttachmentUrl(""); setCommitteeId("");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm"><Plus className="size-4" /> Upload Document</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>Provide a hosted file URL (e.g. Cloudinary, Google Drive link).</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="d-title">Title</Label>
            <Input id="d-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={type} onValueChange={(v) => setType(v ?? "report")}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Publish under</Label>
            <Select value={organ} onValueChange={(v) => setOrgan(v ?? "general_assembly")}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ORGANS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {organ === "committee" && (
            <div className="space-y-1.5">
              <Label>Committee</Label>
              <Select value={committeeId} onValueChange={(v) => setCommitteeId(v ?? "")}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select committee" /></SelectTrigger>
                <SelectContent>
                  {committees.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="d-summary">Summary (optional)</Label>
            <Textarea id="d-summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-url">File URL</Label>
            <div className="flex gap-2">
              <Input id="d-url" value={attachmentUrl} onChange={(e) => setAttachmentUrl(e.target.value)} placeholder="https://…" required className="flex-1" />
              {cloudName && (
                <CldUploadWidget
                  uploadPreset="oroko_documents"
                  options={{ maxFiles: 1, resourceType: "auto" }}
                  onSuccess={(result) => {
                    const url = extractUploadUrl(result);
                    if (url) setAttachmentUrl(url);
                  }}
                >
                  {({ open }) => (
                    <Button type="button" variant="outline" size="icon" onClick={() => open()} aria-label="Upload file to Cloudinary">
                      <UploadCloud className="size-4" />
                    </Button>
                  )}
                </CldUploadWidget>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Upload a PDF/file or paste an already-hosted link.</p>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="size-4 accent-oroko-gold" />
            Publish to public site
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Uploading…" : "Upload"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

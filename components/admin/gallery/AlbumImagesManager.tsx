"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { addImageToAlbum, removeImageFromAlbum } from "@/actions/admin/gallery.actions";

interface AlbumImage {
  id: string;
  url: string;
  caption?: string;
}

export function AlbumImagesManager({ albumId, images }: { albumId: string; images: AlbumImage[] }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) { setError("Image URL is required"); return; }
    setError(null);
    setIsSubmitting(true);
    const result = await addImageToAlbum(albumId, url.trim(), caption.trim() || undefined);
    setIsSubmitting(false);
    if (!result.success) { setError(result.error ?? "Failed"); return; }
    setUrl(""); setCaption("");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image URL" className="flex-1" />
        <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption (optional)" className="flex-1" />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Adding…" : "Add Image"}</Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {images.length === 0 ? (
        <p className="text-sm text-muted-foreground">No images in this album yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden ring-1 ring-foreground/10 aspect-square">
              <Image src={img.url} alt={img.caption ?? ""} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ConfirmButton
                  label="Remove"
                  title="Remove image"
                  description="This removes the image from the album."
                  variant="destructive"
                  size="xs"
                  onConfirm={() => removeImageFromAlbum(albumId, img.id)}
                  onDone={() => router.refresh()}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { Camera, Loader2, CheckCircle, X } from "lucide-react";
import Image from "next/image";
import { updateProfilePhoto } from "@/actions/profile.actions";

type Props = {
  currentPhoto?: string;
  userName: string;
  initials: string;
};

export function PhotoUpload({ currentPhoto, userName, initials }: Props) {
  const [savedPhoto, setSavedPhoto] = useState(currentPhoto);
  // pendingUrl is set after a Cloudinary upload, before the user confirms save
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const displayPhoto = pendingUrl ?? savedPhoto;

  // Called by CldUploadWidget — extract URL from whichever result shape arrives
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = (result: any) => {
    const info = result?.info ?? result;
    const url: string | undefined =
      typeof info === "object" ? info?.secure_url : undefined;
    if (url) setPendingUrl(url);
  };

  const savePhoto = async () => {
    if (!pendingUrl) return;
    setSaving(true);
    setSaveError(null);
    const res = await updateProfilePhoto(pendingUrl);
    setSaving(false);
    if (res.success) {
      setSavedPhoto(pendingUrl);
      setPendingUrl(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setSaveError(res.error ?? "Failed to save photo");
    }
  };

  const discardPending = () => setPendingUrl(null);

  if (!cloudName) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="size-24 rounded-full bg-oroko-green flex items-center justify-center">
          <span className="font-heading text-3xl font-bold text-white">{initials}</span>
        </div>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Set{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">
            NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
          </code>{" "}
          to enable photo upload.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Photo preview */}
      <div className="relative">
        <div className="size-28 rounded-full overflow-hidden border-4 border-border bg-oroko-green">
          {displayPhoto ? (
            displayPhoto.includes("cloudinary") ? (
              <CldImage
                src={displayPhoto}
                alt={userName}
                width={112}
                height={112}
                crop="fill"
                gravity="face"
                className="object-cover w-full h-full"
              />
            ) : (
              <Image
                src={displayPhoto}
                alt={userName}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            )
          ) : (
            <div className="size-full flex items-center justify-center">
              <span className="font-heading text-3xl font-bold text-white">
                {initials}
              </span>
            </div>
          )}
        </div>

        {pendingUrl && (
          <div className="absolute -top-1 -right-1 size-5 rounded-full bg-oroko-gold flex items-center justify-center">
            <span className="text-oroko-black text-[9px] font-bold">!</span>
          </div>
        )}
      </div>

      {/* Pending state — new photo uploaded but not yet saved */}
      {pendingUrl ? (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <p className="text-xs text-muted-foreground text-center">
            New photo ready — save to keep it.
          </p>
          {saveError && (
            <p className="text-xs text-destructive text-center">{saveError}</p>
          )}
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={savePhoto}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-oroko-gold text-oroko-black text-xs tracking-[0.15em] uppercase font-bold hover:bg-oroko-gold-light disabled:opacity-50 transition-colors rounded-sm"
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : null}
              {saving ? "Saving…" : "Save Photo"}
            </button>
            <button
              type="button"
              onClick={discardPending}
              disabled={saving}
              className="px-3 py-2.5 border border-border text-muted-foreground hover:text-oroko-black hover:border-oroko-black/30 transition-colors rounded-sm"
              aria-label="Discard new photo"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle className="size-4" /> Photo saved
            </span>
          )}

          <CldUploadWidget
            uploadPreset="oroko_profiles"
            options={{ maxFiles: 1, resourceType: "image", cropping: true }}
            onSuccess={handleUploadSuccess}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                className="flex items-center gap-2 px-4 py-2 border border-border text-xs tracking-wider uppercase text-muted-foreground hover:text-oroko-black hover:border-oroko-black/30 transition-colors rounded-sm"
              >
                <Camera className="size-3.5" />
                {savedPhoto ? "Change Photo" : "Upload Photo"}
              </button>
            )}
          </CldUploadWidget>

          <p className="text-xs text-muted-foreground">JPG or PNG · Max 5 MB</p>
        </>
      )}
    </div>
  );
}

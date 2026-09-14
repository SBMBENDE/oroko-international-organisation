"use client";

import { useEffect, useMemo, useState } from "react";
import { Zap, X } from "lucide-react";

export type ActiveNewsFlash = { id: string; title: string; message: string };

const DISMISSED_KEY = "newsflash-ticker-dismissed";

// Pushes content below the fixed Navbar since this sits outside <main>'s flow
export function NewsFlashBannerClient({ flashes }: { flashes: ActiveNewsFlash[] }) {
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    // sessionStorage isn't available during SSR, so this can only be checked after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (sessionStorage.getItem(DISMISSED_KEY)) setDismissed(true);
  }, []);

  // One continuous ticker so every flash is fully readable, no truncation
  const plainLength = useMemo(
    () => flashes.reduce((sum, f) => sum + f.title.length + f.message.length, 0),
    [flashes]
  );
  // Longer content scrolls a bit slower so reading speed stays roughly constant
  const durationSeconds = Math.max(18, Math.round(plainLength * 0.2));

  function renderTrack(copy: "a" | "b") {
    return flashes.map((f) => (
      <span key={`${copy}-${f.id}`} className="text-xs sm:text-sm pr-2">
        <span className="font-semibold">{f.title}</span> — {f.message}
        <span className="px-3 opacity-50">•</span>
      </span>
    ));
  }

  if (dismissed || flashes.length === 0) return null;

  function dismiss() {
    sessionStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  return (
    <div
      className="fixed top-16 inset-x-0 z-40 h-10 flex items-center bg-oroko-gold text-oroko-black overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={() => setPaused((p) => !p)}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-3">
        <span className="relative flex size-4 shrink-0 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-oroko-black/40" />
          <Zap className="relative size-4 animate-pulse" strokeWidth={2.5} />
        </span>
        <span className="shrink-0 text-xs sm:text-sm font-bold uppercase tracking-wide">Flash</span>

        <div className="relative flex-1 min-w-0 overflow-hidden">
          <div
            className="flex w-max whitespace-nowrap animate-marquee"
            style={{ "--marquee-duration": `${durationSeconds}s`, animationPlayState: paused ? "paused" : "running" } as React.CSSProperties}
          >
            {renderTrack("a")}
            <span aria-hidden className="flex">{renderTrack("b")}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); dismiss(); }}
          aria-label="Dismiss"
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}



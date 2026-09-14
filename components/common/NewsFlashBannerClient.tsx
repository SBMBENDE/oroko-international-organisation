"use client";

import { useEffect, useMemo, useState } from "react";
import { Zap, X, ChevronLeft, ChevronRight } from "lucide-react";

export type ActiveNewsFlash = { id: string; title: string; message: string };

const ROTATE_MS = 6000;
const DISMISSED_KEY = "newsflash-dismissed";

function readDismissed(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) ?? "[]");
  } catch {
    return [];
  }
}

// Pushes content below the fixed Navbar since this sits outside <main>'s flow
export function NewsFlashBannerClient({ flashes }: { flashes: ActiveNewsFlash[] }) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => setDismissedIds(readDismissed()), []);

  const visible = useMemo(
    () => flashes.filter((f) => !dismissedIds.includes(f.id)),
    [flashes, dismissedIds]
  );

  useEffect(() => {
    if (index >= visible.length) setIndex(0);
  }, [visible.length, index]);

  useEffect(() => {
    if (visible.length <= 1 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % visible.length), ROTATE_MS);
    return () => clearInterval(timer);
  }, [visible.length, paused]);

  if (visible.length === 0) return null;
  const current = visible[index];

  function dismissCurrent() {
    const next = [...readDismissed(), current.id];
    sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
    setDismissedIds(next);
  }

  return (
    <div
      className="relative z-10 mt-20 sm:mt-24 bg-oroko-gold text-oroko-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 sm:gap-3">
        <span className="relative flex size-4 shrink-0 items-center justify-center">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-oroko-black/40" />
          <Zap className="relative size-4 animate-pulse" strokeWidth={2.5} />
        </span>

        {visible.length > 1 && (
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + visible.length) % visible.length)}
            aria-label="Previous update"
            className="hidden sm:block shrink-0 hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}

        <p key={current.id} className="text-xs sm:text-sm flex-1 min-w-0 truncate">
          <span className="font-bold uppercase tracking-wide mr-1.5">Flash</span>
          <span className="font-semibold">{current.title}</span> — {current.message}
        </p>

        {visible.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % visible.length)}
              aria-label="Next update"
              className="hidden sm:block shrink-0 hover:opacity-70 transition-opacity"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              {visible.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show update ${i + 1}`}
                  className={`size-1.5 rounded-full transition-colors ${i === index ? "bg-oroko-black" : "bg-oroko-black/30"}`}
                />
              ))}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={dismissCurrent}
          aria-label="Dismiss"
          className="shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}


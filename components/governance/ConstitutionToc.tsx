"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ConstitutionArticle, ScheduleEntry } from "@/lib/constitution";

type Props = {
  articles: ConstitutionArticle[];
  schedules: ScheduleEntry[];
};

export function ConstitutionToc({ articles, schedules }: Props) {
  const [activeId, setActiveId] = useState<string>("preamble");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = [
      "preamble",
      ...articles.map((a) => a.id),
      ...schedules.map((s) => s.id),
      "final-declaration",
    ];

    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [articles, schedules]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  const items = [
    { id: "preamble", label: "Preamble" },
    ...articles.map((a) => ({ id: a.id, label: `Art. ${a.num} — ${a.title}` })),
    ...schedules.map((s) => ({ id: s.id, label: s.num + " — " + s.title })),
    { id: "final-declaration", label: "Final Declaration" },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden sticky top-26 z-30 bg-white border-b border-border px-4 py-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between text-sm font-medium text-oroko-black py-1"
        >
          <span>
            <span className="text-oroko-gold mr-2">§</span>
            {items.find((i) => i.id === activeId)?.label ?? "Preamble"}
          </span>
          <svg className={cn("size-4 transition-transform", open && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
        </button>
        {open && (
          <div className="absolute left-0 right-0 top-full bg-white border-b border-border shadow-lg max-h-[60vh] overflow-y-auto z-50">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-xs border-b border-border/40 transition-colors",
                  activeId === item.id ? "bg-oroko-gold/10 text-oroko-green font-semibold" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <nav className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-26 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 scrollbar-thin">
          <p className="text-[10px] tracking-[0.2em] uppercase text-oroko-gold font-semibold mb-3 px-2">
            Contents
          </p>
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-sm text-xs leading-tight transition-colors",
                    activeId === item.id
                      ? "bg-oroko-gold/10 text-oroko-green font-semibold border-l-2 border-oroko-gold pl-2"
                      : "text-muted-foreground hover:text-oroko-black hover:bg-muted"
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}

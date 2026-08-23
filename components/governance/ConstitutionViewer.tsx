"use client";

import { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CONSTITUTION,
  type SectionContent,
  type ConstitutionArticle,
  type ScheduleEntry,
} from "@/lib/constitution";

function toRoman(n: number): string {
  const map: [number, string][] = [
    [1000, "M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],
    [50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"],
  ];
  let out = "";
  for (const [val, sym] of map) { while (n >= val) { out += sym; n -= val; } }
  return out;
}

type ItemId = string;

export function ConstitutionViewer() {
  const [openId, setOpenId] = useState<ItemId>("preamble");

  const open = useCallback((id: ItemId) => {
    setOpenId((prev) => (prev === id ? "" : id));
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }, []);

  const allItems: { id: string; label: string }[] = [
    { id: "preamble", label: "Preamble" },
    ...CONSTITUTION.articles.map((a) => ({
      id: a.id,
      label: `Art. ${a.num} — ${a.title}`,
    })),
    ...CONSTITUTION.schedules.map((s) => ({ id: s.id, label: `${s.num} — ${s.title}` })),
    { id: "final-declaration", label: "Final Declaration" },
  ];

  return (
    <div className="flex gap-8 lg:gap-10 items-start">
      {/* Desktop TOC sidebar */}
      <nav className="hidden lg:block w-60 shrink-0 sticky top-20 max-h-[calc(100vh-88px)] overflow-y-auto pr-2">
        <p className="text-[10px] tracking-[0.2em] uppercase text-oroko-gold font-semibold mb-3 px-2">
          Contents
        </p>
        <ul className="space-y-0.5">
          {allItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => open(item.id)}
                className={cn(
                  "w-full text-left px-2 py-1.5 rounded-sm text-xs leading-tight transition-colors",
                  openId === item.id
                    ? "bg-oroko-gold/10 text-oroko-green font-semibold border-l-2 border-oroko-gold pl-2"
                    : "text-muted-foreground hover:text-oroko-black hover:bg-muted"
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile TOC dropdown */}
      <MobileToc items={allItems} openId={openId} onOpen={open} />

      {/* Accordion content */}
      <div className="flex-1 min-w-0 space-y-3">

        {/* Preamble */}
        <AccordionItem
          id="preamble"
          badge="§"
          label="Preamble"
          title=""
          isOpen={openId === "preamble"}
          onToggle={() => open("preamble")}
        >
          <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
            {CONSTITUTION.preamble.map((para, i) => (
              <p key={i} className={i === CONSTITUTION.preamble.length - 1 ? "font-semibold text-oroko-black" : ""}>
                {para}
              </p>
            ))}
          </div>
        </AccordionItem>

        {/* Articles */}
        {CONSTITUTION.articles.map((article) => (
          <AccordionItem
            key={article.id}
            id={article.id}
            badge={toRoman(article.num)}
            label={`Article ${article.num}`}
            title={article.title}
            isOpen={openId === article.id}
            onToggle={() => open(article.id)}
          >
            <div className="space-y-5">
              {article.sections.map((section) => (
                <div key={section.num}>
                  {section.num !== String(article.num) && (
                    <h4 className="flex items-baseline gap-2 font-heading text-base font-semibold text-oroko-black mb-1.5">
                      <span className="font-mono text-oroko-gold text-xs shrink-0">{section.num}</span>
                      {section.title}
                    </h4>
                  )}
                  <RenderContent content={section.content} />
                </div>
              ))}
            </div>
          </AccordionItem>
        ))}

        {/* Schedules */}
        {CONSTITUTION.schedules.map((schedule) => (
          <AccordionItem
            key={schedule.id}
            id={schedule.id}
            badge="—"
            label={schedule.num}
            title={schedule.title}
            isOpen={openId === schedule.id}
            onToggle={() => open(schedule.id)}
          >
            <RenderContent content={schedule.content} />
          </AccordionItem>
        ))}

        {/* Final Declaration */}
        <AccordionItem
          id="final-declaration"
          badge="✦"
          label="Closing Statement"
          title="Final Declaration"
          isOpen={openId === "final-declaration"}
          onToggle={() => open("final-declaration")}
        >
          <div className="space-y-4">
            {CONSTITUTION.finalDeclaration.map((para, i) => (
              <p key={i} className={`text-sm leading-relaxed ${i === CONSTITUTION.finalDeclaration.length - 1 ? "font-semibold text-oroko-black" : "text-muted-foreground"}`}>
                {para}
              </p>
            ))}
            <div className="pt-5 border-t border-border grid grid-cols-2 gap-5 text-muted-foreground text-xs">
              {["Date", "Place", "Presiding Officer", "Secretary"].map((label) => (
                <div key={label}>
                  <p className="uppercase tracking-wider mb-2">{label}</p>
                  <div className="h-px bg-border w-24" />
                </div>
              ))}
            </div>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}

// ─── Mobile TOC ──────────────────────────────────────────────────────────────

function MobileToc({
  items,
  openId,
  onOpen,
}: {
  items: { id: string; label: string }[];
  openId: string;
  onOpen: (id: string) => void;
}) {
  const [dropOpen, setDropOpen] = useState(false);
  const current = items.find((i) => i.id === openId)?.label ?? "Preamble";

  return (
    <div className="lg:hidden absolute left-0 right-0 sticky top-20 z-30 bg-white border-b border-border px-4 py-2 -mx-4 sm:-mx-6">
      <button
        onClick={() => setDropOpen((v) => !v)}
        className="w-full flex items-center justify-between text-sm font-medium text-oroko-black py-1"
      >
        <span><span className="text-oroko-gold mr-1.5">§</span>{current}</span>
        <ChevronDown className={cn("size-4 transition-transform", dropOpen && "rotate-180")} />
      </button>
      {dropOpen && (
        <div className="absolute left-0 right-0 top-full bg-white border-b border-border shadow-lg max-h-[55vh] overflow-y-auto z-50">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => { onOpen(item.id); setDropOpen(false); }}
              className={cn(
                "w-full text-left px-4 py-3 text-xs border-b border-border/40 transition-colors",
                openId === item.id ? "bg-oroko-gold/10 text-oroko-green font-semibold" : "text-muted-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionItem({
  id, badge, label, title, isOpen, onToggle, children,
}: {
  id: string; badge: string; label: string; title: string;
  isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28 bg-white rounded-xl shadow-sm border border-border overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-5 text-left hover:bg-muted/30 transition-colors"
        aria-expanded={isOpen}
      >
        {/* Number badge */}
        <div className="size-11 rounded-lg bg-oroko-black flex items-center justify-center shrink-0">
          <span className="font-heading font-bold text-oroko-gold text-sm">{badge}</span>
        </div>
        {/* Labels */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-semibold mb-0.5">
            {label}
          </p>
          {title && (
            <p className="font-heading text-base sm:text-lg font-bold text-oroko-black leading-snug line-clamp-2">
              {title}
            </p>
          )}
        </div>
        {/* Chevron */}
        <ChevronDown
          className={cn("size-5 text-muted-foreground shrink-0 transition-transform duration-300", isOpen && "rotate-180")}
        />
      </button>

      {/* Collapsible body */}
      <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0")}>
        <div className="px-5 pt-1 pb-6 border-t border-border">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Content renderer ─────────────────────────────────────────────────────────

function RenderContent({ content }: { content: SectionContent[] }) {
  return (
    <div className="space-y-2.5 text-muted-foreground leading-relaxed text-sm wrap-break-word">
      {content.map((block, i) => {
        if (block.type === "paragraph") return <p key={i}>{block.text}</p>;
        if (block.type === "subheading") {
          return <p key={i} className="font-semibold text-oroko-black mt-3 text-sm">{block.text}</p>;
        }
        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={i} className={block.ordered ? "list-decimal pl-5 space-y-1" : "space-y-1.5"}>
              {block.items.map((item, j) => (
                <li key={j} className={block.ordered ? "" : "flex items-start gap-2"}>
                  {!block.ordered && <span className="size-1.5 rounded-full bg-oroko-gold mt-2 shrink-0" />}
                  <span>{item}</span>
                </li>
              ))}
            </Tag>
          );
        }
        return null;
      })}
    </div>
  );
}

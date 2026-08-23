import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CONSTITUTION, type SectionContent } from "@/lib/constitution";
import { ConstitutionToc } from "@/components/governance/ConstitutionToc";

export const metadata: Metadata = {
  title: "Constitution — OROKO International",
  description:
    "The supreme governing instrument of OROKO International Organisation — Unity, Culture & Development",
};

export default function ConstitutionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/governance"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-oroko-black transition-colors mb-8"
      >
        <ArrowLeft className="size-3.5" /> Governance
      </Link>

      {/* Page hero */}
      <div className="bg-oroko-black oroko-pattern rounded-sm px-8 sm:px-12 py-12 mb-10 text-center">
        <p className="text-oroko-gold text-xs tracking-[0.4em] uppercase font-semibold mb-3">
          Official Document · Supreme Governing Instrument
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-3">
          Constitution of OROKO International
        </h1>
        <p className="font-heading text-xl italic text-oroko-gold/80">
          &ldquo;Unity, Culture &amp; Development&rdquo;
        </p>
        <p className="text-white/40 text-sm mt-4 max-w-xl mx-auto">
          This Constitution is the supreme internal governing instrument of OROKO
          INTERNATIONAL. It is binding upon all members, officers, committees and organs.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-8 lg:gap-10 items-start">
        <ConstitutionToc articles={CONSTITUTION.articles} schedules={CONSTITUTION.schedules} />

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-0">

          {/* Preamble */}
          <ArticleBlock id="preamble" label="Preamble" title="">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {CONSTITUTION.preamble.map((para, i) => (
                <p
                  key={i}
                  className={i === CONSTITUTION.preamble.length - 1 ? "font-semibold text-oroko-black" : ""}
                >
                  {para}
                </p>
              ))}
            </div>
          </ArticleBlock>

          {/* Articles */}
          {CONSTITUTION.articles.map((article) => (
            <ArticleBlock
              key={article.id}
              id={article.id}
              label={`Article ${article.num}`}
              title={article.title}
            >
              <div className="space-y-6">
                {article.sections.map((section) => (
                  <div key={section.num}>
                    {section.num !== String(article.num) && (
                      <h4 className="font-heading text-base font-semibold text-oroko-black mb-2">
                        <span className="text-oroko-gold font-mono text-sm mr-2">{section.num}</span>
                        {section.title}
                      </h4>
                    )}
                    <RenderContent content={section.content} />
                  </div>
                ))}
              </div>
            </ArticleBlock>
          ))}

          {/* Schedules */}
          {CONSTITUTION.schedules.map((schedule) => (
            <ArticleBlock key={schedule.id} id={schedule.id} label={schedule.num} title={schedule.title}>
              <RenderContent content={schedule.content} />
            </ArticleBlock>
          ))}

          {/* Final Declaration */}
          <div id="final-declaration" className="scroll-mt-24 border border-oroko-gold/20 rounded-sm overflow-hidden mb-8">
            <div className="bg-oroko-green px-6 py-5">
              <p className="text-oroko-gold text-[10px] tracking-[0.3em] uppercase font-semibold mb-1">
                Closing Statement
              </p>
              <h2 className="font-heading text-2xl font-bold text-white">Final Declaration</h2>
            </div>
            <div className="bg-oroko-black px-6 py-8 space-y-4">
              {CONSTITUTION.finalDeclaration.map((para, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${
                    i === CONSTITUTION.finalDeclaration.length - 1
                      ? "text-oroko-gold font-semibold"
                      : "text-white/80"
                  }`}
                >
                  {para}
                </p>
              ))}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-6 text-white/30 text-xs">
                {["Date", "Place", "Presiding Officer", "Secretary"].map((label) => (
                  <div key={label}>
                    <p className="uppercase tracking-wider mb-2">{label}</p>
                    <div className="h-px bg-white/20 w-28" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="pt-4 border-t border-border text-center">
            <a href="#" className="text-xs text-muted-foreground hover:text-oroko-black transition-colors">
              ↑ Back to top
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleBlock({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24 mb-8 border border-border rounded-sm overflow-hidden">
      {/* Article header */}
      <div className="bg-oroko-green/5 border-b border-border px-6 py-5 flex items-start gap-4">
        <div className="shrink-0 bg-oroko-gold text-oroko-black font-mono text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider mt-0.5">
          {label}
        </div>
        {title && (
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-oroko-black leading-tight">
            {title}
          </h2>
        )}
      </div>
      {/* Article body */}
      <div className="px-6 py-6 bg-white">{children}</div>
    </div>
  );
}

function RenderContent({ content }: { content: SectionContent[] }) {
  return (
    <div className="space-y-3 text-muted-foreground leading-relaxed wrap-break-word text-sm sm:text-base">
      {content.map((block, i) => {
        if (block.type === "paragraph") {
          return <p key={i}>{block.text}</p>;
        }
        if (block.type === "subheading") {
          return (
            <p key={i} className="font-semibold text-oroko-black mt-4 text-sm">
              {block.text}
            </p>
          );
        }
        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={i} className={block.ordered ? "list-decimal pl-6 space-y-1" : "space-y-1.5"}>
              {block.items.map((item, j) => (
                <li key={j} className={block.ordered ? "" : "flex items-start gap-2"}>
                  {!block.ordered && (
                    <span className="size-1.5 rounded-full bg-oroko-gold mt-2 shrink-0" />
                  )}
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

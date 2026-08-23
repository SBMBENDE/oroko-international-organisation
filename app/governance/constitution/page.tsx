import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { CONSTITUTION, type SectionContent } from "@/lib/constitution";
import { ConstitutionToc } from "@/components/governance/ConstitutionToc";

export const metadata: Metadata = {
  title: "Constitution of OROKO International",
  description: "The supreme governing instrument of OROKO International Organisation — Unity, Culture & Development",
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

      {/* Page header */}
      <div className="mb-10 pb-8 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-sm bg-oroko-gold/10 border border-oroko-gold/20">
            <FileText className="size-5 text-oroko-gold" />
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest">Official Document · Statute</span>
        </div>
        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-oroko-black mb-2">
          Constitution of OROKO International
        </h1>
        <p className="font-heading text-xl italic text-oroko-gold">&ldquo;Unity, Culture &amp; Development&rdquo;</p>
        <p className="text-muted-foreground text-sm mt-3 max-w-2xl">
          The supreme governing instrument of OROKO INTERNATIONAL. This Constitution is binding
          upon all members, officers, committees and organs of the Organisation.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-10 items-start">
        <ConstitutionToc articles={CONSTITUTION.articles} schedules={CONSTITUTION.schedules} />

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-12">

          {/* Preamble */}
          <section id="preamble" className="scroll-mt-32">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading text-3xl font-bold text-oroko-black">Preamble</span>
            </div>
            <div className="oroko-divider mb-6" />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {CONSTITUTION.preamble.map((para, i) => (
                <p key={i} className={i === CONSTITUTION.preamble.length - 1 ? "font-semibold text-oroko-black" : ""}>
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Articles */}
          {CONSTITUTION.articles.map((article) => (
            <section key={article.id} id={article.id} className="scroll-mt-32">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-xs tracking-[0.25em] uppercase text-oroko-gold font-semibold">
                  Article {article.num}
                </span>
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-oroko-black mb-5">
                {article.title}
              </h2>
              <div className="oroko-divider mb-6" />

              <div className="space-y-6">
                {article.sections.map((section) => (
                  <div key={section.num} id={`${article.id}-${section.num.replace(".", "-")}`} className="scroll-mt-32">
                    {/* Only render section heading if it has a distinct title from the article */}
                    {section.num !== String(article.num) && (
                      <h3 className="font-heading text-lg font-semibold text-oroko-black mb-2">
                        <span className="text-oroko-gold font-normal text-base mr-2">{section.num}</span>
                        {section.title}
                      </h3>
                    )}
                    <RenderContent content={section.content} />
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Schedules */}
          {CONSTITUTION.schedules.map((schedule) => (
            <section key={schedule.id} id={schedule.id} className="scroll-mt-32">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-xs tracking-[0.25em] uppercase text-oroko-gold font-semibold">
                  {schedule.num}
                </span>
              </div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-oroko-black mb-5">
                {schedule.title}
              </h2>
              <div className="oroko-divider mb-6" />
              <RenderContent content={schedule.content} />
            </section>
          ))}

          {/* Final Declaration */}
          <section id="final-declaration" className="scroll-mt-32">
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-oroko-black mb-5">
              Final Declaration
            </h2>
            <div className="oroko-divider mb-6" />
            <div className="bg-oroko-black oroko-pattern rounded-sm p-8 lg:p-10 space-y-4">
              {CONSTITUTION.finalDeclaration.map((para, i) => (
                <p key={i} className={`leading-relaxed ${i === CONSTITUTION.finalDeclaration.length - 1 ? "text-oroko-gold font-semibold" : "text-white/80"}`}>
                  {para}
                </p>
              ))}
              <div className="pt-6 border-t border-white/10 mt-6 grid grid-cols-2 gap-4 text-white/40 text-xs">
                {["Date", "Place", "Presiding Officer", "Secretary"].map((label) => (
                  <div key={label}>
                    <p className="uppercase tracking-wider mb-1">{label}</p>
                    <div className="h-px bg-white/20 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Back to top */}
          <div className="pt-4 border-t border-border text-center">
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-oroko-black transition-colors"
            >
              ↑ Back to top
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderContent({ content }: { content: SectionContent[] }) {
  return (
    <div className="space-y-3 text-muted-foreground leading-relaxed">
      {content.map((block, i) => {
        if (block.type === "paragraph") {
          return <p key={i}>{block.text}</p>;
        }
        if (block.type === "subheading") {
          return (
            <p key={i} className="font-semibold text-oroko-black mt-4">
              {block.text}
            </p>
          );
        }
        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag key={i} className={block.ordered ? "list-decimal pl-6 space-y-1" : "space-y-1"}>
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

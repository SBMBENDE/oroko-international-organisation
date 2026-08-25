import type { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Gallery | OROKO International",
  description:
    "A visual record of OROKO International gatherings, community initiatives, cultural heritage, and global connections.",
};

type GalleryItem = {
  title: string;
  category: string;
  description: string;
  accent: string;
  size: "tall" | "wide" | "standard";
};

const galleryItems: GalleryItem[] = [
  {
    title: "Together in purpose",
    category: "Community",
    description: "Moments that bring our global membership closer.",
    accent: "bg-oroko-green",
    size: "tall",
  },
  {
    title: "Cultural heritage",
    category: "Culture",
    description: "Celebrating the stories, traditions, and identity of the Oroko people.",
    accent: "bg-oroko-gold/80",
    size: "standard",
  },
  {
    title: "Shared progress",
    category: "Initiatives",
    description: "Community-led work creating lasting impact across Oroko Land.",
    accent: "bg-oroko-green-light",
    size: "wide",
  },
  {
    title: "In conversation",
    category: "Gatherings",
    description: "Conversations that turn shared values into collective action.",
    accent: "bg-oroko-black",
    size: "standard",
  },
  {
    title: "Across borders",
    category: "Diaspora",
    description: "The OROKO community connected across countries and generations.",
    accent: "bg-oroko-gold",
    size: "wide",
  },
  {
    title: "A new generation",
    category: "Youth",
    description: "Creating space for the next generation of Oroko leaders.",
    accent: "bg-oroko-green",
    size: "tall",
  },
  {
    title: "In service",
    category: "Community",
    description: "People coming together to serve with care and purpose.",
    accent: "bg-oroko-green-light",
    size: "standard",
  },
  {
    title: "Looking ahead",
    category: "Milestones",
    description: "Marking the moments that shape our shared future.",
    accent: "bg-oroko-gold/80",
    size: "standard",
  },
];

function GalleryPlaceholder({ item }: { item: GalleryItem }) {
  return (
    <article
      className={`group relative min-h-72 overflow-hidden rounded-sm border border-border ${item.size === "tall" ? "lg:row-span-2" : ""} ${item.size === "wide" ? "lg:col-span-2" : ""}`}
    >
      <div className={`absolute inset-0 ${item.accent} opacity-90 transition-transform duration-500 group-hover:scale-105`} />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_35%,rgba(0,0,0,0.42))]" />
      <div className="relative flex h-full min-h-72 flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="border border-white/30 bg-black/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
            {item.category}
          </span>
          <ImageIcon aria-hidden="true" className="size-5 shrink-0 text-white/60" strokeWidth={1.5} />
        </div>
        <div className="max-w-sm">
          <h2 className="font-heading text-2xl font-semibold text-white sm:text-3xl">{item.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
          <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-white/50">
            Image placeholder
          </p>
        </div>
      </div>
    </article>
  );
}

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background">
        <section className="relative overflow-hidden bg-oroko-black pb-20 pt-32 oroko-pattern">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 65% 70% at 60% 35%, oklch(0.265 0.067 155 / 0.34) 0%, transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-oroko-gold" />
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-oroko-gold">
                  Our Story in Pictures
                </span>
              </div>
              <h1 className="font-heading text-5xl font-bold leading-tight text-white sm:text-6xl">
                The OROKO <span className="text-gold-gradient">Gallery</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/60">
                A growing collection of the people, places, and moments that make
                our international community one.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-oroko-warm-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oroko-gold">
                  Featured moments
                </p>
                <h2 className="mt-2 font-heading text-3xl font-bold text-oroko-black sm:text-4xl">
                  A community in motion
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-right">
                This collection is ready for event photography, community stories,
                and archival images to be added.
              </p>
            </div>

            <div className="grid auto-rows-[minmax(18rem,1fr)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galleryItems.map((item) => (
                <GalleryPlaceholder key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

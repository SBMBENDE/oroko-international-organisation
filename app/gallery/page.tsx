import type { Metadata } from "next";
import Image from "next/image";
import { Images as ImagesIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { connectDB } from "@/lib/db";
import GalleryAlbum from "@/models/GalleryAlbum";

export const metadata: Metadata = {
  title: "Gallery | OROKO International",
  description:
    "A visual record of OROKO International gatherings, community initiatives, cultural heritage, and global connections.",
};

export default async function GalleryPage() {
  await connectDB();
  const albums = await GalleryAlbum.find({ isPublished: true, "images.0": { $exists: true } })
    .sort({ createdAt: -1 })
    .lean();

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
            {albums.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border py-24 text-center">
                <ImagesIcon className="size-10 text-muted-foreground" strokeWidth={1.5} />
                <p className="font-heading text-xl text-oroko-black">No photos published yet</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Check back soon — new albums from OROKO gatherings and initiatives will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {albums.map((album) => (
                  <div key={album._id.toString()}>
                    <div className="mb-6">
                      <h2 className="font-heading text-2xl font-bold text-oroko-black sm:text-3xl">{album.title}</h2>
                      {album.description && (
                        <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{album.description}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {album.images.map((img, i) => (
                        <div key={i} className="relative aspect-square overflow-hidden rounded-sm border border-border group">
                          <Image
                            src={img.url}
                            alt={img.caption ?? album.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {img.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/60 px-3 py-2">
                              <p className="text-xs text-white/90 truncate">{img.caption}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

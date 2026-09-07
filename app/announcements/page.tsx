import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { connectDB } from "@/lib/db";
import Announcement from "@/models/Announcement";
import { Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Announcements | OROKO International",
  description: "The latest news and organizational announcements from OROKO International.",
};

export default async function AnnouncementsPage() {
  await connectDB();
  const announcements = await Announcement.find({ status: "published" })
    .sort({ publishAt: -1, createdAt: -1 })
    .lean();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-background min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-oroko-gold text-xs tracking-[0.2em] uppercase font-medium mb-3">Stay Informed</p>
            <h1 className="font-heading text-4xl sm:text-5xl font-semibold text-oroko-black">Announcements</h1>
          </div>

          {announcements.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
              <Megaphone className="size-10 text-muted-foreground" />
              <p className="font-heading text-lg text-oroko-black">No announcements yet</p>
              <p className="text-sm text-muted-foreground max-w-sm">Check back soon for updates from OROKO International.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {announcements.map((a) => (
                <article key={a._id.toString()} className="rounded-xl bg-card p-6 sm:p-8 ring-1 ring-foreground/10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-oroko-gold">{a.category}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.publishAt ?? a.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl font-semibold text-oroko-black mb-3">{a.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{a.content}</p>
                  <p className="text-xs text-muted-foreground mt-4">By {a.authorName}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

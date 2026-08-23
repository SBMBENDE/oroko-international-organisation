import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-oroko-black flex items-center justify-center min-h-screen">
        <div className="text-center px-4">
          <div className="font-heading text-8xl font-bold text-oroko-gold/20 mb-4">
            404
          </div>
          <h1 className="font-heading text-3xl font-semibold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-oroko-gold text-oroko-black text-xs tracking-[0.2em] uppercase font-bold hover:bg-oroko-gold-light transition-colors duration-200 rounded-sm"
          >
            Return Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

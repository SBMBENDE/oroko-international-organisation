import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | OROKO International",
    default: "Authentication",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-oroko-black oroko-pattern flex flex-col">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.265 0.067 155 / 0.25) 0%, transparent 70%)",
        }}
      />
      <main className="relative flex-1 flex items-center justify-center px-4 py-16">
        {children}
      </main>
    </div>
  );
}

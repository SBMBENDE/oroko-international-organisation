import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PortalNav } from "@/components/portal/PortalNav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Server-side authorization guard
  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <>
      <Navbar />
      <PortalNav />
      <main className="flex-1 bg-background min-h-screen">
        <div className="pt-4 pb-16">{children}</div>
      </main>
      <Footer />
    </>
  );
}

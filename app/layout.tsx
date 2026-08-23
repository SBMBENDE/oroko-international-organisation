import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F0E8" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "OROKO International Organization",
    template: "%s | OROKO International",
  },
  description:
    "OROKO International Organization — Unity. Excellence. Global Impact. A premier community-driven organization connecting members across the globe.",
  keywords: ["OROKO", "international organization", "community", "membership", "Africa", "global"],
  authors: [{ name: "OROKO International Organization" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OROKO International",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "OROKO International Organization",
    title: "OROKO International Organization",
    description:
      "Unity. Excellence. Global Impact. Join the OROKO International community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OROKO International Organization",
    description: "Unity. Excellence. Global Impact.",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

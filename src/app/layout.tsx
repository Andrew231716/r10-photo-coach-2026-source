import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://r10-photo-coach-2026.vercel.app";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "R10 Photo Coach", template: "%s · R10 Photo Coach" },
  description:
    "Scuola fotografica interattiva per la Canon EOS R10: Academy, guide di scatto, simulatore 3D e analisi foto privata sul dispositivo.",
  applicationName: "R10 Photo Coach",
  keywords: [
    "Canon EOS R10",
    "tutorial fotografia",
    "simulatore fotocamera",
    "Academy fotografia",
    "impostazioni EOS R10",
  ],
  authors: [{ name: "R10 Photo Coach" }],
  appleWebApp: { capable: true, statusBarStyle: "black", title: "R10 Coach" },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: "R10 Photo Coach",
    title: "R10 Photo Coach",
    description:
      "Impara a usare davvero la Canon EOS R10: Academy, 23 guide, simulatore comandi e Photo Coach privato.",
    images: [{ url: "/hero-golden-hour.webp", width: 1200, height: 630, alt: "R10 Photo Coach — golden hour" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "R10 Photo Coach",
    description: "Academy, guide e simulatore EOS R10 — con analisi foto sul dispositivo.",
    images: ["/hero-golden-hour.webp"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#070809",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${display.variable} ${sans.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}


import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist as GeistSans, Geist_Mono as GeistMono, Geist } from "next/font/google";
import "./globals.css";
import GlobalShell from "./components/GlobalShell";
import PageTrackingProvider from "./PageTrackingProvider";
import VisitorTrackingProvider from "./components/VisitorTrackingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = GeistMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pashupatinathrudraksh.com"),
  title: "Pashupatinath Rudraksha | Original & Certified Rudraksha Beads",
  description:
    "Buy 100% Original Certified Rudraksha beads, malas, bracelets, and spiritual accessories sourced from Nepal. Trusted quality with lab certification and worldwide delivery.",
  keywords: [
    "Rudraksha",
    "Original Rudraksha",
    "Rudraksha Mala",
    "Pashupatinath Rudraksha",
    "Certified Rudraksha Beads",
    "Spiritual Accessories",
    "Nepali Rudraksha",
    "Rudraksha beads online",
    "Buy Rudraksha online",
    "1 Mukhi Rudraksha",
    "5 Mukhi Rudraksha",
    "Gauri Shankar Rudraksha",
  ],
  openGraph: {
    title: "Pashupatinath Rudraksha - Authentic Rudraksha from Nepal",
    description:
      "Discover authentic, certified Rudraksha beads and spiritual items at Pashupatinath Rudraksha. Sourced directly from Nepal, ensuring quality and tradition.",
    url: "https://www.pashupatinathrudraksh.com",
    siteName: "Pashupatinath Rudraksha",
    type: "website",
    images: [
      {
        url: "/PR_Logo.webp",
        width: 600,
        height: 600,
        alt: "Pashupatinath Rudraksha Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@pashupatinathrudraksh",
    title: "Pashupatinath Rudraksha | Original & Certified Rudraksha Beads",
    description:
      "Buy 100% Original Certified Rudraksha beads, malas, bracelets, and spiritual accessories sourced from Nepal. Trusted quality with lab certification and worldwide delivery.",
    images: ["/PR_Logo.webp"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://www.pashupatinathrudraksh.com",
  },
  authors: [{ name: "Pashupatinath Rudraksha" }],
  publisher: "Pashupatinath Rudraksha",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <Suspense>
          <PageTrackingProvider>
            <VisitorTrackingProvider>
              <GlobalShell>{children}</GlobalShell>
            </VisitorTrackingProvider>
          </PageTrackingProvider>
        </Suspense>
      </body>
    </html>
  );
}
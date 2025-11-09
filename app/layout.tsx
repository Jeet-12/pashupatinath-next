import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalShell from "./components/GlobalShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pashupatinath Rudraksha | Original & Certified Rudraksha Beads",
  description:
    "Buy 100% Original Certified Rudraksha beads, malas, bracelets, and spiritual accessories sourced from Nepal. Trusted quality with lab certification and worldwide delivery.",
  keywords: [
    "Rudraksha",
    "Original Rudraksha",
    "Rudraksha Mala",
    "Pashupatinath Rudraksha",
    "Certified Rudraksha Beads",
    "Spiritual Accessories"
  ],
  openGraph: {
    title: "Pashupatinath Rudraksha",
    description:
      "Authentic Certified Rudraksha from Nepal with trust and tradition.",
    url: "https://www.pashupatinathrudraksh.com",
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
  icons: {
    icon: "/PR_Logo.webp",
    shortcut: "/PR_Logo.webp",
    apple: "/PR_Logo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GlobalShell>{children}</GlobalShell>
      </body>
    </html>
  );
}

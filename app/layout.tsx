import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PULSE — AI Stadium Companion | FIFA World Cup 2026",
  description:
    "PULSE is a GenAI-powered command system for FIFA World Cup 2026 — a multilingual fan concierge and a live operations brain that reasons over real-time stadium signals to keep crowds moving and everyone safe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-pitch-900 text-cream font-body antialiased">{children}</body>
    </html>
  );
}

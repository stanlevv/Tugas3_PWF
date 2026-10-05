import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const satoshi = localFont({
  src: "../public/fonts/satoshi/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Todo App 062 — Praktikum PWF T3D",
  description: "Todo app praktikum PWF, Digitalent Komdigi. Express.js + MySQL + Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${satoshi.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50/70 text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
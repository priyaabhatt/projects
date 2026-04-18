import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unsiloed AI — Playground",
  description: "Prototype for Unsiloed AI Playground",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}

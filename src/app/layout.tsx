import type { Metadata } from "next";
import "./globals.css";
import { NivoraProvider } from "@/context/NivoraContext";

export const metadata: Metadata = {
  title: "NIVORA — Luxury Concierge & Room Service",
  description: "Elevate Every Stay. Bespoke in-room dining, QR orders, and luxury concierge services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <NivoraProvider>{children}</NivoraProvider>
      </body>
    </html>
  );
}

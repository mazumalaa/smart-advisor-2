import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppearanceProvider } from "@/components/layout/appearance-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UMKM Smart Advisor",
  description: "Data Penjualanmu. Keputusan Lebih Cerdas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <AppearanceProvider>{children}</AppearanceProvider>
      </body>
    </html>
  );
}

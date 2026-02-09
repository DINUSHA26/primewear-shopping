import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Village Vogue | Local Garment Multi-Vendor Marketplace",
  description: "Bridging the gap between small-scale village garments and the wider consumer market. Shop unique, handcrafted local garments.",
  keywords: ["garments", "local marketplace", "handcrafted clothes", "village garments", "multi-vendor marketplace"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

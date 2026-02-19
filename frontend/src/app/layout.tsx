import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ThemeProvider } from "@/components/common/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fashion Dora | Premium Multi-Vendor Marketplace",
  description: "Experience premium fashion at Fashion Dora. Shop unique, handcrafted garments from local vendors.",
  keywords: ["fashion dora", "premium garments", "handcrafted clothes", "local marketplace"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navbar />
          <main className="flex-grow pt-24 pb-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

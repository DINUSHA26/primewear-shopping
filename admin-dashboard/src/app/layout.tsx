"use client";

import Sidebar from '@/components/common/Sidebar';
import Navbar from '@/components/common/Navbar';
import { usePathname } from 'next/navigation';
import "./globals.css";

import { ThemeProvider } from '@/components/common/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased dark:bg-zinc-950 transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {isLoginPage ? (
            <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen font-sans">{children}</div>
          ) : (
            <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-zinc-100">
              {/* Sidebar - වම් පැත්තේ */}
              <Sidebar />

              <div className="flex-1 flex flex-col">
                {/* Navbar - ඉහළින් */}
                <Navbar />

                {/* ප්‍රධාන Content එක */}
                <main className="p-8 flex-1">
                  {children}
                </main>
              </div>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
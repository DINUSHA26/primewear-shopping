"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/common/Sidebar';
import Navbar from '@/components/common/Navbar';
import "./globals.css";
import { ThemeProvider } from '@/components/common/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased dark:bg-zinc-950 transition-colors duration-300 overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {isLoginPage ? (
            <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen font-sans">{children}</div>
          ) : (
            <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-zinc-100 overflow-x-hidden">
              {/* Sidebar - වම් පැත්තේ */}
              <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

              <div className="flex-1 flex flex-col min-w-0">
                {/* Navbar - ඉහළින් */}
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                {/* ප්‍රධාන Content එක */}
                <main className="p-4 md:p-8 flex-1 max-w-full overflow-x-hidden">
                  <div className="container mx-auto">
                    {children}
                  </div>
                </main>
              </div>

              {/* Mobile Overlay */}
              {sidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/50 z-10 lg:hidden transition-opacity"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
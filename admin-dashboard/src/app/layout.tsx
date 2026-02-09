"use client";

import Sidebar from '@/components/common/Sidebar';
import Navbar from '@/components/common/Navbar';
import { usePathname } from 'next/navigation';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body className="antialiased">
        {isLoginPage ? (
          <div className="bg-gray-50 min-h-screen font-sans">{children}</div>
        ) : (
          <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
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
      </body>
    </html>
  );
}
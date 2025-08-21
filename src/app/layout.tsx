import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type React from 'react';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/layout/main-sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'פלוגה ב - ניהול ציוד',
  description: 'מערכת לניהול והעברת משמרות בפלוגה ב',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} font-body antialiased`}
        suppressHydrationWarning
      >
        <SidebarProvider>
          <div className="flex min-h-screen">
            <SidebarInset className="flex flex-col">
              <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-30">
                <SidebarTrigger className="md:hidden" />
                <div className="flex-1">
                  {/* Optional: Add breadcrumbs or page title here */}
                </div>
              </header>
              <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
              </main>
            </SidebarInset>
            <MainSidebar />
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}

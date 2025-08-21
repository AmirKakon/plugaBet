import type React from 'react';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/layout/main-sidebar';

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SidebarInset className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">דיווח נוכחות</h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
        <MainSidebar />
      </div>
    </SidebarProvider>
  );
}

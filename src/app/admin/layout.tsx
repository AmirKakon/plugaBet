import type React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { BarChart2, Shield } from 'lucide-react';
import { UserNav } from '@/components/shared/user-nav';
import Link from 'next/link';

export default function AdminLayout({
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
               <h1 className="text-lg font-semibold">לוח בקרה - מנהל</h1>
            </div>
            <UserNav />
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background/80">
            {children}
          </main>
        </SidebarInset>
        <Sidebar side="right">
          <SidebarHeader className="p-4">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold">פלוגה ב (מנהל)</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive
                  tooltip={{ children: 'סיכום דוחות', side: 'left' }}
                >
                  <Link href="/admin">
                    <BarChart2 />
                    <span>סיכום דוחות</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}

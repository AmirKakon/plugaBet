
'use client';

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
import { BarChart2, Shield, Home, LogOut } from 'lucide-react';
import Link from 'next/link';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    router.replace('/login');
  };
  
  if (!isClient) {
    return null; // Or a loading spinner
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <SidebarInset className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-30">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
               <h1 className="text-lg font-semibold">לוח בקרה - מנהל</h1>
            </div>
             <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">התנתק</span>
            </Button>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background/80">
            {children}
          </main>
        </SidebarInset>
        <MainSidebar />
      </div>
    </SidebarProvider>
  );
}

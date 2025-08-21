'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { ClipboardList, Shield, Home } from 'lucide-react';

export function MainSidebar() {
  const { setOpenMobile } = useSidebar();
  return (
    <Sidebar side="right">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-semibold">פלוגה ב</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive
              tooltip={{ children: 'טופס ציוד', side: 'left' }}
              onClick={() => setOpenMobile(false)}
            >
              <Link href="/">
                <ClipboardList />
                <span>טופס ציוד</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: 'דיווח נוכחות', side: 'left' }}
              onClick={() => setOpenMobile(false)}
            >
              <Link href="/attendance">
                <Home />
                <span>דיווח נוכחות</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={{ children: 'ניהול', side: 'left' }}
              onClick={() => setOpenMobile(false)}
            >
              <Link href="/admin">
                <Shield />
                <span>ניהול</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

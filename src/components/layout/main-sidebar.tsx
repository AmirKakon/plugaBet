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
import { Shield, Home, FileSignature, LogIn, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export function MainSidebar() {
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    router.replace('/login');
    setOpenMobile(false)
  };

  const isAdminPage = pathname.startsWith('/admin');


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
              isActive={pathname === '/'}
              tooltip={{ children: 'דף הבית', side: 'left' }}
              onClick={() => setOpenMobile(false)}
            >
              <Link href="/">
                <Home />
                <span>דף הבית</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/equipment')}
              tooltip={{ children: 'טופס ציוד', side: 'left' }}
              onClick={() => setOpenMobile(false)}
            >
              <Link href="/equipment">
                <FileSignature />
                <span>טופס ציוד</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isAdminPage ? (
             <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  tooltip={{ children: 'התנתקות', side: 'left' }}
                >
                  <LogOut />
                  <span>התנתקות</span>
                </SidebarMenuButton>
             </SidebarMenuItem>
          ) : (
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/login')}
                tooltip={{ children: 'ניהול', side: 'left' }}
                onClick={() => setOpenMobile(false)}
              >
                <Link href="/login">
                  <LogIn />
                  <span>ניהול</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

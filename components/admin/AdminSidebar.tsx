'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Users,
  BarChart3,
  Settings,
  Store,
  ClipboardList,
  Shield,
  Home,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface AdminSidebarProps {
  children: React.ReactNode;
}

export function AdminSidebar({ children }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: Home,
    },
    {
      title: 'Vendor Applications',
      href: '/admin/vendor-applications',
      icon: FileText,
    },
    {
      title: 'Vendors',
      href: '/admin/vendors',
      icon: Store,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: ClipboardList,
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-4 py-2 text-xs text-muted-foreground">
            Admin Dashboard v1.0
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

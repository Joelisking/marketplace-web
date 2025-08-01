'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Store,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  Home,
  LogOut,
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
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface VendorSidebarProps {
  children: React.ReactNode;
}

export function VendorSidebar({ children }: VendorSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/vendor/dashboard',
      icon: Home,
    },
    {
      title: 'Products',
      href: '/vendor/products',
      icon: Package,
    },
    {
      title: 'Orders',
      href: '/vendor/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Analytics',
      href: '/vendor/analytics',
      icon: BarChart3,
    },
    {
      title: 'Settings',
      href: '/vendor/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-semibold">Vendor Portal</span>
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
          <SidebarSeparator />
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
          <div className="px-4 py-2 text-xs text-muted-foreground">
            Vendor Portal v1.0
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 px-4">
            <h1 className="text-lg font-semibold">
              Vendor Dashboard
            </h1>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

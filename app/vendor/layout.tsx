'use client';
import { ReactNode } from 'react';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';
import { VendorSidebar } from '@/components/vendor';

interface VendorLayoutProps {
  children: ReactNode;
}

export default function VendorLayout({
  children,
}: VendorLayoutProps) {
  return (
    <RoleProtectedRoute allowedRoles={['VENDOR', 'ADMIN', 'SUPER']}>
      <VendorSidebar>{children}</VendorSidebar>
    </RoleProtectedRoute>
  );
}

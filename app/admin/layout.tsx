'use client';
import { ReactNode } from 'react';
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RoleProtectedRoute allowedRoles={['ADMIN', 'SUPER']}>
      <AdminSidebar>
        <div className="admin-layout min-h-screen bg-background">
          {children}
        </div>
      </AdminSidebar>
    </RoleProtectedRoute>
  );
}

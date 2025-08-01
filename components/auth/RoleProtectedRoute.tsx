'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
  redirectTo?: string;
  unauthorizedRedirectTo?: string;
}

export const RoleProtectedRoute = ({
  children,
  allowedRoles,
  fallback = <div>Loading...</div>,
  redirectTo = '/login',
  unauthorizedRedirectTo = '/not-authorized',
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    // Use setTimeout to avoid hydration issues
    setTimeout(() => {
      router.push(redirectTo);
    }, 0);
    return null;
  }

  // Check if user has the required role
  if (user && !allowedRoles.includes(user.role)) {
    setTimeout(() => {
      router.push(unauthorizedRedirectTo);
    }, 0);
    return null;
  }

  return <>{children}</>;
};

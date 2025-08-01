'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  fallback = <div>Loading...</div>,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
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

  return <>{children}</>;
};

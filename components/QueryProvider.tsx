'use client';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';
import { setupAxiosInterceptors } from '@/lib/auth';

export default function QueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client] = useState(() => new QueryClient());

  useEffect(() => {
    // Set up axios interceptors for authentication
    setupAxiosInterceptors();
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
}

'use client';
import { ReactNode } from 'react';
import { Navigation } from '@/components/ui/navigation';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <div className="public-layout">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}

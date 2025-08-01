'use client';

// import Link from "next/link";
// Adjust the import path as needed
import { usePathname } from 'next/navigation';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-accent-foreground">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const pathUrl =
            '/' + pathSegments.slice(0, index + 1).join('/');

          return (
            <React.Fragment key={pathUrl}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-gray-500 capitalize">
                    {decodeURIComponent(segment)}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={pathUrl}
                    className="capitalize text-accent-foreground">
                    {decodeURIComponent(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

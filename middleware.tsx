import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Minimal base64url decoder for JWT
function decodeJwtPayload(token: string) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return (
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          );
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow anyone to access /login and /register
  if (pathname === '/login' || pathname === '/register') {
    return NextResponse.next();
  }

  // Require login (accessToken) for all routes except /login and /register
  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // For /vendor routes (excluding onboarding), require specific roles
  if (
    pathname.startsWith('/vendor') &&
    !pathname.includes('/onboarding')
  ) {
    const payload = decodeJwtPayload(accessToken);
    const allowedRoles = ['VENDOR', 'ADMIN', 'SUPER'];
    if (!payload || !allowedRoles.includes(payload.role)) {
      return NextResponse.redirect(
        new URL('/not-authorized', request.url)
      );
    }
  }

  // For /admin routes, require admin roles
  if (pathname.startsWith('/admin')) {
    const payload = decodeJwtPayload(accessToken);
    const allowedRoles = ['ADMIN', 'SUPER'];
    if (!payload || !allowedRoles.includes(payload.role)) {
      return NextResponse.redirect(
        new URL('/not-authorized', request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/vendor/:path*', '/admin/:path*', '/onboarding'],
};

# Authentication System

This document explains how to use the authentication system in the marketplace application.

## Overview

The authentication system provides automatic token management, route protection, and role-based access control without requiring manual authentication checks on every page.

## Components

### 1. ProtectedRoute

Use this for pages that require authentication but don't have specific role requirements.

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function MyPage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  );
}
```

### 2. RoleProtectedRoute

Use this for pages that require specific user roles.

```tsx
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

function VendorOnlyPage() {
  return (
    <RoleProtectedRoute allowedRoles={['VENDOR', 'ADMIN', 'SUPER']}>
      <div>This content is only for vendors</div>
    </RoleProtectedRoute>
  );
}
```

### 3. Layout-level Protection

For entire route groups, use layout-level protection:

```tsx
// app/vendor/layout.tsx
import { RoleProtectedRoute } from '@/components/auth/RoleProtectedRoute';

export default function VendorLayout({ children }) {
  return (
    <RoleProtectedRoute allowedRoles={['VENDOR', 'ADMIN', 'SUPER']}>
      {children}
    </RoleProtectedRoute>
  );
}
```

## Hook

### useAuth

Access authentication state and user information:

```tsx
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.role}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

## Automatic Features

### Token Management

- Tokens are automatically saved when logging in
- Tokens are automatically added to all API requests
- Tokens are automatically refreshed when expired
- Tokens are automatically cleared on logout

### Route Protection

- Middleware protects routes at the server level
- Client-side components provide smooth UX
- Automatic redirects to login/unauthorized pages

## When to Use Each Approach

### Use ProtectedRoute when:

- Page requires authentication but any role can access
- Individual page protection is needed
- No layout-level protection exists

### Use RoleProtectedRoute when:

- Page requires specific user roles
- Individual page role protection is needed
- No layout-level protection exists

### Use Layout-level protection when:

- All pages in a route group require the same protection
- You want to avoid repeating protection code
- You want consistent behavior across a section

### Use useAuth when:

- You need to access user information
- You need to check authentication state
- You need to perform logout actions
- You need conditional rendering based on auth state

## Examples

### Public Page (No Protection)

```tsx
function HomePage() {
  return <div>Welcome to our marketplace!</div>;
}
```

### Protected Page

```tsx
function ProfilePage() {
  return (
    <ProtectedRoute>
      <div>Your profile information</div>
    </ProtectedRoute>
  );
}
```

### Role-specific Page

```tsx
function AdminPage() {
  return (
    <RoleProtectedRoute allowedRoles={['ADMIN', 'SUPER']}>
      <div>Admin dashboard</div>
    </RoleProtectedRoute>
  );
}
```

### Conditional Content

```tsx
function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.role}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <a href="/login">Login</a>
      )}
    </header>
  );
}
```

## Best Practices

1. **Use layout-level protection** when possible to avoid repetition
2. **Don't manually check authentication** in page components
3. **Use the useAuth hook** for conditional rendering and user info
4. **Let the components handle redirects** automatically
5. **Keep authentication logic centralized** in the auth components

import { useState, useEffect } from 'react';
import {
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from '@/lib/auth';

// Decode JWT payload to get user info
const decodeJwtPayload = (token: string) => {
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
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{
    role: string;
    email?: string;
    phone?: string | null;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    [key: string]: unknown;
  } | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken && refreshToken) {
        setIsAuthenticated(true);
        // Decode user info from token
        const userInfo = decodeJwtPayload(accessToken);
        setUser(userInfo);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (e.g., token updates from other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshUserData = () => {
    const accessToken = getAccessToken();
    if (accessToken) {
      const userInfo = decodeJwtPayload(accessToken);
      setUser(userInfo);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    refreshUserData,
    // Convenience flags
    isEmailVerified: user?.emailVerified || false,
    isPhoneVerified: user?.phoneVerified || false,
  };
};

import { AuthResponseUser, AuthResponseUserRole } from '@/lib/api/marketplaceAPI.schemas';

/**
 * Extended User type with email and phone verification fields
 * This extends the auto-generated AuthResponseUser type
 */
export interface User extends AuthResponseUser {
  emailVerified: boolean;
  phoneVerified: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message?: string;
  emailVerificationSent?: boolean;
}

export { AuthResponseUserRole as UserRole };

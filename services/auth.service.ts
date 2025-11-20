import axios from 'axios';
import { User, AuthResponse } from '@/lib/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Auth Service for managing user authentication and profile
 */
export const authService = {
  /**
   * Get current authenticated user
   * @returns Promise<User>
   */
  async getMe(): Promise<User> {
    const response = await axios.get<{ user: User }>(`${API_BASE_URL}/auth/me`);
    return response.data.user;
  },

  /**
   * Update user profile
   * @param data - Profile data to update
   * @returns Promise<User>
   */
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<User> {
    const response = await axios.patch<{ user: User }>(`${API_BASE_URL}/auth/me`, data);
    return response.data.user;
  },

  /**
   * Refresh access token
   * @param refreshToken - Refresh token
   * @returns Promise<AuthResponse>
   */
  async refresh(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });
    return response.data;
  },
};

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface OtpResponse {
  success: boolean;
  message: string;
  expiresIn?: number;
}

export type OtpPurpose = 'REGISTRATION' | 'PHONE_VERIFICATION' | 'PASSWORD_RESET';

/**
 * OTP Service for handling email and phone verification
 */
export const otpService = {
  /**
   * Send OTP code to email
   * @param email - User's email address
   * @param purpose - Purpose of the OTP (REGISTRATION, PASSWORD_RESET)
   */
  async sendEmailOtp(
    email: string,
    purpose: OtpPurpose = 'REGISTRATION'
  ): Promise<OtpResponse> {
    const response = await axios.post<OtpResponse>(`${API_BASE_URL}/otp/send-email`, {
      email,
      purpose,
    });
    return response.data;
  },

  /**
   * Verify email OTP code
   * @param email - User's email address
   * @param code - 6-digit OTP code
   * @param purpose - Purpose of the OTP
   */
  async verifyEmailOtp(
    email: string,
    code: string,
    purpose: OtpPurpose = 'REGISTRATION'
  ): Promise<OtpResponse> {
    const response = await axios.post<OtpResponse>(`${API_BASE_URL}/otp/verify-email`, {
      email,
      code,
      purpose,
    });
    return response.data;
  },

  /**
   * Resend email OTP code
   * @param email - User's email address
   * @param purpose - Purpose of the OTP
   */
  async resendEmailOtp(
    email: string,
    purpose: OtpPurpose = 'REGISTRATION'
  ): Promise<OtpResponse> {
    const response = await axios.post<OtpResponse>(`${API_BASE_URL}/otp/resend-email`, {
      email,
      purpose,
    });
    return response.data;
  },

  /**
   * Send OTP code to phone (requires authentication)
   * @param phone - User's phone number (Ghana format: 0XXXXXXXXX)
   * @param purpose - Purpose of the OTP (PHONE_VERIFICATION)
   */
  async sendPhoneOtp(
    phone: string,
    purpose: OtpPurpose = 'PHONE_VERIFICATION'
  ): Promise<OtpResponse> {
    const response = await axios.post<OtpResponse>(`${API_BASE_URL}/otp/send-phone`, {
      phone,
      purpose,
    });
    return response.data;
  },

  /**
   * Verify phone OTP code (requires authentication)
   * @param phone - User's phone number
   * @param code - 6-digit OTP code
   * @param purpose - Purpose of the OTP
   */
  async verifyPhoneOtp(
    phone: string,
    code: string,
    purpose: OtpPurpose = 'PHONE_VERIFICATION'
  ): Promise<OtpResponse> {
    const response = await axios.post<OtpResponse>(`${API_BASE_URL}/otp/verify-phone`, {
      phone,
      code,
      purpose,
    });
    return response.data;
  },

  /**
   * Resend phone OTP code (requires authentication)
   * @param phone - User's phone number
   * @param purpose - Purpose of the OTP
   */
  async resendPhoneOtp(
    phone: string,
    purpose: OtpPurpose = 'PHONE_VERIFICATION'
  ): Promise<OtpResponse> {
    const response = await axios.post<OtpResponse>(`${API_BASE_URL}/otp/resend-phone`, {
      phone,
      purpose,
    });
    return response.data;
  },
};

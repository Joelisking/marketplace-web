# OTP Verification Implementation

This document describes the OTP (One-Time Password) verification system implemented in the marketplace frontend.

## Overview

The OTP verification system supports both email and phone verification for users. It integrates with the marketplace API's verification endpoints to provide a secure two-factor authentication flow.

## Features

- ✅ Email verification after registration
- ✅ Phone verification for checkout and payments
- ✅ Phone verification for vendor actions
- ✅ Resend OTP functionality with rate limiting
- ✅ Auto-submit on 6-digit code entry
- ✅ Mobile-friendly OTP input with autofill support
- ✅ Error handling with user-friendly messages
- ✅ Countdown timers for resend delays

## Architecture

### Services

#### 1. OTP Service (`services/otp.service.ts`)

Handles all OTP-related API calls:

```typescript
import { otpService } from '@/services/otp.service';

// Send email OTP
await otpService.sendEmailOtp('user@example.com', 'REGISTRATION');

// Verify email OTP
await otpService.verifyEmailOtp('user@example.com', '123456', 'REGISTRATION');

// Resend email OTP
await otpService.resendEmailOtp('user@example.com', 'REGISTRATION');

// Send phone OTP (requires authentication)
await otpService.sendPhoneOtp('0241234567', 'PHONE_VERIFICATION');

// Verify phone OTP (requires authentication)
await otpService.verifyPhoneOtp('0241234567', '123456', 'PHONE_VERIFICATION');

// Resend phone OTP (requires authentication)
await otpService.resendPhoneOtp('0241234567', 'PHONE_VERIFICATION');
```

#### 2. Auth Service (`services/auth.service.ts`)

Handles user data management:

```typescript
import { authService } from '@/services/auth.service';

// Get current user
const user = await authService.getMe();

// Update profile
const updatedUser = await authService.updateProfile({
  firstName: 'John',
  lastName: 'Doe',
  phone: '0241234567',
});

// Refresh tokens
const authResponse = await authService.refresh(refreshToken);
```

### Components

#### 1. PhoneVerificationModal (`components/auth/PhoneVerificationModal.tsx`)

A reusable modal component for phone verification:

```tsx
import { PhoneVerificationModal } from '@/components/auth';

<PhoneVerificationModal
  isOpen={showPhoneModal}
  onClose={() => setShowPhoneModal(false)}
  onSuccess={handlePhoneVerified}
  userPhone={user?.phone}
/>
```

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Called when modal is closed
- `onSuccess`: () => void - Called when verification succeeds
- `userPhone`: string (optional) - Pre-fill phone number

#### 2. EmailVerificationPage (`app/(public)/verify-email/page.tsx`)

A dedicated page for email verification after registration. Users are redirected here with their email as a query parameter:

```
/verify-email?email=user@example.com
```

#### 3. VerificationBadge (`components/auth/VerificationBadge.tsx`)

A UI component to display verification status:

```tsx
import { VerificationBadge } from '@/components/auth';

<VerificationBadge verified={user.emailVerified} label="Email Verified" />
<VerificationBadge verified={user.phoneVerified} label="Phone Verified" />
```

### Types

#### User Type (`lib/types/auth.ts`)

Extended user type with verification fields:

```typescript
interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN' | 'SUPER';
  storeId: string | null;
  createdAt: string;
  updatedAt: string | null;
}
```

## User Flows

### 1. Registration & Email Verification

1. User fills registration form at `/login`
2. On successful registration, tokens are saved
3. User is redirected to `/verify-email?email={email}`
4. User enters 6-digit code from email
5. On successful verification, user is redirected to home page

### 2. Phone Verification at Checkout

1. User proceeds to checkout
2. User fills checkout form and submits
3. If phone is not verified, payment initialization fails with `PHONE_NOT_VERIFIED` error
4. PhoneVerificationModal is automatically shown
5. User verifies phone number
6. Checkout is automatically retried after verification
7. User is redirected to Paystack payment page

### 3. Phone Verification for Vendor Actions

Similar to checkout flow, vendors are prompted to verify their phone before:
- Publishing products
- Processing orders
- Accessing sensitive features

## Integration with Existing Pages

### Checkout Page (`app/(public)/checkout/page.tsx`)

The checkout page has been updated to:
1. Import PhoneVerificationModal
2. Add state for modal visibility and pending checkout data
3. Handle `PHONE_NOT_VERIFIED` errors in payment initialization
4. Show phone verification modal when needed
5. Retry checkout after successful verification

**Key code changes:**

```typescript
// State
const [showPhoneModal, setShowPhoneModal] = useState(false);
const [pendingCheckoutData, setPendingCheckoutData] = useState<CheckoutFormData | null>(null);

// Error handling
catch (error) {
  if (error.response?.data?.code === 'PHONE_NOT_VERIFIED') {
    setPendingCheckoutData(data);
    setShowPhoneModal(true);
    return;
  }
}

// Success handler
const handlePhoneVerified = () => {
  if (pendingCheckoutData) {
    handleCheckout(pendingCheckoutData);
  }
};
```

### Registration Page (`app/(public)/login/page.tsx`)

Updated to redirect to email verification after successful registration:

```typescript
onSuccess: (data) => {
  if (data.data?.accessToken && data.data?.refreshToken) {
    saveTokens(data.data.accessToken, data.data.refreshToken);
    router.push(`/verify-email?email=${encodeURIComponent(regEmail)}`);
  }
}
```

## Environment Variables

Ensure the API base URL is configured:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://api.yourmarketplace.com
```

## API Endpoints

The implementation expects the following endpoints to be available:

### Email OTP
- `POST /otp/send-email` - Send OTP to email
- `POST /otp/verify-email` - Verify email OTP
- `POST /otp/resend-email` - Resend email OTP

### Phone OTP (requires authentication)
- `POST /otp/send-phone` - Send OTP to phone
- `POST /otp/verify-phone` - Verify phone OTP
- `POST /otp/resend-phone` - Resend phone OTP

### Auth
- `GET /auth/me` - Get current user
- `PATCH /auth/me` - Update user profile

## Error Handling

The implementation handles the following error cases:

1. **Invalid OTP**: Shows attempt count in error message
2. **Expired OTP**: Clear message prompting resend
3. **Rate limiting**: Shows countdown timer and blocks resend
4. **Network errors**: Generic error message with retry option
5. **Phone not verified**: Automatically shows verification modal

## Security Features

- Rate limiting on OTP requests (managed by backend)
- Maximum attempts before OTP expires
- Secure token storage in localStorage and cookies
- Automatic token refresh on 401 errors
- Phone verification required for sensitive operations

## Testing Checklist

- [ ] Register new user → redirects to email verification
- [ ] Enter correct OTP → verification succeeds
- [ ] Enter wrong OTP → shows error with attempts remaining
- [ ] Resend OTP → new code sent, countdown starts
- [ ] Checkout without phone verified → modal appears
- [ ] Verify phone → checkout continues automatically
- [ ] Cancel phone verification → modal closes, can retry
- [ ] Mobile responsiveness → OTP input works on mobile
- [ ] OTP autofill → works on iOS/Android browsers

## Future Enhancements

- [ ] Add phone verification for vendor onboarding
- [ ] Show verification status badges in user profile
- [ ] Add verification prompts in dashboard
- [ ] Implement "Verify Now" banners for unverified users
- [ ] Add verification reminders via email/SMS
- [ ] Support international phone numbers
- [ ] Add biometric verification option

## Troubleshooting

### OTP not received

**Email:**
- Check spam/junk folder
- Verify email address is correct
- Check backend logs for email sending errors

**SMS:**
- Verify phone number format (Ghana: 0XXXXXXXXX)
- Check backend SMS provider configuration
- Ensure phone number is not blocked

### "Phone verification required" error persists

1. Check if user's phone field is set in database
2. Verify JWT token contains updated user data
3. Check if phoneVerified flag is properly set after verification
4. Try refreshing tokens or logging in again

### TypeScript errors

If you encounter type errors:
1. Ensure `lib/types/auth.ts` is imported correctly
2. Check that User type extends AuthResponseUser
3. Verify axios response types match expected data structure

## Support

For issues or questions:
- Check backend API documentation: http://localhost:4000/docs
- Review the Frontend Integration Guide provided
- Contact the development team

---

**Last Updated**: November 20, 2025
**Version**: 1.0.0

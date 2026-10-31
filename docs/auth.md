# Authentication & Authorization Architecture

## Overview
Students Hub authentication is powered by **Better Auth** with Next.js App Router support, PostgreSQL persistence via Prisma ORM, and transactional emails sent through **Resend**.

The system provides flexible authentication options:
1. **Google OAuth (Social Login)**: One-click sign-in with Google.
2. **Passwordless Email OTP**: 6-digit one-time verification codes sent via Resend.
3. **Dedicated OTP Verification**: `/verify-otp` for direct OTP entry with 30s resend cooldown.
4. **Account Recovery / Forgot Password**: `/forgot-password` providing instant sign-in codes and password reset links.

---

## 1. Google OAuth Social Login
- **Configuration File**: [`lib/auth.ts`](file:///c:/Users/lovar/news-website/lib/auth.ts)
- **Client Trigger**: [`app/login/page.tsx`](file:///c:/Users/lovar/news-website/app/login/page.tsx)
- **Credentials Needed**:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- **Authorized Redirect URI**:
  ```text
  http://<your-domain>/api/auth/callback/google
  ```
- **Flow**:
  1. User clicks "Continue with Google" on `/login`.
  2. Better Auth redirects the user to Google's consent screen.
  3. Google redirects back to `/api/auth/callback/google`.
  4. Better Auth creates or links the `User` and `Account` records and sets the secure session cookie.

---

## 2. Passwordless Email OTP
- **Plugin**: Better Auth `emailOTP` plugin.
- **OTP Length**: 6 digits.
- **Validity**: 5 minutes (300 seconds).
- **Email Delivery**: Resend (`lib/email.ts`).
- **Resend Cooldown**: 30 seconds client-side countdown timer.

---

## 3. Dedicated Pages

### Sign In (`/login`)
- File: [`app/login/page.tsx`](file:///c:/Users/lovar/news-website/app/login/page.tsx)
- Provides Google Social Login, Email OTP input, and links to recovery.

### Verify OTP (`/verify-otp`)
- File: [`app/verify-otp/page.tsx`](file:///c:/Users/lovar/news-website/app/verify-otp/page.tsx)
- Dedicated 6-digit code entry interface.
- Supports query params: `?email=...&callbackUrl=...`.
- Features: Auto-advance inputs, backspace navigation, paste full 6 digits, resend countdown.

### Forgot Password (`/forgot-password`)
- File: [`app/forgot-password/page.tsx`](file:///c:/Users/lovar/news-website/app/forgot-password/page.tsx)
- Informs the user about the passwordless design.
- Offers instant 1-click Sign-in OTP dispatch.
- Offers traditional password reset email link dispatch (`/reset-password?token=...`).

### Reset Password (`/reset-password`)
- File: [`app/reset-password/page.tsx`](file:///c:/Users/lovar/news-website/app/reset-password/page.tsx)
- Validates the reset token from the email.
- Allows entering and confirming a new password (min 8 characters).

---

## 4. Environment Variables

Add the following to `.env`:

```env
# Better Auth
BETTER_AUTH_SECRET="your_long_random_secret_at_least_32_chars"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Resend Email Delivery
RESEND_API_KEY="re_123456789"
RESEND_FROM_EMAIL="Students Hub <verify@yourdomain.com>"
```

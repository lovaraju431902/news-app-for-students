import { Resend } from "resend";

/**
 * Resend Email Service Client
 * Server-only module for all transactional email delivery.
 */
const resendApiKey = process.env.RESEND_API_KEY;
const defaultFromEmail =
  process.env.RESEND_FROM_EMAIL || "Students Hub <onboarding@resend.dev>";

// Lazy-initialized singleton Resend client
let resendInstance: Resend | null = null;

function getResendClient(): Resend | null {
  if (!resendInstance && resendApiKey) {
    resendInstance = new Resend(resendApiKey);
  }
  return resendInstance;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Low-level reusable email delivery function using Resend
 */
export async function sendEmailDetailed({
  to,
  subject,
  html,
  text,
  from = defaultFromEmail,
}: SendEmailOptions): Promise<SendEmailResult> {
  const client = getResendClient();
  const recipientList = Array.isArray(to) ? to : [to];

  // Graceful development simulation when API key is not configured
  if (!client) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `[Resend Dev Simulation] To: ${recipientList.join(", ")} | Subject: ${subject} | (Configure RESEND_API_KEY to send live emails)`
      );
      return { success: true, id: "dev-simulated-id" };
    }
    console.error("[Resend Error] RESEND_API_KEY environment variable is missing in production.");
    return {
      success: false,
      error: "Email delivery service is unconfigured on the server.",
    };
  }

  try {
    const { data, error } = await client.emails.send({
      from,
      to: recipientList,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[Resend API Error]:", error.name, error.message);
      return {
        success: false,
        error: error.message || "Failed to deliver email through Resend.",
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (err: any) {
    console.error("[Resend Unexpected Error]:", err?.message || err);
    return {
      success: false,
      error: err?.message || "An unexpected error occurred while sending email.",
    };
  }
}

/**
 * Standard sendEmail returning boolean for simple checks
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const result = await sendEmailDetailed(options);
  return result.success;
}

/**
 * Sends a responsive, branded HTML OTP verification email
 */
export async function sendOtpEmail(
  email: string,
  otp: string,
  type: string
): Promise<boolean> {
  const isSignIn = type === "sign-in";
  const title = isSignIn ? "Your Verification Code" : "Verify Your Email";
  const subject = `${otp} is your Students Hub verification code`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
                Students <span style="background-color: #ef4444; padding: 2px 8px; border-radius: 6px; font-size: 18px;">Hub</span>
              </h1>
              <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 12px;">Premium Educational & Career Network</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px; text-align: center;">
              <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">${title}</h2>
              <p style="color: #475569; margin: 0 0 28px 0; font-size: 14px; line-height: 1.5;">
                Use the 6-digit one-time password below to complete your authentication. This code expires in <strong>5 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 18px; margin: 0 auto 28px auto; max-width: 260px;">
                <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; font-family: monospace;">
                  ${otp}
                </span>
              </div>
              <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
                If you did not request this code, you can safely ignore this email. Do not share this code with anyone.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 32px; text-align: center;">
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                &copy; ${new Date().getFullYear()} Students Hub. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `Your Students Hub verification code is: ${otp}\n\nThis code expires in 5 minutes. If you did not request this code, please ignore this email.`;

  return await sendEmail({ to: email, subject, html, text });
}

export interface SubscriptionEmailOptions {
  to: string;
  type: "activated" | "failed" | "cancelled";
  renewalDate?: string;
  amount?: string;
}

/**
 * Sends responsive subscription lifecycle notification emails
 */
export async function sendSubscriptionEmail({
  to,
  type,
  renewalDate,
  amount = "₹399",
}: SubscriptionEmailOptions): Promise<boolean> {
  let subject = "";
  let headline = "";
  let message = "";
  let badgeColor = "#16a34a";

  if (type === "activated") {
    subject = "Welcome to Students Hub Premium! Subscription Active";
    headline = "Your Premium Subscription is Active";
    badgeColor = "#16a34a";
    message = `Thank you for subscribing to Students Hub Premium! You now have unlimited, ad-free access to all premium articles, in-depth career guides, and exclusive resources. Your monthly renewal of ${amount} is set for ${renewalDate || "next month"}.`;
  } else if (type === "failed") {
    subject = "Payment Failed: Students Hub Premium";
    headline = "Action Required: Payment Failed";
    badgeColor = "#dc2626";
    message = `We were unable to process your recurring subscription charge of ${amount}. Please update your payment method to ensure continued access to premium articles.`;
  } else if (type === "cancelled") {
    subject = "Subscription Cancelled: Students Hub Premium";
    headline = "Subscription Cancelled";
    badgeColor = "#64748b";
    message = `Your Students Hub Premium subscription has been scheduled for cancellation. You will maintain full premium access until the end of your current billing period on ${renewalDate || "your period end date"}. You will not be charged again.`;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${headline}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">
                Students <span style="background-color: #ef4444; padding: 2px 8px; border-radius: 6px; font-size: 18px;">Hub</span>
              </h1>
              <p style="color: #f59e0b; margin: 6px 0 0 0; font-size: 12px; font-weight: 700; letter-spacing: 1px;">★ PREMIUM MEMBER</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px;">
              <div style="display: inline-block; background-color: ${badgeColor}; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 16px;">
                ${type.toUpperCase()}
              </div>
              <h2 style="color: #0f172a; margin: 0 0 16px 0; font-size: 20px; font-weight: 700;">${headline}</h2>
              <p style="color: #475569; margin: 0 0 24px 0; font-size: 14px; line-height: 1.6;">
                ${message}
              </p>
              <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; font-size: 13px; color: #334155;">
                <p style="margin: 0 0 8px 0;"><strong>Plan:</strong> Monthly Premium</p>
                <p style="margin: 0 0 8px 0;"><strong>Amount:</strong> ${amount} / month</p>
                ${renewalDate ? `<p style="margin: 0;"><strong>Billing Date:</strong> ${renewalDate}</p>` : ""}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 32px; text-align: center;">
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                Need help? Contact support at ${defaultFromEmail}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `${headline}\n\n${message}\n\nAmount: ${amount}\n${renewalDate ? `Billing Date: ${renewalDate}\n` : ""}`;

  return await sendEmail({ to, subject, html, text });
}

/**
 * Sends a responsive password reset email via Resend
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
): Promise<boolean> {
  const subject = "Reset your Students Hub password";
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">
                Students <span style="background-color: #ef4444; padding: 2px 8px; border-radius: 6px; font-size: 18px;">Hub</span>
              </h1>
              <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 12px;">Security & Account Recovery</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px; text-align: center;">
              <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">Reset Your Password</h2>
              <p style="color: #475569; margin: 0 0 28px 0; font-size: 14px; line-height: 1.5;">
                We received a request to reset your Students Hub account password. Click the button below to choose a new password. This link is valid for 1 hour.
              </p>
              <div style="margin: 0 0 28px 0;">
                <a href="${resetUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="color: #64748b; font-size: 12px; margin: 0 0 16px 0; line-height: 1.5;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <p style="color: #94a3b8; font-size: 11px; word-break: break-all; margin: 0;">
                Or copy and paste this link in your browser:<br/>
                <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 32px; text-align: center;">
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                &copy; ${new Date().getFullYear()} Students Hub. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `Reset your Students Hub password by clicking the link below:\n\n${resetUrl}\n\nThis link is valid for 1 hour. If you did not request this, please ignore this email.`;

  return await sendEmail({ to: email, subject, html, text });
}

/**
 * Sends a responsive email verification link via Resend
 */
export async function sendVerificationLinkEmail(
  email: string,
  verificationUrl: string
): Promise<boolean> {
  const subject = "Verify your Students Hub email address";
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">
                Students <span style="background-color: #ef4444; padding: 2px 8px; border-radius: 6px; font-size: 18px;">Hub</span>
              </h1>
              <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 12px;">Email Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 32px; text-align: center;">
              <h2 style="color: #0f172a; margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">Verify Your Email Address</h2>
              <p style="color: #475569; margin: 0 0 28px 0; font-size: 14px; line-height: 1.5;">
                Welcome to Students Hub! Please confirm your email address to activate your account and start exploring articles, discussions, and resources.
              </p>
              <div style="margin: 0 0 28px 0;">
                <a href="${verificationUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #64748b; font-size: 12px; margin: 0 0 16px 0; line-height: 1.5;">
                If you did not create an account on Students Hub, you can safely ignore this email.
              </p>
              <p style="color: #94a3b8; font-size: 11px; word-break: break-all; margin: 0;">
                Or copy and paste this link in your browser:<br/>
                <a href="${verificationUrl}" style="color: #2563eb;">${verificationUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 32px; text-align: center;">
              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                &copy; ${new Date().getFullYear()} Students Hub. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `Verify your Students Hub email address by clicking the link below:\n\n${verificationUrl}\n\nIf you did not create an account, please ignore this email.`;

  return await sendEmail({ to: email, subject, html, text });
}


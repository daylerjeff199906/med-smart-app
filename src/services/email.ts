import { sendEmail } from '@/lib/resend';

interface WelcomeEmailOptions {
    email: string;
    fullName: string;
    onboardingLink: string;
}

export async function sendWelcomeEmail({ email, fullName, onboardingLink }: WelcomeEmailOptions) {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MedSmart</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px; text-align: center;">
                    <h1 style="color: #000000; margin: 0 0 20px 0; font-size: 28px; font-weight: 800;">Welcome to MedSmart!</h1>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      Hi ${fullName || 'there'}, we're excited to have you on board!
                    </p>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      Please verify your email and complete your profile to start managing your health smarter.
                    </p>
                    <a href="${onboardingLink}" 
                       style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      Verify & Get Started
                    </a>
                    <p style="color: #888888; font-size: 14px; margin: 32px 0 0 0;">
                      If you didn't create an account, you can safely ignore this email.
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

    return sendEmail({
        to: email,
        subject: 'Welcome to MedSmart! Verify your email',
        html,
    });
}

export async function sendPasswordResetEmail({ email, resetLink }: { email: string; resetLink: string }) {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset your password</title>
      </head>
      <body style="font-family: Arial, sans-serif; padding: 40px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #000000; margin-bottom: 24px;">Reset your password</h2>
          <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 32px;">
            Click the button below to reset your password. This link will expire in 1 hour.
          </p>
          <a href="${resetLink}" 
             style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
            Reset Password
          </a>
          <p style="color: #888888; font-size: 14px; margin-top: 32px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: 'Reset your MedSmart password',
        html,
    });
}

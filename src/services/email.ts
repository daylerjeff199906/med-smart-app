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
        <title>Welcome to BEQUI</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px; text-align: center;">
                    <h1 style="color: #000000; margin: 0 0 20px 0; font-size: 28px; font-weight: 800;">Welcome to BEQUI!</h1>
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
    subject: 'Welcome to BEQUI! Verify your email',
    html,
  });
}

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from || `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Resend email error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendWelcomeEmail(email: string, fullName: string): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Greenfield</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <tr>
                  <td style="padding: 40px;">
                    <h1 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px;">Welcome to Greenfield!</h1>
                    <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                      Hi ${fullName || 'there'},
                    </p>
                    <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 20px 0;">
                      Thank you for joining us. We're excited to have you on board!
                    </p>
                    <p style="color: #666666; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
                      Complete your onboarding to get started with all our features.
                    </p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding" 
                       style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 16px;">
                      Complete Onboarding
                    </a>
                    <p style="color: #999999; font-size: 14px; margin: 30px 0 0 0;">
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
    subject: 'Welcome to Greenfield! Complete your onboarding',
    html,
  });
}

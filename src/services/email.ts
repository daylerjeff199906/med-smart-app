import { sendEmail } from '@/lib/resend';

// ============================================
// EMAILS PARA ONBOARDING INCOMPLETO
// ============================================

interface OnboardingReminderOptions {
  email: string;
  fullName: string;
  locale: string;
}

export async function sendOnboardingReminderEmail({ 
  email, 
  fullName, 
  locale 
}: OnboardingReminderOptions) {
  const isSpanish = locale === 'es';
  
  const content = isSpanish ? {
    subject: 'Completa tu perfil en BEQUI',
    title: '¡Bienvenido a BEQUI!',
    greeting: `Hola ${fullName || 'bienvenido'},`,
    message: 'Gracias por iniciar sesión. Para aprovechar al máximo tu experiencia, necesitamos que completes tu perfil de salud.',
    ctaText: 'Completar Perfil',
    footer: 'Si no creaste esta cuenta, puedes ignorar este correo.',
  } : {
    subject: 'Complete your profile in BEQUI',
    title: 'Welcome to BEQUI!',
    greeting: `Hi ${fullName || 'welcome'},`,
    message: 'Thanks for signing in. To get the most out of your experience, we need you to complete your health profile.',
    ctaText: 'Complete Profile',
    footer: 'If you didn\'t create this account, you can safely ignore this email.',
  };

  const onboardingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/onboarding`;

  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px; text-align: center;">
                    <div style="margin-bottom: 24px;">
                      <div style="width: 60px; height: 60px; background-color: #000000; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                      </div>
                    </div>
                    <h1 style="color: #000000; margin: 0 0 20px 0; font-size: 28px; font-weight: 800;">${content.title}</h1>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                      ${content.greeting}
                    </p>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                      ${content.message}
                    </p>
                    <a href="${onboardingUrl}" 
                       style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      ${content.ctaText}
                    </a>
                    <p style="color: #888888; font-size: 14px; margin: 32px 0 0 0;">
                      ${content.footer}
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
    subject: content.subject,
    html,
  });
}

// ============================================
// EMAILS PARA BIENVENIDA (ONBOARDING COMPLETADO)
// ============================================

interface WelcomeBackOptions {
  email: string;
  fullName: string;
  locale: string;
}

export async function sendWelcomeBackEmail({ 
  email, 
  fullName, 
  locale 
}: WelcomeBackOptions) {
  const isSpanish = locale === 'es';
  
  const content = isSpanish ? {
    subject: 'Bienvenido de vuelta a BEQUI',
    title: '¡Bienvenido a BEQUI!',
    greeting: `Hola ${fullName || 'bienvenido'},`,
    message: 'Tu perfil de salud está completo y listo para usar. Es un gusto tenerte de vuelta en tu aplicación de salud.',
    featuresTitle: '¿Qué puedes hacer hoy?',
    features: [
      'Consultar tu historial médico',
      'Programar nuevas citas',
      'Ver tus recetas y medicamentos',
      'Monitorear tu salud',
    ],
    ctaText: 'Ir al Dashboard',
    footer: 'Gracias por confiar en nosotros para cuidar de tu salud.',
  } : {
    subject: 'Welcome back to BEQUI',
    title: 'Welcome to BEQUI!',
    greeting: `Hi ${fullName || 'welcome'},`,
    message: 'Your health profile is complete and ready to use. It\'s great to have you back in your health application.',
    featuresTitle: 'What can you do today?',
    features: [
      'Check your medical history',
      'Schedule new appointments',
      'View your prescriptions and medications',
      'Monitor your health',
    ],
    ctaText: 'Go to Dashboard',
    footer: 'Thank you for trusting us to take care of your health.',
  };

  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/intranet`;

  const featuresHtml = content.features.map(feature => 
    `<li style="color: #4a4a4a; font-size: 15px; line-height: 1.6; margin-bottom: 8px; padding-left: 8px;">✓ ${feature}</li>`
  ).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="${locale}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <tr>
                  <td style="padding: 40px; text-align: center;">
                    <div style="margin-bottom: 24px;">
                      <div style="width: 60px; height: 60px; background-color: #000000; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                      </div>
                    </div>
                    <h1 style="color: #000000; margin: 0 0 20px 0; font-size: 28px; font-weight: 800;">${content.title}</h1>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
                      ${content.greeting}
                    </p>
                    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                      ${content.message}
                    </p>
                    <div style="background-color: #f8f8f8; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: left;">
                      <h3 style="color: #000000; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">${content.featuresTitle}</h3>
                      <ul style="margin: 0; padding-left: 20px; list-style: none;">
                        ${featuresHtml}
                      </ul>
                    </div>
                    <a href="${dashboardUrl}" 
                       style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                      ${content.ctaText}
                    </a>
                    <p style="color: #888888; font-size: 14px; margin: 32px 0 0 0;">
                      ${content.footer}
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
    subject: content.subject,
    html,
  });
}

// ============================================
// FUNCIONES LEGACY (para compatibilidad)
// ============================================

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

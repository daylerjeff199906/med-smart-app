"use server";

import { createClient } from "@/utils/supabase/server";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/features/auth/types/auth";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

export interface ForgotPasswordResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action para solicitar recuperación de contraseña
 */
export async function forgotPasswordAction(
  input: ForgotPasswordInput,
  locale: string = "es"
): Promise<ForgotPasswordResult> {
  try {
    const validation = forgotPasswordSchema.safeParse(input);

    if (!validation.success) {
      const errorMessage = validation.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return {
        success: false,
        error: errorMessage,
      };
    }

    const { email } = validation.data;
    const adminClient = await (await import("@/utils/supabase/admin")).createAdminClient();

    // 1. Generar link de recuperación manualmente
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${getLocalizedRoute(ROUTES.RESET_PASSWORD, locale)}`,
      }
    });

    if (linkError) {
      console.error("Error generating reset link:", linkError);
      return {
        success: false,
        error: linkError.message,
      };
    }

    if (!linkData?.properties?.action_link) {
      return {
        success: false,
        error: "Failed to generate recovery link",
      };
    }

    // 2. Enviar email de recuperación con Resend
    const { sendPasswordResetEmail } = await import("@/services/email");
    const emailResult = await sendPasswordResetEmail({
      email,
      resetLink: linkData.properties.action_link,
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: "Failed to send reset email. Please try again later.",
      };
    }

    return {
      success: true,
    };

  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}


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
    const supabase = await createClient();

    const redirectPath = getLocalizedRoute(ROUTES.RESET_PASSWORD, locale);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${redirectPath}`,
    });

    if (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        error: error.message,
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


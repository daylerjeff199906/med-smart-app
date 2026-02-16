"use server";

import { createClient } from "@/utils/supabase/server";

interface ResetPasswordInput {
  password: string;
}

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action para restablecer contraseña
 */
export async function resetPasswordAction(
  input: ResetPasswordInput
): Promise<ResetPasswordResult> {
  try {
    const { password } = input;

    if (!password) {
      return {
        success: false,
        error: "Password is required",
      };
    }

    const supabase = await createClient();

    // Actualizar la contraseña del usuario actualmente autenticado (vía el link de reset)
    const { error } = await supabase.auth.updateUser({
      password: password,
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
    console.error("Reset password error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}


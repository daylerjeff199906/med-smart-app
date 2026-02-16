"use server";

import { createClient } from "@/utils/supabase/server";
import { createSession } from "@/lib/session";
import { loginSchema, type LoginInput } from "@/features/auth/types/auth";
import { sendOnboardingReminderEmail, sendWelcomeBackEmail } from "@/services/email";

export interface LoginResult {
  success: boolean;
  error?: string;
  onboardingCompleted?: boolean;
}

export interface LoginActionInput extends LoginInput {
  locale: string;
}

/**
 * Server Action para login de usuarios
 */
export async function loginAction(input: LoginActionInput): Promise<LoginResult> {
  try {
    // Validar input con Zod
    const validation = loginSchema.safeParse(input);

    if (!validation.success) {
      const errorMessage = validation.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return {
        success: false,
        error: errorMessage,
      };
    }

    const { email, password, locale } = input;
    const supabase = await createClient();

    // Autenticar usuario con Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("Auth error:", authError);

      if (authError.code === 'email_not_confirmed') {
        return {
          success: false,
          error: "email_not_confirmed",
        };
      }

      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Authentication failed",
      };
    }

    // Obtener el perfil del usuario para verificar onboarding
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("onboarding_completed, first_name, last_name")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }

    const onboardingCompleted = (profile as { onboarding_completed?: boolean } | null)?.onboarding_completed ?? false;

    // Obtener nombre completo del usuario
    const firstName = (profile as { first_name?: string } | null)?.first_name || '';
    const lastName = (profile as { last_name?: string } | null)?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || email.split('@')[0];

    // Crear sesión encriptada
    await createSession(
      authData.user.id,
      authData.user.email!,
      onboardingCompleted
    );

    // Enviar email según el estado del onboarding
    try {
      if (onboardingCompleted) {
        // Onboarding completo: enviar email de bienvenida de vuelta
        await sendWelcomeBackEmail({
          email,
          fullName,
          locale,
        });
      } else {
        // Onboarding incompleto: enviar recordatorio
        await sendOnboardingReminderEmail({
          email,
          fullName,
          locale,
        });
      }
    } catch (emailError) {
      // No fallar el login si el email falla
      console.error("Email sending error:", emailError);
    }

    return {
      success: true,
      onboardingCompleted,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { createSession } from "@/lib/session";
import { loginSchema, type LoginInput } from "@/features/auth/types/auth";

export interface LoginResult {
  success: boolean;
  error?: string;
  onboardingCompleted?: boolean;
}

/**
 * Server Action para login de usuarios
 */
export async function loginAction(input: LoginInput): Promise<LoginResult> {
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

    const { email, password } = validation.data;
    const supabase = await createClient();

    // Autenticar usuario con Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      console.error("Auth error:", authError);
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
      .select("onboarding_completed")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
    }

    const onboardingCompleted = profile?.onboarding_completed ?? false;

    // Crear sesión encriptada
    await createSession(
      authData.user.id,
      authData.user.email!,
      onboardingCompleted
    );

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

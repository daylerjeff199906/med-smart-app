"use server";

import { createClient } from "@/utils/supabase/server";
import { createSession } from "@/lib/session";
import { sendWelcomeEmail } from "@/lib/resend";
import { registerSchema, type RegisterInput } from "@/features/auth/types/auth";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

export interface RegisterResult {
  success: boolean;
  error?: string;
  message?: string;
}

/**
 * Server Action para registro de usuarios con envío de email de bienvenida
 */
export async function registerAction(
  input: RegisterInput,
  locale: string = "es"
): Promise<RegisterResult> {
  try {
    // Validar input con Zod
    const validation = registerSchema.safeParse(input);

    if (!validation.success) {
      const errorMessage = validation.error.issues
        .map((issue) => issue.message)
        .join(", ");
      return {
        success: false,
        error: errorMessage,
      };
    }

    const { email, password, fullName } = validation.data;
    const supabase = await createClient();
    const adminClient = await (await import("@/utils/supabase/admin")).createAdminClient();

    // 1. Crear usuario en Supabase Auth (sin enviar email de confirmación si se deshabilita en el dashboard)
    // O mejor, generar el link manualmente si tenemos permisos de admin
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return {
        success: false,
        error: authError.message,
      };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Failed to create user",
      };
    }

    // 2. Generar link de confirmación manualmente
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'signup',
      email: email,
      password: password,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${getLocalizedRoute(ROUTES.ONBOARDING, locale)}`,
      }
    });

    if (linkError) {
      console.error("Error generating signup link:", linkError);
      // Continuamos aunque falle el link para intentar enviar el de bienvenida básico
    }

    const verificationLink = linkData?.properties?.action_link || `${process.env.NEXT_PUBLIC_APP_URL}${ROUTES.ONBOARDING}`;

    // 3. Obtener el perfil creado (trigger)
    await new Promise((resolve) => setTimeout(resolve, 800));
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_completed")
      .eq("id", authData.user.id)
      .single();

    // 4. Enviar email de bienvenida/verificación con Resend
    const { sendWelcomeEmail: sendCustomEmail } = await import("@/services/email");
    const emailResult = await sendCustomEmail({
      email,
      fullName,
      onboardingLink: verificationLink,
    });

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
    }

    return {
      success: true,
      message: "Registration successful! Please check your email to verify your account (Sent via MedSmart).",
    };

  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

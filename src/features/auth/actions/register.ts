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

    const { email, password, firstName, lastName } = validation.data;
    const supabase = await createClient();

    const redirectPath = getLocalizedRoute(ROUTES.LOGIN, locale);

    // Crear usuario en Supabase Auth con metadatos
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${redirectPath}`,
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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(authData.user.id)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("onboarding_completed, first_name, last_name, email")
      .eq("id", authData.user.id)
      .single();
    console.log(profile)

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      // Si el perfil no se creó, intentamos crearlo manualmente
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          first_name: firstName,
          last_name: lastName,
          onboarding_completed: false,
        });

      if (insertError) {
        console.error("Profile insert error:", insertError);
      }
    }

    // Si el perfil existe pero no tiene nombres, actualizarlos
    if (profile && (!profile.first_name || !profile.last_name)) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
        })
        .eq("id", authData.user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
      }
    }

    // Crear sesión encriptada
    await createSession(
      authData.user.id,
      authData.user.email!,
      profile?.onboarding_completed ?? false
    );

    // Enviar email de bienvenida
    const emailResult = await sendWelcomeEmail(email, `${firstName} ${lastName}`);

    if (!emailResult.success) {
      console.error("Failed to send welcome email:", emailResult.error);
      // No fallamos el registro si el email falla, solo logueamos
    }

    return {
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

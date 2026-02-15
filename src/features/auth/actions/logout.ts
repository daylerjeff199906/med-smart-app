"use server";

import { createClient } from "@/utils/supabase/server";
import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

export async function logoutAction(locale: string = "es") {
    const supabase = await createClient();

    // 1. Cerrar sesión en Supabase
    await supabase.auth.signOut();

    // 2. Eliminar sesión JWT
    await deleteSession();

    // 3. Redirigir al login
    redirect(getLocalizedRoute(ROUTES.LOGIN, locale));
}

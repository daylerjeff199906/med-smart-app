"use server";

import { redirect } from "next/navigation";
import { updateSessionOnboarding } from "@/lib/session";

/**
 * Server Action para completar onboarding
 */
export async function completeOnboarding(): Promise<void> {
    await updateSessionOnboarding(true);
    redirect("/intranet");
}

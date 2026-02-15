import { redirect } from "next/navigation";

/**
 * Root page - redirects to default locale
 * Esta página maneja la redirección inicial al locale por defecto
 */
export default function RootPage() {
  redirect("/es");
}

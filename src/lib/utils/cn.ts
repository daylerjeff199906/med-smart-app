import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind CSS con soporte para condicionales
 * Utiliza clsx para condicionales y tailwind-merge para evitar conflictos
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

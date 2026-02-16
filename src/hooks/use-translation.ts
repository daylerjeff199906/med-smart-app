"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import en from "@/locales/en.json";
import es from "@/locales/es.json";

type Dictionary = typeof en;

export type Locale = "en" | "es";

const dictionaries: Record<Locale, Dictionary> = {
    en,
    es,
};

export function useTranslation() {
    const params = useParams();
    const locale = (params?.locale as Locale) || "es";

    const t = useCallback(
        (path: string) => {
            const keys = path.split(".");
            let result: any = dictionaries[locale];

            if (!result) return path;

            for (const key of keys) {
                if (result[key] === undefined) {
                    return path;
                }
                result = result[key];
            }

            if (typeof result !== "string") {
                console.warn(`Translation key "${path}" resolved to an object instead of a string.`);
                return path;
            }

            return result;
        },
        [locale]
    );

    return { t, locale };
}


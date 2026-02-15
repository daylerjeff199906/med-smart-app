"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle } from "lucide-react";

import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/types/auth";
import { forgotPasswordAction } from "@/features/auth/actions/forgot-password";

import { useTranslation } from "@/hooks/use-translation";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

export function ForgotPasswordForm() {
  const { t, locale } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await forgotPasswordAction(values, locale);

      if (!result.success) {
        setError(result.error || "An error occurred");
        return;
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center animate-in zoom-in duration-300">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold">{t("auth.forgotPassword.title")}!</h3>
        <p className="text-muted-foreground">
          {t("auth.forgotPassword.subtitle")}.
        </p>
        <Link
          href={getLocalizedRoute(ROUTES.LOGIN, locale)}
          className="mt-4 inline-flex items-center text-sm font-semibold text-primary hover:underline"
        >
          {t("auth.forgotPassword.backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("auth.forgotPassword.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("auth.forgotPassword.subtitle")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in duration-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("auth.forgotPassword.email")}
                    disabled={isLoading}
                    className="h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t("auth.forgotPassword.button")
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center">
        <Link
          href={getLocalizedRoute(ROUTES.LOGIN, locale)}
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline"
        >
          {t("auth.forgotPassword.backToLogin")}
        </Link>
      </div>
    </div>
  );
}



"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/types/auth";
import { resetPasswordAction } from "@/features/auth/actions/reset-password";

import { useTranslation } from "@/hooks/use-translation";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordInput) {
    if (!token) {
      setError("Invalid or expired reset token");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await resetPasswordAction({
        token,
        password: values.password,
      });

      if (!result.success) {
        setError(result.error || "An error occurred");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(getLocalizedRoute(ROUTES.LOGIN, locale));
      }, 3000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="animate-in fade-in duration-300">
        <Alert variant="destructive">
          <AlertDescription>
            Invalid or expired reset link. Please request a new password reset.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Link href={getLocalizedRoute(ROUTES.LOGIN, locale)} className="text-sm font-semibold text-primary hover:underline">
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center animate-in zoom-in duration-300">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold">{t("auth.resetPassword.success")}</h3>
        <p className="text-muted-foreground">
          {t("auth.resetPassword.redirecting")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("auth.resetPassword.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("auth.resetPassword.subtitle")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in duration-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("auth.resetPassword.password")}
                      disabled={isLoading}
                      className="h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("auth.resetPassword.confirmPassword")}
                      disabled={isLoading}
                      className="h-12 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t("auth.resetPassword.button")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}



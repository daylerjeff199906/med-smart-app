"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { loginSchema, type LoginInput } from "@/features/auth/types/auth";
import { loginAction } from "@/features/auth/actions/login";

import { useTranslation } from "@/hooks/use-translation";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: LoginInput) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction({ ...values, locale });
      console.log(result);

      if (!result.success) {
        if (result.error === "email_not_confirmed") {
          setError(t("auth.login.emailNotConfirmed"));
        } else {
          setError(result.error || "An error occurred");
        }
        return;
      }

      router.refresh();

      let target: string;
      if (redirectTo) {
        target = redirectTo;
      } else if (result.onboardingCompleted) {
        target = ROUTES.DASHBOARD;
      } else {
        target = ROUTES.ONBOARDING;
      }

      router.push(getLocalizedRoute(target, locale));
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("auth.login.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("auth.login.subtitle")}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("auth.login.email")}
                      disabled={isLoading}
                      className="h-12 w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.login.password")}
                        disabled={isLoading}
                        className="h-12 pr-10 w-full"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
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
              t("auth.login.button")
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-10 space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          {t("auth.login.noAccount")}{" "}
          <Link href={getLocalizedRoute(ROUTES.REGISTER, locale)} className="font-semibold text-primary hover:underline">
            {t("auth.login.register")}
          </Link>
        </p>
        <Link
          href={getLocalizedRoute(ROUTES.FORGOT_PASSWORD, locale)}
          className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:underline"
        >
          {t("auth.login.forgotPassword")}
        </Link>
      </div>
    </div>
  );
}



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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, Eye, EyeOff, XCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { registerSchema, type RegisterInput } from "@/features/auth/types/auth";
import { registerAction } from "@/features/auth/actions/register";

import { useTranslation } from "@/hooks/use-translation";
import { ROUTES, getLocalizedRoute } from "@/lib/routes";

export function RegisterForm() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = form.watch("password") || "";

  const requirements = [
    { label: t("auth.register.requirements.length"), met: password.length >= 8 },
    { label: t("auth.register.requirements.uppercase"), met: /[A-Z]/.test(password) },
    { label: t("auth.register.requirements.lowercase"), met: /[a-z]/.test(password) },
    { label: t("auth.register.requirements.number"), met: /\d/.test(password) },
    { label: t("auth.register.requirements.special"), met: /[@$!%*?&]/.test(password) },
  ];

  async function onSubmit(values: RegisterInput) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await registerAction(values, locale);

      if (!result.success) {
        setError(result.error || "An error occurred");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(getLocalizedRoute(ROUTES.ONBOARDING, locale));
      }, 2000);
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
        <h3 className="text-2xl font-bold">{t("auth.register.title")}!</h3>
        <p className="text-muted-foreground">
          {t("auth.register.subtitle")}. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("auth.register.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("auth.register.subtitle")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="animate-in fade-in duration-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder={t("auth.register.fullName")}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder={t("auth.register.email")}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth.register.password")}
                        disabled={isLoading}
                        className="h-12 pr-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-3 px-1">
                    {requirements.map((req, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-center gap-2 text-[10px] transition-colors duration-200",
                          req.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground/60"
                        )}
                      >
                        {req.met ? (
                          <Check className="h-3 w-3 shrink-0" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/20 shrink-0" />
                        )}
                        <span className="leading-none">{req.label}</span>
                      </div>
                    ))}
                  </div>
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
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("auth.register.confirmPassword")}
                        disabled={isLoading}
                        className="h-12 pr-10 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
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

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0 px-1">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </FormControl>
                <FormLabel className="text-xs font-medium text-muted-foreground cursor-pointer select-none">
                  {t("auth.register.acceptTerms")}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              t("auth.register.button")
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          {t("auth.register.haveAccount")}{" "}
          <Link href={getLocalizedRoute(ROUTES.LOGIN, locale)} className="font-semibold text-primary hover:underline">
            {t("auth.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}



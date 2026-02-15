"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, User, Activity, AlertTriangle, Phone, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

import { onboardingSchema, type OnboardingInput } from "../types/onboarding";
import { completeOnboarding } from "../actions/onboarding";


const STEPS = [
  { id: "identity", title: "Identidad", icon: User },
  { id: "biometry", title: "Biometría", icon: Activity },
  { id: "conditions", title: "Condiciones", icon: AlertTriangle },
  { id: "emergency", title: "Emergencia", icon: Phone },
];

interface onboardingPageProps {
  profile: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export function OnboardingForm({ profile }: onboardingPageProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      birthDate: "",
      gender: "male",
      weight: undefined,
      height: undefined,
      bloodType: undefined,
      allergies: "",
      chronicConditions: "",
      hasDiabetes: false,
      hasHypertension: false,
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    },
    mode: "onChange",
  });

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  function getFieldsForStep(stepIndex: number): string[] {
    switch (stepIndex) {
      case 0: return ["birthDate", "gender"];
      case 1: return ["weight", "height"];
      case 2: return ["allergies", "chronicConditions", "hasDiabetes", "hasHypertension"];
      case 3: return ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship"];
      default: return [];
    }
  }

  async function onSubmit(values: OnboardingInput) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await completeOnboarding(values);
      if (result.success) {
        router.push("/intranet");
        router.refresh();
      } else {
        setError(result.error || "Failed to save profile");
        setIsLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  }

  const stepTitles = [
    { title: `¡Bienvenido, ${profile?.first_name || "Usuario"}!`, subtitle: t("onboarding.identity.subtitle") },
    { title: t("onboarding.biometry.title"), subtitle: t("onboarding.biometry.subtitle") },
    { title: t("onboarding.conditions.title"), subtitle: t("onboarding.conditions.subtitle") },
    { title: t("onboarding.emergency.title"), subtitle: t("onboarding.emergency.subtitle") },
  ];

  return (
    <div className="flex flex-col min-h-[85vh] max-w-lg mx-auto items-center pt-4 px-4">
      {/* Logo Section */}
      <div className="mb-14 flex flex-col items-center gap-3 group">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-xl shadow-primary/20 transform transition-transform group-hover:scale-105 duration-300">
          <Activity className="w-7 h-7" />
        </div>
        <span className="text-2xl font-black tracking-tighter text-foreground">BEQUI<span className="text-primary italic">.</span></span>
      </div>
      {/* Typography Section */}
      <div className="text-center mb-12 w-full animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-4 leading-tight">
          {stepTitles[currentStep].title}
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-sm mx-auto opacity-80">
          {stepTitles[currentStep].subtitle}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex-1 flex flex-col gap-10 max-w-sm mx-auto">
          <div className="flex-1">
            {error && (
              <div className="p-4 mb-8 rounded-2xl bg-destructive/5 text-destructive text-sm font-semibold border border-destructive/10 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              </div>
            )}

            {/* STEP 0: IDENTITY */}
            {currentStep === 0 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">{t("onboarding.identity.birthDate")}</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-14 rounded-2xl border-muted-foreground/15 bg-muted/5 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-base px-5" {...field} />
                      </FormControl>
                      <FormMessage className="ml-1" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">{t("onboarding.identity.gender.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-2xl w-full border-muted-foreground/15 bg-muted/5 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all px-5">
                            <SelectValue placeholder={t("onboarding.identity.gender.placeholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-muted-foreground/10 p-2 shadow-2xl">
                          <SelectItem value="male" className="rounded-xl py-3 px-4 focus:bg-primary/5">{t("onboarding.identity.gender.male")}</SelectItem>
                          <SelectItem value="female" className="rounded-xl py-3 px-4 focus:bg-primary/5">{t("onboarding.identity.gender.female")}</SelectItem>
                          <SelectItem value="other" className="rounded-xl py-3 px-4 focus:bg-primary/5">{t("onboarding.identity.gender.other")}</SelectItem>
                          <SelectItem value="prefer_not_to_say" className="rounded-xl py-3 px-4 focus:bg-primary/5">{t("onboarding.identity.gender.prefer_not_to_say")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="ml-1" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* STEP 1: BIOMETRY */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">{t("onboarding.biometry.weight")}</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="70" className="h-14 rounded-2xl border-muted-foreground/15 bg-muted/5 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all px-5" {...field} />
                        </FormControl>
                        <FormMessage className="ml-1" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">{t("onboarding.biometry.height")}</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="175" className="h-14 rounded-2xl border-muted-foreground/15 bg-muted/5 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all px-5" {...field} />
                        </FormControl>
                        <FormMessage className="ml-1" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">{t("onboarding.biometry.bloodType")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-14 rounded-2xl w-full border-muted-foreground/15 bg-muted/5 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all px-5">
                            <SelectValue placeholder={t("onboarding.biometry.bloodTypePlaceholder")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-muted-foreground/10 p-2 shadow-2xl">
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"].map((type) => (
                            <SelectItem key={type} value={type} className="rounded-xl py-3 px-4 focus:bg-primary/5 text-center font-bold">
                              {type === "unknown" ? t("onboarding.biometry.bloodTypeUnknown") : type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="ml-1" />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* STEP 2: CONDITIONS */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="hasDiabetes"
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={cn(
                          "cursor-pointer p-7 rounded-3xl border-2 transition-all duration-300 flex flex-col gap-4 text-left group/card items-center text-center",
                          field.value
                            ? "border-primary bg-primary/[0.03] ring-1 ring-primary shadow-xl shadow-primary/5 scale-[1.02]"
                            : "border-muted-foreground/15 bg-white hover:border-primary/40 hover:bg-muted/5"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                          field.value ? "bg-primary text-white scale-110 rotate-3" : "bg-muted text-muted-foreground group-hover/card:scale-105"
                        )}>
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-lg mb-1">{t("onboarding.conditions.diabetes")}</div>
                          <div className="text-[10px] uppercase font-black tracking-widest opacity-40 leading-tight">{t("onboarding.conditions.diabetesDetail")}</div>
                        </div>
                      </button>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hasHypertension"
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={cn(
                          "cursor-pointer p-7 rounded-3xl border-2 transition-all duration-300 flex flex-col gap-4 text-left group/card items-center text-center",
                          field.value
                            ? "border-primary bg-primary/[0.03] ring-1 ring-primary shadow-xl shadow-primary/5 scale-[1.02]"
                            : "border-muted-foreground/15 bg-white hover:border-primary/40 hover:bg-muted/5"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                          field.value ? "bg-primary text-white scale-110 -rotate-3" : "bg-muted text-muted-foreground group-hover/card:scale-105"
                        )}>
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-bold text-lg mb-1 font-sans">{t("onboarding.conditions.hypertension")}</div>
                          <div className="text-[10px] uppercase font-black tracking-widest opacity-40 leading-tight">{t("onboarding.conditions.hypertensionDetail")}</div>
                        </div>
                      </button>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest ml-1">{t("onboarding.conditions.allergies")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("onboarding.conditions.allergiesPlaceholder")}
                          className="rounded-2xl border-muted-foreground/15 bg-muted/5 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all px-5"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* STEP 3: EMERGENCY */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest ml-1 text-left">{t("onboarding.emergency.name")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("onboarding.emergency.namePlaceholder")} className="h-14 rounded-2xl border-muted-foreground/15 bg-muted/5 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all px-5" {...field} />
                      </FormControl>
                      <FormMessage className="ml-1 text-left" />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest ml-1 text-left">{t("onboarding.emergency.phone")}</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+54..." className="h-14 rounded-2xl border-muted-foreground/15 bg-muted/5 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all px-5" {...field} />
                        </FormControl>
                        <FormMessage className="ml-1 text-left" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergencyContactRelationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest ml-1 text-left">{t("onboarding.emergency.relationship")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("onboarding.emergency.relationshipPlaceholder")} className="h-14 rounded-2xl border-muted-foreground/15 bg-muted/5 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all px-5" {...field} />
                        </FormControl>
                        <FormMessage className="ml-1 text-left" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Area */}
          <div>
            <div className="flex flex-col gap-6 mt-4">
              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full h-16 rounded-full text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {t("onboarding.next")} {currentStep + 1}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-16 rounded-full text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-primary to-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin opacity-70" />
                      {t("onboarding.saving")}
                    </div>
                  ) : (
                    t("onboarding.button")
                  )}
                </Button>
              )}

              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-muted-foreground/60 rounded-full font-bold hover:text-foreground transition-all py-2 text-sm uppercase tracking-widest disabled:opacity-30 flex items-center justify-center gap-2 group"
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  {t("onboarding.back")}
                </button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

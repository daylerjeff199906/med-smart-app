"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, User, Activity, AlertTriangle, Phone, ChevronRight, ChevronLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

import { onboardingSchema, type OnboardingInput } from "../types/onboarding";
import { completeOnboarding } from "../actions/onboarding";

const STEPS = [
  { id: "identity", title: "Identity", icon: User },
  { id: "biometry", title: "Biometry", icon: Activity },
  { id: "conditions", title: "Conditions", icon: AlertTriangle },
  { id: "emergency", title: "Emergency", icon: Phone },
];

export function OnboardingForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      gender: "male",
      weight: 0,
      height: 0,
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
      case 0: return ["fullName", "birthDate", "gender"];
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

  return (
    <div className="space-y-8">
      {/* Progress Stepper */}
      <div className="relative flex justify-between">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                  isActive ? "bg-primary border-primary text-white scale-110" :
                    isCompleted ? "bg-primary border-primary text-white" :
                      "bg-white border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={cn(
                "hidden sm:block text-xs font-bold uppercase tracking-wider",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {t(`onboarding.${step.id}.title`)}
              </span>
            </div>
          );
        })}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 animate-in fade-in duration-300">
              {error}
            </div>
          )}

          {/* STEP 0: IDENTITY */}
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.identity.fullName")}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("onboarding.identity.birthDate")}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("onboarding.identity.gender.label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">{t("onboarding.identity.gender.male")}</SelectItem>
                          <SelectItem value="female">{t("onboarding.identity.gender.female")}</SelectItem>
                          <SelectItem value="other">{t("onboarding.identity.gender.other")}</SelectItem>
                          <SelectItem value="prefer_not_to_say">{t("onboarding.identity.gender.prefer_not_to_say")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* STEP 1: BIOMETRY */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("onboarding.biometry.weight")}</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("onboarding.biometry.height")}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="175" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* STEP 2: CONDITIONS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.conditions.allergies")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Penicillin, Peanuts, etc..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="chronicConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.conditions.chronicConditions")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Asthma, Arthritis, etc..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-6 p-4 rounded-xl border bg-muted/30">
                <FormField
                  control={form.control}
                  name="diabetes"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-semibold">{t("onboarding.conditions.diabetes")}</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hypertension"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-semibold">{t("onboarding.conditions.hypertension")}</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* STEP 3: EMERGENCY */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("onboarding.emergency.name")}</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("onboarding.emergency.phone")}</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 234 567 890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("onboarding.emergency.relationship")}</FormLabel>
                      <FormControl>
                        <Input placeholder="Spouse, Parent, etc..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className={cn("px-6", currentStep === 0 && "invisible")}
              disabled={isLoading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={nextStep} className="px-8 font-bold">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" className="px-10 font-black shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {t("onboarding.button")}
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import { completeOnboarding } from "@/features/onboarding/actions/onboarding";

export function OnboardingForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleComplete() {
    setIsLoading(true);
    try {
      await completeOnboarding();
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome Aboard!</CardTitle>
        <CardDescription>
          You&apos;re almost ready to go. Complete your onboarding to access the
          dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>
            <div>
              <h4 className="font-medium">Account Created</h4>
              <p className="text-sm text-muted-foreground">
                Your account has been successfully created
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>
            <div>
              <h4 className="font-medium">Email Verified</h4>
              <p className="text-sm text-muted-foreground">
                Your email has been verified
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              3
            </div>
            <div>
              <h4 className="font-medium">Complete Setup</h4>
              <p className="text-sm text-muted-foreground">
                Final step to access all features
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleComplete}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Onboarding
        </Button>
      </CardContent>
    </Card>
  );
}

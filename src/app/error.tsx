"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-12 text-destructive" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-foreground">
          Algo salió mal
        </h1>
        <p className="mb-8 text-muted-foreground">
          {error.message || "Ha ocurrido un error inesperado"}
        </p>
        <Button onClick={reset} size="lg" className="gap-2">
          <RefreshCw className="size-4" />
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
}

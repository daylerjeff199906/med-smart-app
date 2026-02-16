"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          Something went wrong
        </h2>
        <p className="mb-4 text-gray-600">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

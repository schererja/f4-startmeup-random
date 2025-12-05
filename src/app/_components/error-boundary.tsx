"use client";

import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-8">
      <h2 className="text-2xl font-bold text-red-900">Something went wrong!</h2>
      <p className="text-center text-red-700">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button
        onClick={reset}
        variant="outline"
        className="border-red-300 bg-white text-red-900 hover:bg-red-100"
      >
        Try again
      </Button>
    </div>
  );
}

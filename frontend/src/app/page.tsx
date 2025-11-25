"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Sparkles } from "lucide-react";
import { GoalInputForm } from "@/components/goals/GoalInputForm";
import { GoalResultDisplay } from "@/components/goals/GoalResultDisplay";
import { createGoal } from "@/lib/api";
import { Goal } from "@/types";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Goal | null>(null);

  const handleGoalSubmit = async (goalInput: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await createGoal(goalInput);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.detail || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
      <div className="text-center space-y-6 mb-12">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
          <Sparkles className="mr-1 h-3 w-3" />
          AI Powered
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-slate-900 dark:text-slate-50">
          Turn Vague Goals into <br className="hidden sm:inline" />
          <span className="text-blue-600 dark:text-blue-400">
            Actionable Plans
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Stop dreaming and start doing. Our AI agent breaks down your complex
          ambitions into simple, manageable steps.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
        <GoalInputForm onSubmit={handleGoalSubmit} loading={loading} />

        {error && (
          <div className="mt-6 p-4 rounded-md bg-red-50 text-red-900 flex items-center gap-2 border border-red-200 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      )}

      {result && <GoalResultDisplay result={result} />}
    </div>
  );
}


"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface SubTask {
  description: string;
  complexity_score: number;
}

interface Goal {
  id: number;
  description: string;
  tasks: SubTask[];
}

export default function Home() {
  const [goalInput, setGoalInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Goal | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("http://localhost:8000/goals", {
        description: goalInput,
      });
      setResult(response.data);
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
    <main className="flex min-h-screen flex-col items-center p-8 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-slate-50">
            Smart Goal Breaker
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Turn your vague goals into actionable steps with AI.
          </p>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>What do you want to achieve?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                placeholder="e.g., Launch a startup, Learn Python..."
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !goalInput.trim()}>
                {loading ? "Breaking..." : "Break it down"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 rounded-md bg-red-50 text-red-900 flex items-center gap-2 border border-red-200">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h2>Plan for: "{result.description}"</h2>
            </div>

            <div className="grid gap-4">
              {result.tasks.map((task, index) => (
                <Card key={index} className="overflow-hidden border-l-4 border-l-blue-500">
                  <CardContent className="p-6 flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium text-lg leading-none">
                        Step {index + 1}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 p-3 rounded-lg min-w-[80px]">
                      <span className="text-xs font-medium text-slate-500 uppercase">
                        Complexity
                      </span>
                      <span className={`text-2xl font-bold ${
                        task.complexity_score > 7 ? "text-red-500" : 
                        task.complexity_score > 4 ? "text-yellow-500" : "text-green-500"
                      }`}>
                        {task.complexity_score}/10
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Goal } from "@/types";

interface GoalResultDisplayProps {
  result: Goal;
}

export function GoalResultDisplay({ result }: GoalResultDisplayProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-3 text-2xl font-bold text-slate-800 dark:text-slate-200 border-b pb-4">
        <CheckCircle2 className="h-8 w-8 text-green-500" />
        <h2>Your Action Plan</h2>
      </div>

      <div className="grid gap-6">
        {result.tasks.map((task, index) => (
          <Card
            key={index}
            className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2 flex-1">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                  Step {index + 1}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  {task.description}
                </p>
              </div>
              <div className="flex flex-row sm:flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 px-4 py-2 sm:p-3 rounded-lg min-w-[100px] gap-2 sm:gap-0">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Complexity
                </span>
                <span
                  className={`text-xl sm:text-2xl font-bold ${
                    task.complexity_score > 7
                      ? "text-red-500"
                      : task.complexity_score > 4
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {task.complexity_score}/10
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Link href={`/goals/${result.id}`}>
          <Button variant="outline" size="lg">
            View Permanent Link
          </Button>
        </Link>
      </div>
    </div>
  );
}

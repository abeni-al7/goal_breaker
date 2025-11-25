"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Calendar, Clock, Trash2 } from "lucide-react";
import { Goal } from "@/types";
import { deleteGoal } from "@/lib/api";

interface GoalDetailViewProps {
  goal: Goal;
}

export function GoalDetailView({ goal }: GoalDetailViewProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteGoal(goal.id);
        router.push("/goals");
      } catch (error) {
        console.error("Failed to delete goal:", error);
        alert("Failed to delete goal. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <Link href="/goals">
          <Button
            variant="ghost"
            className="gap-2 pl-0 hover:bg-transparent hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to History
          </Button>
        </Link>
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Goal
        </Button>
      </div>

      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(goal.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <Clock className="h-3.5 w-3.5" />
              {new Date(goal.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
            {goal.description}
          </h1>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 text-2xl font-bold text-slate-800 dark:text-slate-200 border-b pb-4">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <h2>Action Plan</h2>
          </div>

          <div className="grid gap-6">
            {goal.tasks.map((task, index) => (
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
        </div>
      </div>
    </div>
  );
}

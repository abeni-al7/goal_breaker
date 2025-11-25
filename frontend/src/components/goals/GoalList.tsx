"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Goal } from "@/types";
import { GoalCard } from "./GoalCard";
import { deleteGoal } from "@/lib/api";

interface GoalListProps {
  goals: Goal[];
}

export function GoalList({ goals: initialGoals }: GoalListProps) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const handleDelete = async (id: number) => {
    try {
      await deleteGoal(id);
      setGoals(goals.filter((goal) => goal.id !== id));
    } catch (error) {
      console.error("Failed to delete goal:", error);
      alert("Failed to delete goal. Please try again.");
    }
  };

  if (goals.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center space-y-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800">
          <Calendar className="h-8 w-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            No goals found
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            You haven't broken down any goals yet.
          </p>
        </div>
        <Link href="/">
          <Button>Create your first goal</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
      ))}
    </div>
  );
}

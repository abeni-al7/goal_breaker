"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { GoalDetailView } from "@/components/goals/GoalDetailView";
import { getGoalById } from "@/lib/api";
import { Goal } from "@/types";

export default function GoalDetailPage() {
  const params = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        if (typeof params.id === "string") {
          const goalId = parseInt(params.id, 10);
          if (!isNaN(goalId)) {
            const data = await getGoalById(goalId);
            setGoal(data);
          } else {
             setError("Invalid goal ID");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load goal details.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGoal();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-4xl flex flex-col items-center justify-center text-center">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-6">
          <CheckCircle2 className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {error || "Goal not found"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
          We couldn't find the goal you're looking for. It might have been
          deleted or the link is incorrect.
        </p>
        <Link href="/goals">
          <Button size="lg">Back to History</Button>
        </Link>
      </div>
    );
  }

  return <GoalDetailView goal={goal} />;
}


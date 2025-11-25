"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Trash2 } from "lucide-react";
import { Goal } from "@/types";
import { Button } from "@/components/ui/button";

interface GoalCardProps {
  goal: Goal;
  onDelete: (id: number) => void;
}

export function GoalCard({ goal, onDelete }: GoalCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this goal?")) {
      onDelete(goal.id);
    }
  };

  return (
    <Link href={`/goals/${goal.id}`} className="group">
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-800 group-hover:-translate-y-1 relative">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="line-clamp-2 text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-8">
              {goal.description}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(goal.created_at).toLocaleDateString()}
            </div>
            <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

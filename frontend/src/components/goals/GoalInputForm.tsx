"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface GoalInputFormProps {
  onSubmit: (goal: string) => void;
  loading: boolean;
}

export function GoalInputForm({ onSubmit, loading }: GoalInputFormProps) {
  const [goalInput, setGoalInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    onSubmit(goalInput);
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="e.g., Launch a startup, Learn Python, Run a marathon..."
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            disabled={loading}
            className="flex-1 h-12 text-lg"
          />
          <Button
            type="submit"
            size="lg"
            disabled={loading || !goalInput.trim()}
            className="h-12 px-8"
          >
            {loading ? "Analyzing..." : "Break it Down"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

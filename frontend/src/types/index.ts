export interface SubTask {
  description: string;
  complexity_score: number;
}

export interface Goal {
  id: number;
  description: string;
  created_at: string;
  tasks: SubTask[];
}

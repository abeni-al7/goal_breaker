import axios from "axios";
import { Goal } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createGoal = async (description: string): Promise<Goal> => {
  const response = await api.post<Goal>("/goals/", { description });
  return response.data;
};

export const getGoals = async (): Promise<Goal[]> => {
  const response = await api.get<Goal[]>("/goals/");
  return response.data;
};

export const getGoalById = async (id: number): Promise<Goal> => {
  const response = await api.get<Goal>(`/goals/${id}`);
  return response.data;
};

export const deleteGoal = async (id: number): Promise<void> => {
  await api.delete(`/goals/${id}`);
};

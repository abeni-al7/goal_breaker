from typing import List
from app.models import Goal, SubTask
from app.repositories.goal_repository import GoalRepository
from app.infrastructure.ai_client import AIClient


class GoalService:
    def __init__(self, goal_repository: GoalRepository, ai_client: AIClient):
        self.goal_repository = goal_repository
        self.ai_client = ai_client

    def create_goal_breakdown(self, description: str) -> Goal:
        # 1. Create the Goal
        goal = Goal(description=description)
        created_goal = self.goal_repository.create_goal(goal)

        # 2. Call AI to get subtasks
        tasks_data = self.ai_client.generate_subtasks(description)

        # 3. Create SubTask objects
        subtasks = [
            SubTask(
                description=task["description"],
                complexity_score=task["complexity_score"],
                goal_id=created_goal.id
            )
            for task in tasks_data
        ]

        # 4. Save SubTasks
        self.goal_repository.create_subtasks(subtasks)
        
        # 5. Refresh goal to include tasks (SQLModel relationship)
        self.goal_repository.session.refresh(created_goal)
        return created_goal

    def get_all_goals(self) -> List[Goal]:
        return self.goal_repository.get_all_goals()

    def get_goal(self, goal_id: int) -> Goal:
        return self.goal_repository.get_goal_by_id(goal_id)

    def delete_goal(self, goal_id: int) -> bool:
        goal = self.goal_repository.get_goal_by_id(goal_id)
        if not goal:
            return False
        self.goal_repository.delete_goal(goal)
        return True

from typing import List, Optional
from sqlmodel import Session, select
from app.models import Goal, SubTask


class GoalRepository:
    def __init__(self, session: Session):
        self.session = session

    def create_goal(self, goal: Goal) -> Goal:
        self.session.add(goal)
        self.session.commit()
        self.session.refresh(goal)
        return goal

    def create_subtasks(self, subtasks: List[SubTask]) -> List[SubTask]:
        for task in subtasks:
            self.session.add(task)
        self.session.commit()
        # Refreshing all might be expensive, but needed for IDs
        for task in subtasks:
            self.session.refresh(task)
        return subtasks

    def get_goal_by_id(self, goal_id: int) -> Optional[Goal]:
        return self.session.get(Goal, goal_id)

    def get_all_goals(self, skip: int = 0, limit: int = 10) -> List[Goal]:
        statement = (
            select(Goal)
            .order_by(Goal.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return self.session.exec(statement).all()

    def count_goals(self) -> int:
        statement = select(Goal)
        return len(self.session.exec(statement).all())

    def delete_goal(self, goal: Goal) -> None:
        self.session.delete(goal)
        self.session.commit()

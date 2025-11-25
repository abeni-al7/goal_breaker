from typing import List, Optional
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship


class GoalBase(SQLModel):
    description: str


class Goal(GoalBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now())

    tasks: List["SubTask"] = Relationship(back_populates="goal")


class SubTaskBase(SQLModel):
    description: str
    complexity_score: int


class SubTask(SubTaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    goal_id: int = Field(foreign_key="goal.id")

    goal: Goal = Relationship(back_populates="tasks")


class SubTaskRead(SubTaskBase):
    id: int
    goal_id: int


class GoalRead(GoalBase):
    id: int
    created_at: datetime
    tasks: List[SubTaskRead] = []

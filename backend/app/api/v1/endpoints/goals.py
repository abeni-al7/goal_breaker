from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.infrastructure.database import get_session
from app.infrastructure.ai_client import AIClient
from app.repositories.goal_repository import GoalRepository
from app.services.goal_service import GoalService
from app.models import GoalRead, GoalBase

router = APIRouter()


def get_goal_service(session: Session = Depends(get_session)) -> GoalService:
    repository = GoalRepository(session)
    ai_client = AIClient()
    return GoalService(repository, ai_client)


@router.post("/", response_model=GoalRead)
def create_goal(
    goal_input: GoalBase,
    service: GoalService = Depends(get_goal_service)
):
    try:
        return service.create_goal_breakdown(goal_input.description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[GoalRead])
def read_goals(service: GoalService = Depends(get_goal_service)):
    return service.get_all_goals()


@router.get("/{goal_id}", response_model=GoalRead)
def read_goal(
    goal_id: int,
    service: GoalService = Depends(get_goal_service)
):
    goal = service.get_goal(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@router.delete("/{goal_id}", status_code=204)
def delete_goal(
    goal_id: int,
    service: GoalService = Depends(get_goal_service)
):
    success = service.delete_goal(goal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found")
    return None

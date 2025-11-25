from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from contextlib import asynccontextmanager

from .database import create_db_and_tables, get_session
from .models import Goal, GoalBase, SubTask, GoalRead
from .ai_service import generate_subtasks


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Smart Goal Breaker API is running"}


@app.post("/goals", response_model=GoalRead)
def create_goal(goal_input: GoalBase, session: Session = Depends(get_session)):
    # 1. Generate subtasks using AI
    try:
        tasks_data = generate_subtasks(goal_input.description)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"AI Service Error: {str(e)}"
        )

    # 2. Create Goal record
    db_goal = Goal.model_validate(goal_input)
    session.add(db_goal)
    session.commit()
    session.refresh(db_goal)

    # 3. Create SubTask records
    for task_data in tasks_data:
        subtask = SubTask(
            description=task_data["description"],
            complexity_score=task_data["complexity_score"],
            goal_id=db_goal.id
        )
        session.add(subtask)

    session.commit()
    session.refresh(db_goal)

    return db_goal

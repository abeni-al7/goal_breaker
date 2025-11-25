from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
import pytest
from unittest.mock import patch

from app.main import app
from app.infrastructure.database import get_session


# Setup in-memory SQLite database for testing
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_read_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Smart Goal Breaker API is running"}


@patch("app.api.v1.endpoints.goals.AIClient")
def test_create_goal(MockAIClient, client: TestClient):
    # Mock the AI response
    mock_instance = MockAIClient.return_value
    mock_instance.generate_subtasks.return_value = [
        {"description": "Task 1", "complexity_score": 1},
        {"description": "Task 2", "complexity_score": 2},
        {"description": "Task 3", "complexity_score": 3},
        {"description": "Task 4", "complexity_score": 4},
        {"description": "Task 5", "complexity_score": 5},
    ]

    # Note: The endpoint is now /api/v1/goals/
    # But we need to check config.py for API_V1_STR.
    # Assuming default "/api/v1"
    response = client.post(
        "/api/v1/goals/",
        json={"description": "Test Goal"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Test Goal"
    assert len(data["tasks"]) == 5
    assert data["tasks"][0]["description"] == "Task 1"
    assert data["tasks"][0]["complexity_score"] == 1

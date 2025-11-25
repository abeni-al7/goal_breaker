# Smart Goal Breaker - Architecture Document

## 1. System Overview
The **Smart Goal Breaker** is a web application designed to help users break down vague goals into actionable steps. It leverages an AI agent (Gemini) to analyze a user's input and generate a structured list of 5 sub-tasks along with a complexity score. The results are persisted in a PostgreSQL database and displayed to the user via a modern Next.js frontend.

## 2. Technology Stack
- **Frontend**: Next.js (React framework), Tailwind CSS.
- **UI Library**: shadcn/ui (for accessible and customizable components).
- **Backend**: Python (FastAPI).
- **Database**: PostgreSQL.
- **AI Model**: Google Gemini (via Google Generative AI SDK).
- **ORM**: SQLModel (combines SQLAlchemy and Pydantic for ease of use with FastAPI).

## 3. Data Model

### Goal
Represents the high-level objective entered by the user.
- `id`: UUID (Primary Key)
- `description`: String (The user's input)
- `created_at`: DateTime

### SubTask
Represents a specific actionable step derived from the goal.
- `id`: UUID (Primary Key)
- `goal_id`: UUID (Foreign Key to Goal)
- `description`: String (The actionable step)
- `complexity_score`: Integer (1-10)

## 4. API Design (FastAPI)

### Endpoints

#### `POST /api/goals`
- **Request Body**:
  ```json
  {
    "description": "Launch a startup"
  }
  ```
- **Process**:
  1. Receive goal description.
  2. Construct prompt for Gemini AI.
  3. Call Gemini API to get structured JSON response (5 tasks + scores).
  4. Save `Goal` and generated `SubTask`s to PostgreSQL.
  5. Return the created Goal object with nested Tasks.
- **Response**:
  ```json
  {
    "id": "...",
    "description": "Launch a startup",
    "created_at": "...",
    "tasks": [
      { "description": "Market Research", "complexity_score": 4 },
      ...
    ]
  }
  ```

#### `GET /api/goals`
- Retrieve history of broken-down goals.

## 5. AI Integration Strategy
- **Provider**: Google Gemini.
- **Prompt Engineering**: The prompt will strictly request a JSON output containing a list of exactly 5 steps, each with a description and a complexity score integer.
- **Validation**: Pydantic models will be used to validate the structure of the AI response before saving to the DB.

## 6. Frontend Architecture
- **Framework**: Next.js (App Router).
- **Pages**:
  - `/`: Main interface. Contains the input form and the results display area.
- **Components**:
  - `GoalInput`: Form with text input and submit button.
  - `TaskCard`: Component to display individual sub-tasks and their complexity.
  - `GoalDisplay`: Container for the list of TaskCards.
- **State Management**: React `useState` or `useReducer` to handle loading states, API responses, and error messages.

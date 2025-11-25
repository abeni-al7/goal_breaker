# Smart Goal Breaker

A simple app where a user types a vague goal (e.g., "Launch a startup"), and an AI Agent breaks it down into 5 actionable steps and saves them to a database.

## Tech Stack

- **Backend**: Python (FastAPI)
- **Frontend**: Next.js (React)
- **UI**: shadcn/ui
- **Database**: PostgreSQL
- **AI**: Google Gemini

## Prerequisites

- Docker & Docker Compose
- Node.js (v18+)
- Python (v3.10+)
- Google Gemini API Key

## Setup & Running

### 1. Environment Variables

Create a `.env` file in the root directory (if not already present) and add your Gemini API Key:

```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=goal_breaker
DATABASE_URL=postgresql://user:password@db:5432/goal_breaker
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Start the Database

Use Docker Compose to start the PostgreSQL database:

```bash
docker compose up -d db
```

### 3. Backend

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment and install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Run the backend server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 4. Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Testing

To run the backend tests:

```bash
cd backend
source .venv/bin/activate
pip install pytest httpx
python -m pytest
```

import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    # We might be in a test environment or build phase where the key isn't
    # needed immediately, but for the app to work it is required.
    print("Warning: GEMINI_API_KEY is not set.")


def configure_genai():
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)


configure_genai()


def generate_subtasks(goal_description: str) -> List[Dict[str, Any]]:
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set")

    model = genai.GenerativeModel('gemini-pro')

    prompt = f"""
    You are an expert project manager. Break down the following goal into\
    exactly 5 actionable sub-tasks.
    Goal: "{goal_description}"

    For each task, provide:
    1. A clear description.
    2. A complexity score from 1 to 10 (1 being easiest, 10 being hardest).

    Output strictly valid JSON in the following format:
    {{
        "tasks": [
            {{ "description": "Task 1 description", "complexity_score": 5 }},
            {{ "description": "Task 2 description", "complexity_score": 3 }},
            ...
        ]
    }}
    Do not include any markdown formatting (like ```json) or extra text.
    Just the JSON string.
    """

    try:
        response = model.generate_content(prompt)
        response_text = response.text

        # Clean up potential markdown code blocks if the model ignores the
        # instruction
        cleaned_text = response_text.strip()
        if cleaned_text.startswith("```json"):
            cleaned_text = cleaned_text[7:]
        elif cleaned_text.startswith("```"):
            cleaned_text = cleaned_text[3:]

        if cleaned_text.endswith("```"):
            cleaned_text = cleaned_text[:-3]

        data = json.loads(cleaned_text.strip())

        if "tasks" not in data:
            raise ValueError("Invalid JSON format: 'tasks' key missing.")

        if len(data["tasks"]) != 5:
            # In a production app, we might retry here.
            print(
                f"Warning: AI returned {len(data['tasks'])} tasks "
                "instead of 5."
            )

        return data["tasks"]

    except json.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        print(f"Raw response: {response.text}")
        raise ValueError("Failed to parse AI response as JSON.")
    except Exception as e:
        print(f"Error generating subtasks: {e}")
        raise e

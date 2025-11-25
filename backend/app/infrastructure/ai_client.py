import json
import google.generativeai as genai
from typing import List, Dict, Any
from app.core.config import settings
from app.core.templates.prompt_templates import GOAL_BREAKDOWN_PROMPT


class AIClient:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
        else:
            print("Warning: GEMINI_API_KEY is not set.")

    def generate_subtasks(self, goal_description: str) -> List[Dict[str, Any]]:
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set")

        model = genai.GenerativeModel(settings.GEMINI_MODEL_NAME)
        prompt = GOAL_BREAKDOWN_PROMPT.format(
            goal_description=goal_description
        )

        try:
            response = model.generate_content(prompt)
            response_text = response.text
            return self._parse_response(response_text)
        except Exception as e:
            print(f"Error generating subtasks: {e}")
            raise e

    def _parse_response(self, response_text: str) -> List[Dict[str, Any]]:
        try:
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

            return data["tasks"]
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")
            print(f"Raw response: {response_text}")
            raise ValueError("Failed to parse AI response as JSON.")

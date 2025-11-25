GOAL_BREAKDOWN_PROMPT = """
You are an expert project manager. Break down the following goal into exactly \
5 actionable sub-tasks.
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

from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def analyze_project(prompt, budget, timeline):

    system_prompt = f"""
You are an AI project planner.

A user provides:
- Project description
- Total budget
- Timeline

Your job:
1. Identify the project DOMAIN.
2. Break the project into logical milestones.
3. Divide the timeline across milestones.
4. Divide the budget across milestones.

IMPORTANT:
Return ONLY valid JSON.
Do NOT include markdown or explanation.

Return JSON exactly in this format:

{{
 "domain": "",
 "total_budget": {budget},
 "timeline": "{timeline}",
 "milestones": [
   {{
     "title": "",
     "description": "",
     "timeline": "",
     "budget_allocation": 0
   }}
 ]
}}

Project Description:
{prompt}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=system_prompt
    )

    return response.text
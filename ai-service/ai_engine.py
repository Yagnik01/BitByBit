from google import genai
import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def analyze_project(prompt, budget, timeline):
    """Generate project name, domain, tech stack and milestones."""
    system_prompt = f"""You are an expert software project planner.

A user provides:
- Project description
- Total budget (number)
- Timeline (string)

Your task:
1. Generate a concise PROJECT NAME (3-8 words).
2. Identify the primary DOMAIN.
3. List recommended TECH STACK as an array.
4. Break the project into 3-5 logical MILESTONES.
5. Distribute timeline and budget across milestones proportionally.

STRICT RULES:
- Return ONLY valid JSON — no markdown, no code fences, no explanation.
- Every number must be a plain number.
- budget_allocation values must sum to exactly {budget}.
- Use the exact JSON structure below.

{{
  "project_name": "",
  "domain": "",
  "total_budget": {budget},
  "timeline": "{timeline}",
  "tech_stack": [],
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


def verify_milestone(milestone_title, milestone_description, github_link, project_description, budget_allocation):
    """AI-verify a milestone submission and decide payment."""
    system_prompt = f"""You are an expert software project evaluator and code reviewer.

A freelancer has submitted work for a project milestone. Evaluate the submission.

PROJECT CONTEXT:
- Project Description: {project_description}

MILESTONE DETAILS:
- Title: {milestone_title}
- Description: {milestone_description}
- Budget Allocation: ${budget_allocation}
- GitHub Repository: {github_link}

YOUR TASK:
1. Evaluate whether the milestone title and description indicate completed work.
2. Consider the GitHub repository link as proof of submission.
3. Assign a completion score from 0-100.
4. Decide status: "approved" (score >= 70), "needs_revision" (40-69), or "rejected" (< 40).
5. Provide specific, actionable feedback.

SCORING GUIDE:
- 90-100: Exceptional work, all requirements met and exceeded
- 70-89: Good work, requirements met with minor issues
- 40-69: Partial completion, major revisions needed
- 0-39: Insufficient work, milestone not completed

STRICT RULES:
- Return ONLY valid JSON, no markdown, no explanation.
- Use this exact structure:

{{
  "score": 0,
  "status": "approved",
  "feedback": "Detailed feedback here",
  "payment_recommended": true
}}

Where payment_recommended is true only when status is "approved".
"""
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=system_prompt
    )
    return response.text

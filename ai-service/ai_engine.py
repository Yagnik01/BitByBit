from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def analyze_requirements(prompt):

    system_prompt = f"""
You are an AI project manager.

Convert the following project description into structured milestones.

Return JSON format:
{{
 "milestones":[
   {{
     "title":"",
     "description":"",
     "estimated_days":0
   }}
 ]
}}

Project:
{prompt}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=system_prompt
    )

    return response.text


def qa_verification(project_output):

    prompt = f"""
You are a software quality reviewer.

Evaluate the following work.

Return JSON:

{{
 "score":0-100,
 "issues":[],
 "feedback":""
}}

Work:
{project_output}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text
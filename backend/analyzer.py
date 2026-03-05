from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def analyze_with_gemini(raw_text: str) -> dict:
    prompt = f"""
You are a form analyzer assistant. Analyze the following form/document/webpage text and extract key information.

Return ONLY a valid JSON object with exactly these fields:
{{
  "title": "Name of the form or scheme",
  "summary": "One line description of what this form is about",
  "eligibility": ["criteria 1", "criteria 2", "criteria 3"],
  "documents_required": ["document 1", "document 2", "document 3"],
  "deadline": "Application deadline if mentioned, else null",
  "steps": ["step 1", "step 2", "step 3"],
  "warnings": ["warning 1", "warning 2"]
}}

Do not include any explanation, markdown, or extra text. Only return the JSON.

Form text:
{raw_text}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        text = response.choices[0].message.content.strip()

        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]

        return json.loads(text)

    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}
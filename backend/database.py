import os
from supabase import create_client
from dotenv import load_dotenv
import json

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_ANON_KEY")
)

async def save_analysis(
    input_type: str,
    input_url: str,
    input_filename: str,
    raw_text: str,
    result: dict,
    user_id: str = None
):
    try:
        data = {
            "input_type": input_type,
            "input_url": input_url,
            "input_filename": input_filename,
            "raw_text": raw_text[:500],
            "title": result.get("title"),
            "summary": result.get("summary"),
            "eligibility": json.dumps(result.get("eligibility", [])),
            "documents_required": json.dumps(result.get("documents_required", [])),
            "deadline": result.get("deadline"),
            "steps": json.dumps(result.get("steps", [])),
            "warnings": json.dumps(result.get("warnings", [])),
        }
        if user_id:
            data["user_id"] = user_id

        response = supabase.table("analyses").insert(data).execute()
        print("Supabase response:", response)

    except Exception as e:
        print(f"Database save error: {str(e)}")
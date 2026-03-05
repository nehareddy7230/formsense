from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn

from scraper import scrape_url
from extractor import extract_text_from_file
from analyzer import analyze_with_gemini
from database import save_analysis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    url: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    user_id: Optional[str] = Form(None)
):
    raw_text = ""
    input_type = ""
    input_filename = ""

    if url:
        input_type = "url"
        raw_text = await scrape_url(url)
    elif file:
        input_type = "document"
        input_filename = file.filename
        contents = await file.read()
        raw_text = extract_text_from_file(contents, file.filename)
    elif text:
        input_type = "text"
        raw_text = text

    if not raw_text:
        return {"error": "Could not extract text"}

    result = await analyze_with_gemini(raw_text)
    await save_analysis(input_type, url, input_filename, raw_text, result, user_id)

    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
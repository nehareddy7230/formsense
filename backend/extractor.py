import fitz  # PyMuPDF
from docx import Document
import io

def extract_text_from_file(contents: bytes, filename: str) -> str:
    try:
        ext = filename.lower().split(".")[-1]

        # PDF
        if ext == "pdf":
            pdf = fitz.open(stream=contents, filetype="pdf")
            text = ""
            for page in pdf:
                text += page.get_text()
            return text[:8000]

        # Word document
        elif ext in ["docx", "doc"]:
            doc = Document(io.BytesIO(contents))
            text = "\n".join([para.text for para in doc.paragraphs])
            return text[:8000]

        # Plain text
        elif ext == "txt":
            return contents.decode("utf-8")[:8000]

        else:
            return "Unsupported file type"

    except Exception as e:
        return f"Error extracting file: {str(e)}"
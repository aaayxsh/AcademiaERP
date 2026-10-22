import time
import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from analyzer import analyze_stylometry
from extractors import extract_text_from_pdf, extract_text_from_docx

app = FastAPI(
    title="AcademiaERP AI Validation Microservice",
    description="CPU-friendly stylometric & statistical assignment text analysis service",
    version="1.2.0"
)

# Enable CORS for backend and local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextAnalysisRequest(BaseModel):
    submissionId: Optional[str] = "direct-input"
    text: str

@app.get("/")
def root():
    return {
        "service": "AcademiaERP AI-Assisted Validation Microservice",
        "status": "online",
        "methodology": "CPU-friendly stylometric NLP, Shannon entropy, and sentence burstiness",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "1.2.0",
        "engine": "stylometry-nlp-v1.2",
        "capabilities": ["pdf-extract", "docx-extract", "entropy-profiling", "burstiness-analysis"]
    }

@app.post("/analyze/text")
def analyze_raw_text(request: TextAnalysisRequest):
    start_time = time.time()
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text body cannot be empty.")
    
    result = analyze_stylometry(request.text)
    processing_time_ms = int((time.time() - start_time) * 1000)
    
    return {
        "submissionId": request.submissionId,
        "processingTimeMs": processing_time_ms,
        "modelVersion": "stylometry-nlp-v1.2",
        **result
    }

@app.post("/analyze/file")
async def analyze_file(
    file: UploadFile = File(...),
    submissionId: Optional[str] = Form("file-upload")
):
    start_time = time.time()
    filename = file.filename or "unknown.pdf"
    content_type = file.content_type or ""
    file_bytes = await file.read()
    
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")
    
    extracted_text = ""
    extract_error = None
    
    if filename.lower().endswith(".pdf") or "pdf" in content_type:
        extracted_text, extract_error = extract_text_from_pdf(file_bytes)
    elif filename.lower().endswith(".docx") or "officedocument" in content_type:
        extracted_text, extract_error = extract_text_from_docx(file_bytes)
    else:
        # Try raw UTF-8 decode
        try:
            extracted_text = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")

    if extract_error:
        processing_time_ms = int((time.time() - start_time) * 1000)
        return {
            "submissionId": submissionId,
            "status": "FAILED",
            "error": extract_error,
            "aiLikelihoodScore": 0.0,
            "confidence": "LOW",
            "disclaimer": "Failed to extract readable text. Manual faculty review required.",
            "processingTimeMs": processing_time_ms,
            "modelVersion": "stylometry-nlp-v1.2"
        }

    analysis = analyze_stylometry(extracted_text)
    processing_time_ms = int((time.time() - start_time) * 1000)

    return {
        "submissionId": submissionId,
        "originalFileName": filename,
        "processingTimeMs": processing_time_ms,
        "modelVersion": "stylometry-nlp-v1.2",
        **analysis
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

# type: ignore
from fastapi import FastAPI, HTTPException, UploadFile, File  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from pydantic import BaseModel  # type: ignore
from typing import List, Optional
import re
import os
import tempfile
from pathlib import Path
from resume_parser import ResumeParser  # type: ignore

app = FastAPI(title="SkillMatch Matching Service", version="1.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize resume parser
SKILLS_JSON_PATH = Path(__file__).parent / "skills.json"
resume_parser = ResumeParser(str(SKILLS_JSON_PATH))

class ScoreRequest(BaseModel):
    resume_text: str
    job_description: str
    custom_keywords: Optional[List[str]] = None

class ScoreResponse(BaseModel):
    score: float
    matched_skills: List[str]
    missing_skills: List[str]
    breakdown: dict

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse resume PDF and extract structured information
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Check file size (max 10MB)
    content: bytes = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit")
    
    # Save to temporary file
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf', mode='wb') as tmp_file:
            tmp_file.write(content)  # type: ignore
            tmp_path = tmp_file.name
        
        # Parse the resume
        result = resume_parser.parse_resume(tmp_path)
        
        # Clean up
        os.unlink(tmp_path)
        
        return result
    
    except Exception as e:
        # Clean up on error
        if 'tmp_path' in locals():
            try:
                os.unlink(tmp_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@app.post("/score", response_model=ScoreResponse)
async def calculate_score(request: ScoreRequest):
    # V1: Keyword matching + basic weights
    default_skills = ["react", "nodejs", "typescript", "python", "aws", "docker", "kubernetes", "sql", "postgresql", "redis", "nextjs", "nestjs", "fastapi"]
    skills_to_check = request.custom_keywords or default_skills
    
    resume_lower = request.resume_text.lower()
    jd_lower = request.job_description.lower()
    
    matched = []
    missing = []
    
    # Simple keyword detection
    for skill in skills_to_check:
        pattern = rf"\b{re.escape(skill.lower())}\b"
        in_resume = bool(re.search(pattern, resume_lower))
        in_jd = bool(re.search(pattern, jd_lower))
        
        if in_jd:
            if in_resume:
                matched.append(skill)
            else:
                missing.append(skill)
    
    # Calculate score
    jd_skills_count = len(matched) + len(missing)
    score: float = (len(matched) / jd_skills_count * 100) if jd_skills_count > 0 else 0.0
    
    return {
        "score": float(f"{score:.2f}"),
        "matched_skills": matched,
        "missing_skills": missing,
        "breakdown": {
            "keyword_match": score,
            "bonus": 0
        }
    }

if __name__ == "__main__":
    import uvicorn  # type: ignore
    uvicorn.run(app, host="0.0.0.0", port=8000)

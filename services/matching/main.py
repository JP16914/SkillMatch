from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import re

app = FastAPI(title="SkillMatch Matching Service", version="1.0")

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

@app.post("/score", response_model=ScoreResponse)
async def calculate_score(request: ScoreRequest):
    # V1: Keyword matching + basic weights
    default_skills = ["react", "nodejs", "typescript", "python", "aws", "docker", "kubernetes", "sql", "postgresql", "redis", "nextjs", "nestjs", "fastapi"]
    skills_to_check = request.custom_keywords if request.custom_keywords else default_skills
    
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
    score = (len(matched) / jd_skills_count * 100) if jd_skills_count > 0 else 0
    
    return {
        "score": round(score, 2),
        "matched_skills": matched,
        "missing_skills": missing,
        "breakdown": {
            "keyword_match": score,
            "bonus": 0
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

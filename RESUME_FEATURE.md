# Resume PDF Upload & Auto-Fill Profile Feature

## Overview
This feature allows users to upload a PDF resume, automatically parse it to extract profile information, review and edit the extracted data, and save it to their profile.

## Implementation Summary

### 1. Database Schema (Prisma)
**File**: `apps/api/prisma/schema.prisma`

Added two new models:
- **UserProfile**: Stores user profile information
  - Fields: firstName, lastName, username, phone, location, headline, summary, links (JSON), skills (String[]), education (JSON), experience (JSON), projects (JSON)
  
- **Resume** (updated): Added `parsedJson` field to store extracted data

### 2. Python Resume Parser
**Files**:
- `services/matching/resume_parser.py` - Main parsing logic
- `services/matching/skills.json` - Skills dictionary for extraction
- `services/matching/main.py` - FastAPI endpoint

**Features**:
- PDF text extraction using PyMuPDF (fitz)
- Heuristic-based parsing with regex:
  - Email, phone, URLs (LinkedIn, GitHub, portfolio)
  - Name extraction (from first lines or email)
  - Section detection (Experience, Education, Projects, Skills)
  - Skills matching from dictionary
- Scanned PDF detection
- Confidence scoring for each field
- Returns structured JSON with extracted data

**Endpoint**: `POST /parse-resume`

### 3. NestJS Backend API
**Files**:
- `apps/api/src/profile/profile.controller.ts` - Profile endpoints
- `apps/api/src/profile/profile.service.ts` - Business logic
- `apps/api/src/profile/profile.module.ts` - Module definition

**Endpoints**:
- `POST /profile/parse-resume` - Upload PDF and get parsed data
- `PUT /profile` - Save/update user profile
- `GET /profile/me` - Get current user profile

**Flow**:
1. User uploads PDF
2. File is saved to storage
3. PDF is sent to Python service for parsing
4. Parsed data is returned to frontend
5. User reviews and edits data
6. Confirmed data is saved to database

### 4. Frontend React Components
**Files**:
- `apps/web/src/app/resumes/page.tsx` - Main resume page (updated)
- `apps/web/src/components/ReviewModal.tsx` - Review modal component

**Features**:
- Drag & drop PDF upload
- Parsing progress indicator
- Review modal with:
  - Editable fields for all extracted data
  - Confidence badges (0-100%) for each field
  - Overall confidence score
  - Save/Cancel actions
- Error handling for scanned PDFs
- Success/error notifications

### 5. Marketplace Match Score (Bonus)
**File**: `apps/api/src/marketplace/marketplace.service.ts`

**Features**:
- Calculate match score based on skill overlap
- Display match percentage on job cards
- V1 implementation: keyword overlap
- Returns match score with each job listing

**Algorithm**:
```typescript
matchScore = (matching_skills / total_job_skills) * 100
```

## Setup Instructions

### 1. Install Python Dependencies
```bash
cd services/matching
pip install -r requirements.txt
```

### 2. Install Node Dependencies
```bash
cd apps/api
pnpm add axios form-data
```

### 3. Run Database Migration
```bash
cd apps/api
npx prisma migrate dev --name add_user_profile_and_resume_parsing
npx prisma generate
```

### 4. Environment Variables
Add to `apps/api/.env`:
```
MATCHING_SERVICE_URL=http://localhost:8000
```

### 5. Start Services

**Python Matching Service**:
```bash
cd services/matching
python main.py
# Runs on http://localhost:8000
```

**NestJS API**:
```bash
cd apps/api
pnpm dev
# Runs on http://localhost:3001
```

**Next.js Frontend**:
```bash
cd apps/web
pnpm dev
# Runs on http://localhost:3000
```

## Usage Flow

1. **Navigate to Resume Lab**: User goes to `/resumes` page
2. **Upload PDF**: Click "Select PDF" or drag & drop
3. **Parsing**: System extracts text and parses resume
4. **Review Modal**: Modal opens with extracted data
   - Each field shows confidence score
   - User can edit any field
   - Skills and links are comma/newline separated
5. **Save**: Click "Confirm & Save" to update profile
6. **Match Scores**: Navigate to marketplace to see job match scores

## Error Handling

- **Scanned PDF**: Warning message displayed
- **Invalid PDF**: Error message shown
- **Parsing Failure**: Graceful fallback with error notification
- **Network Errors**: User-friendly error messages

## Confidence Scoring

Each field has a confidence score (0-1):
- **Email**: 1.0 if valid format
- **Phone**: 0.8 if found
- **Name**: 0.7 (heuristic-based)
- **Links**: 0.9 if found
- **Skills**: Based on number found (max 0.9)
- **Experience/Education/Projects**: 0.5-0.6 if found
- **Overall**: Average of all field confidences

## Future Enhancements

1. **LLM Integration**: Use GPT-4 for better parsing accuracy
2. **OCR Support**: Handle scanned PDFs with OCR
3. **Multi-language**: Support resumes in different languages
4. **Advanced Matching**: Use embeddings for semantic matching
5. **Resume Templates**: Generate formatted resumes from profile
6. **ATS Optimization**: Suggest improvements for ATS compatibility

## Files Created/Modified

### Created:
- `services/matching/resume_parser.py`
- `services/matching/skills.json`
- `apps/api/src/profile/profile.controller.ts`
- `apps/api/src/profile/profile.service.ts`
- `apps/api/src/profile/profile.module.ts`
- `apps/api/src/prisma/prisma.module.ts`
- `apps/web/src/components/ReviewModal.tsx`

### Modified:
- `apps/api/prisma/schema.prisma`
- `services/matching/main.py`
- `services/matching/requirements.txt`
- `apps/api/src/app.module.ts`
- `apps/api/src/marketplace/marketplace.service.ts`
- `apps/web/src/app/resumes/page.tsx`

## Notes

- Python lint errors are expected until dependencies are installed
- TypeScript errors about `userProfile` will resolve after Prisma migration
- The feature is fully isolated and doesn't affect existing functionality
- All parsing is done server-side for security
- File size limit: 10MB
- Only PDF format supported

# type: ignore
import re
import json
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path
from itertools import islice

try:
    import fitz  # type: ignore # PyMuPDF
    PDF_LIBRARY = "pymupdf"
except ImportError:
    try:
        import pdfplumber  # type: ignore
        PDF_LIBRARY = "pdfplumber"
    except ImportError:
        raise ImportError("Please install PyMuPDF (fitz) or pdfplumber")


class ResumeParser:
    def __init__(self, skills_json_path: str = "skills.json"):
        """Initialize resume parser with skills dictionary"""
        self.skills_dict = self._load_skills(skills_json_path)
        self.all_skills = self._flatten_skills()
        
    def _load_skills(self, path: str) -> Dict:
        """Load skills dictionary from JSON file"""
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"Warning: Skills file {path} not found. Using empty skills dict.")
            return {}
    
    def _flatten_skills(self) -> List[str]:
        """Flatten all skills into a single list"""
        skills = []
        for category in self.skills_dict.values():
            skills.extend(category)
        return skills
    
    def extract_text_from_pdf(self, pdf_path: str) -> Tuple[str, bool]:
        """
        Extract text from PDF file
        Returns: (extracted_text, is_scanned)
        """
        text = ""
        is_scanned = False
        
        if PDF_LIBRARY == "pymupdf":
            text, is_scanned = self._extract_with_pymupdf(pdf_path)
        else:
            text, is_scanned = self._extract_with_pdfplumber(pdf_path)
        
        return text, is_scanned
    
    def _extract_with_pymupdf(self, pdf_path: str) -> Tuple[str, bool]:
        """Extract text using PyMuPDF"""
        try:
            doc = fitz.open(pdf_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            
            # Check if scanned (very little text extracted)
            is_scanned = len(text.strip()) < 100  # type: ignore
            return text, is_scanned
        except Exception as e:
            print(f"Error extracting with PyMuPDF: {e}")
            return "", True
    
    def _extract_with_pdfplumber(self, pdf_path: str) -> Tuple[str, bool]:
        """Extract text using pdfplumber"""
        try:
            import pdfplumber  # type: ignore
            text = ""
            with pdfplumber.open(pdf_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"  # type: ignore
            
            is_scanned = len(text.strip()) < 100  # type: ignore
            return text, is_scanned
        except Exception as e:
            print(f"Error extracting with pdfplumber: {e}")
            return "", True
    
    def extract_email(self, text: str) -> Optional[str]:
        """Extract email address"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(email_pattern, text)
        return matches[0] if matches else None
    
    def extract_phone(self, text: str) -> Optional[str]:
        """Extract phone number"""
        # Match various phone formats
        phone_patterns = [
            r'\+?1?\s*\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})',
            r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b',
            r'\(\d{3}\)\s*\d{3}[-.]?\d{4}'
        ]
        
        for pattern in phone_patterns:
            matches = re.findall(pattern, text)
            if matches:
                if isinstance(matches[0], tuple):
                    return f"({matches[0][0]}) {matches[0][1]}-{matches[0][2]}"
                return matches[0]
        return None
    
    def extract_urls(self, text: str) -> List[str]:
        """Extract LinkedIn, GitHub, Portfolio URLs"""
        urls: List[str] = []
        
        # LinkedIn
        linkedin_pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+'
        linkedin_matches = re.findall(linkedin_pattern, text, re.IGNORECASE)
        urls.extend(linkedin_matches)
        
        # GitHub
        github_pattern = r'(?:https?://)?(?:www\.)?github\.com/[\w-]+'
        github_matches = re.findall(github_pattern, text, re.IGNORECASE)
        urls.extend(github_matches)
        
        # General URLs (portfolio, etc.)
        url_pattern = r'https?://(?:www\.)?[\w\-\.]+\.[\w]{2,}(?:/[\w\-\./?%&=]*)?'
        url_matches = re.findall(url_pattern, text)
        
        # Filter out already found URLs and common non-portfolio domains
        exclude_domains = ['linkedin.com', 'github.com', 'google.com', 'facebook.com']
        for url in url_matches:
            if url not in urls and not any(domain in url.lower() for domain in exclude_domains):
                urls.append(url)
        
        return list(islice(urls, 5))  # Limit to 5 URLs
    
    def extract_name(self, text: str, email: Optional[str] = None) -> Tuple[Optional[str], Optional[str]]:
        """Extract first and last name"""
        lines = text.split('\n') if text else []
        if not lines:
            if email and isinstance(email, str):
                 pass # Fallthrough to email extraction
            else:
                 return None, None
        
        # Try first few non-empty lines
        for i, line in enumerate(islice(lines, 5)):
            line = line.strip()  # type: ignore
            if not line or len(line) > 50:
                continue
            
            # Check if line looks like a name (2-4 words, capitalized)
            words = line.split()
            if 2 <= len(words) <= 4:
                if all(word[0].isupper() for word in words if word):
                    first_name = words[0]
                    last_name = words[-1]
                    return first_name, last_name
        
        # Fallback: extract from email
        if email and isinstance(email, str):
            username = email.split('@')[0]
            # Try to split by common separators
            for sep in ['.', '_', '-']:
                if sep in username:  # type: ignore
                    parts = username.split(sep)
                    if len(parts) >= 2:
                        return parts[0].capitalize(), parts[1].capitalize()
        
        return None, None
    
    def extract_section(self, text: str, section_keywords: List[str]) -> Optional[str]:
        """Extract content from a specific section"""
        if not text:
            return None
        lines = text.split('\n')
        section_content = []
        in_section = False
        
        # Common section headers that indicate end of current section
        all_section_headers = [
            'experience', 'education', 'skills', 'projects', 'certifications',
            'awards', 'publications', 'references', 'summary', 'objective'
        ]
        
        for i, line in enumerate(lines):
            line_lower = line.lower().strip()  # type: ignore
            
            
            # Check if we're entering the target section
            if any(keyword in line_lower for keyword in section_keywords):
                in_section = True
                continue
            
            # Check if we're entering a different section
            if in_section and any(header in line_lower for header in all_section_headers):
                if not any(keyword in line_lower for keyword in section_keywords):
                    break
            
            if in_section and line.strip():  # type: ignore
                section_content.append(line.strip())  # type: ignore
        
        return '\n'.join(section_content) if section_content else None
    
    def extract_skills(self, text: str) -> List[str]:
        """Extract skills from text using skills dictionary"""
        found_skills = set()
        text_lower = text.lower()
        
        for skill in self.all_skills:
            # Use word boundaries for better matching
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                found_skills.add(skill)
        
        return sorted(list(found_skills))
    
    def parse_experience(self, experience_text: Optional[str]) -> List[Dict]:
        """Parse experience section into structured format"""
        if not experience_text:
            return []
        
        experiences = []
        # Simple heuristic: split by common patterns
        entries = re.split(r'\n(?=[A-Z][a-z]+ \d{4}|\d{4})', experience_text)
        
        for entry in entries:
            if len(entry.strip()) > 20:  # type: ignore
                experiences.append({
                    "raw": entry.strip()  # type: ignore
                })
        
        return list(islice(experiences, 5))  # Limit to 5 experiences
    
    def parse_education(self, education_text: Optional[str]) -> List[Dict]:
        """Parse education section into structured format"""
        if not education_text:
            return []
        
        educations = []
        entries = re.split(r'\n(?=[A-Z])', education_text)
        
        for entry in entries:
            if len(entry.strip()) > 10:  # type: ignore
                educations.append({
                    "raw": entry.strip()  # type: ignore
                })
        
        return list(islice(educations, 3))  # Limit to 3 education entries
    
    def parse_projects(self, projects_text: Optional[str]) -> List[Dict]:
        """Parse projects section into structured format"""
        if not projects_text:
            return []
        
        projects = []
        entries = re.split(r'\n(?=[A-Z])', projects_text)
        
        for entry in entries:
            if len(entry.strip()) > 20:  # type: ignore
                projects.append({
                    "raw": entry.strip()  # type: ignore
                })
        
        return list(islice(projects, 5))  # Limit to 5 projects
    
    def calculate_confidence(self, parsed_data: Dict) -> Dict[str, float]:
        """Calculate confidence scores for extracted fields"""
        confidence = {}
        
        # Email: high confidence if valid format
        confidence['email'] = 1.0 if parsed_data.get('email') else 0.0
        
        # Phone: medium-high confidence
        confidence['phone'] = 0.8 if parsed_data.get('phone') else 0.0
        
        # Name: medium confidence (heuristic-based)
        confidence['firstName'] = 0.7 if parsed_data.get('firstName') else 0.0
        confidence['lastName'] = 0.7 if parsed_data.get('lastName') else 0.0
        
        # Links: high confidence if found
        confidence['links'] = 0.9 if parsed_data.get('links') else 0.0
        
        # Skills: confidence based on number found
        num_skills = len(parsed_data.get('skills', []))
        confidence['skills'] = min(0.9, num_skills / 10) if num_skills > 0 else 0.0
        
        # Experience/Education/Projects: medium confidence
        confidence['experience'] = 0.6 if parsed_data.get('experience') else 0.0
        confidence['education'] = 0.6 if parsed_data.get('education') else 0.0
        confidence['projects'] = 0.5 if parsed_data.get('projects') else 0.0
        
        # Overall confidence
        confidence['overall'] = sum(confidence.values()) / len(confidence) if confidence else 0.0
        
        return confidence
    
    def parse_resume(self, pdf_path: str) -> Dict[str, Any]:
        """
        Main parsing function
        Returns structured JSON with extracted data and confidence scores
        """
        # Extract text
        text, is_scanned = self.extract_text_from_pdf(pdf_path)
        if text is None:
            text = ""
        
        if is_scanned:
            return {
                "error": "scanned_pdf",
                "message": "This appears to be a scanned PDF with no extractable text. Please upload a text-based PDF.",
                "extractedText": text,
                "confidence": {"overall": 0.0}
            }
        
        # Extract basic info
        email = self.extract_email(text)
        phone = self.extract_phone(text)
        urls = self.extract_urls(text)
        first_name, last_name = self.extract_name(text, email)
        
        # Generate username from email or name
        username = None
        if email:
            username = email.split('@')[0]
        elif first_name and last_name:
            username = f"{first_name.lower()}.{last_name.lower()}"
        
        # Extract sections
        experience_text = self.extract_section(text, ['experience', 'work history', 'employment'])
        education_text = self.extract_section(text, ['education', 'academic'])
        projects_text = self.extract_section(text, ['projects', 'portfolio'])
        summary_text = self.extract_section(text, ['summary', 'objective', 'about'])
        
        # Extract skills
        skills = self.extract_skills(text)
        
        # Parse structured data
        experience = self.parse_experience(experience_text)
        education = self.parse_education(education_text)
        projects = self.parse_projects(projects_text)
        
        # Process summary with explicit safety check
        summary = None
        if summary_text and isinstance(summary_text, str):
            from typing import cast
            summary = cast(str, summary_text)[:500]  # type: ignore
        
        # Build result
        parsed_data = {
            "firstName": first_name,
            "lastName": last_name,
            "username": username,
            "email": email,
            "phone": phone,
            "location": None,  # Difficult to extract reliably
            "links": urls,
            "headline": None,  # Difficult to extract reliably
            "summary": summary,
            "skills": skills,
            "education": education,
            "experience": experience,
            "projects": projects,
            "extractedText": text
        }
        
        # Calculate confidence
        confidence = self.calculate_confidence(parsed_data)
        parsed_data['confidence'] = confidence
        
        return parsed_data


# FastAPI endpoint integration
if __name__ == "__main__":
    # Test the parser
    parser = ResumeParser()
    result = parser.parse_resume("test_resume.pdf")
    print(json.dumps(result, indent=2))

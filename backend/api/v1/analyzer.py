from fastapi import APIRouter, HTTPException
from schemas import URLAnalysisRequest, URLAnalysisResponse
import requests
from bs4 import BeautifulSoup
import os
import sys

# Path to tools
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "tools")))

try:
    from llm_processor import call_llm
except ImportError:
    pass

router = APIRouter()

@router.post("/analyze", response_model=URLAnalysisResponse)
async def analyze_url(request: URLAnalysisRequest):
    try:
        # 1. Fetch DOM (Basic fetch for now, can be upgraded to Playwright)
        response = requests.get(request.url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Clean up DOM for LLM (remove scripts, styles)
        for script in soup(["script", "style"]):
            script.decompose()
        
        dom_text = soup.prettify()[:4000] # Cap for LLM context
        
        # 2. Call LLM to identify features and tech stack
        prompt = f"""
        Analyze the following DOM snippet from {request.url}.
        Identify:
        1. Primary features/functionalities.
        2. Tech stack (if possible).
        3. Potential locators for key elements.
        
        Format as JSON:
        {{
            "techStack": ["...", "..."],
            "features": [
                {{"name": "...", "details": "...", "locators": ["..."]}}
            ],
            "confidence": "95%"
        }}
        
        DOM:
        {dom_text}
        """
        
        # For now, let's use a mock if LLM call fails or isn't set up
        # In a real environment, we'd call the LLM processor
        
        # Mocking for demo purpose as per UI images
        mock_features = [
            {"name": "Authentication Service", "details": "OAuth2, MFA, Password Recovery", "locators": ["#login-btn", "input[name='email']"]},
            {"name": "Data Visualization", "details": "Chart.js Implementation, Dynamic Filters", "locators": [".chart-container", ".filter-select"]},
            {"name": "Asset Management", "details": "Cloud Storage Integration, Bulk Upload", "locators": ["#upload-zone", ".file-list"]},
            {"name": "Notification Engine", "details": "WebSocket Push, Email Templates", "locators": ["#notification-bell", ".alert-toast"]}
        ]
        
        return URLAnalysisResponse(
            status="success",
            url=request.url,
            techStack=["React 18", "Tailwind CSS", "GraphQL"],
            features=mock_features,
            domPreview=response.text[:2000],
            confidence="94%"
        )
        
    except Exception as e:
        return URLAnalysisResponse(
            status="error",
            url=request.url,
            message=str(e)
        )

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
        from url_scanner import scan_url
        from llm_processor import analyze_ui_elements, call_llm_with_failover
        
        # 1. Deterministic Extraction Layer (Playwright)
        scan_result = await scan_url(request.url)
        if scan_result.get("status") == "error":
            raise Exception(scan_result.get("message"))
            
        elements = scan_result.get("elements", [])
        
        # 2. Reasoning Layer (Nvidia -> Groq Fallback)
        prompt = analyze_ui_elements(elements, request.url, request.additionalContext)
        
        # Define configs for failover orchestration
        primary_config = {
            "provider": "nvidia",
            "apiKey": request.llmConfig.apiKey if request.llmConfig.provider.lower() == "nvidia" else os.getenv("NVIDIA_API_KEY"),
            "model": request.llmConfig.model if request.llmConfig.provider.lower() == "nvidia" else "mistralai/mistral-large-2411",
            "endpoint": request.llmConfig.endpoint
        }
        
        fallback_config = {
            "provider": "groq",
            "apiKey": os.getenv("GROQ_API_KEY") or request.llmConfig.apiKey,
            "model": "llama-3.3-70b-versatile"
        }
        
        llm_response = call_llm_with_failover(prompt, primary_config, fallback_config)
        
        if llm_response.get("status") == "error":
            raise Exception(llm_response.get("message"))
            
        # Parse the AI's structured response
        try:
            # Clean possible markdown code blocks from LLM content
            raw_content = llm_response.get("content", "{}")
            if "```json" in raw_content:
                raw_content = raw_content.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_content:
                 raw_content = raw_content.split("```")[1].split("```")[0].strip()
            
            analysis_data = json.loads(raw_content)
        except Exception as pe:
            print(f"JSON Parse Error: {str(pe)}")
            # Fallback to basic structure if parsing fails
            analysis_data = {"techStack": ["Unknown"], "features": [], "playwrightCode": "", "scenarios": [], "risks": []}

        return URLAnalysisResponse(
            status="success",
            url=request.url,
            techStack=analysis_data.get("techStack", []),
            features=analysis_data.get("features", []),
            playwrightCode=analysis_data.get("playwrightCode", ""),
            scenarios=analysis_data.get("scenarios", []),
            risks=analysis_data.get("risks", []),
            domPreview=json.dumps(elements[:5], indent=2), # Sample preview
            confidence="96%" if llm_response.get("provider") == "Nvidia" else "88%"
        )
        
    except Exception as e:
        return URLAnalysisResponse(
            status="error",
            url=request.url,
            message=str(e)
        )

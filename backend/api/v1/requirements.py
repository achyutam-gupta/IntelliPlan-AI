from fastapi import APIRouter, HTTPException
from schemas import RequirementAnalysisRequest, AnalysisResponse
import sys
import os

# Add tools to path to reuse existing logic
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "tools")))

try:
    from jira_fetcher import fetch_feature_details
    from llm_processor import generate_test_plan_content
except ImportError:
    # Handle if pathing is different in specific environments
    pass

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_requirement(request: RequirementAnalysisRequest):
    # 1. Fetch Jira Ticket
    jira_res = fetch_feature_details(
        url=request.jiraConfig.url,
        credentials=request.jiraConfig.credentials,
        ticket_id=request.jiraConfig.ticketId
    )
    
    if jira_res["status"] == "error":
        return AnalysisResponse(status="error", message=jira_res["message"])
    
    # 2. Process with LLM
    llm_res = generate_test_plan_content(
        provider=request.llmConfig.provider,
        endpoint=request.llmConfig.endpoint or "",
        api_key=request.llmConfig.apiKey,
        model=request.llmConfig.model,
        feature_data=jira_res["ticketDetails"],
        additional_context=request.additionalContext
    )
    
    if llm_res["status"] == "error":
        return AnalysisResponse(
            status="partial_success", 
            ticketDetails=jira_res["ticketDetails"],
            message=f"Jira fetched but LLM failed: {llm_res['message']}"
        )
    
    return AnalysisResponse(
        status="success",
        ticketDetails=jira_res["ticketDetails"],
        aiGeneratedContent=llm_res["content"]
    )

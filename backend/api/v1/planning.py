from fastapi import APIRouter
from backend.schemas import TestPlanRequest, TestPlanResponse
import sys
import os
import json

# Add tools to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "tools")))

try:
    from llm_processor import generate_test_plan_content
except ImportError:
    pass

router = APIRouter()

@router.post("/generate", response_model=TestPlanResponse)
async def generate_test_plan(request: TestPlanRequest):
    # Construct a specific prompt for the Planning Engine
    prompt_context = f"""
    SYSTEM ROLE: You are a Principal QA Architect.
    TASK: Generate a high-fidelity Test Plan from the following requirements.
    
    REQUIREMENTS:
    {request.requirementText}
    
    EXPECTED JSON STRUCTURE:
    The response MUST be a JSON object containing:
    1. "meta": {{ "planTitle": "...", "strategy": "...", "estimation": {{"hours": "...", "resources": "..."}}, "coveragePrediction": "..." }}
    2. "test_plan": {{ 
        "scope": "...", 
        "objectives": ["..."], 
        "test_items": ["..."], 
        "test_types": ["..."], 
        "test_strategy": "...", 
        "environment": "...", 
        "entry_criteria": ["..."], 
        "exit_criteria": ["..."], 
        "risks": ["..."], 
        "mitigation": ["..."] 
    }}
    3. "user_stories": [
        {{ "id": "US-01", "title": "...", "description": "...", "actor": "...", "acceptance_criteria": ["..."] }}
    ]
    4. "markdown": "A well-formatted Markdown version of the full test plan."

    STRICT: Return ONLY the raw JSON object. Use double quotes for keys/strings.
    
    CONTEXT: {request.additionalContext}
    """

    res = generate_test_plan_content(
        provider=request.llmConfig.provider,
        endpoint=request.llmConfig.endpoint or "",
        api_key=request.llmConfig.apiKey,
        model=request.llmConfig.model,
        feature_data={"id": "PLAN-ENG", "title": "Planning Workload", "description": request.requirementText},
        additional_context=prompt_context
    )

    if res["status"] == "error":
        return TestPlanResponse(
            status="error",
            planTitle="Error",
            strategy="N/A",
            estimation={},
            coveragePrediction="0%",
            content="",
            message=res["message"]
        )

    full_content = res["content"]
    try:
        # Extract JSON from potential markdown wrappers
        json_str = full_content.strip()
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0].strip()
        elif "```" in json_str:
            json_str = json_str.split("```")[1].split("```")[0].strip()
        
        data = json.loads(json_str)
        meta = data.get("meta", {})
        return TestPlanResponse(
            status="success",
            planTitle=meta.get("planTitle", "Generated Test Plan"),
            strategy=meta.get("strategy", "AI-Driven"),
            estimation=meta.get("estimation", {"hours": "TBD", "resources": "TBD"}),
            coveragePrediction=meta.get("coveragePrediction", "Analysis Pending"),
            content=data.get("markdown", full_content),
            testPlan=data.get("test_plan"),
            userStories=data.get("user_stories")
        )
    except Exception as e:
        print(f"Parsing error: {str(e)}")
        # Fallback if AI didn't follow JSON format perfectly
        return TestPlanResponse(
            status="success",
            planTitle="Generated Test Plan (Raw)",
            strategy="Analysis in content",
            estimation={"hours": "TBD", "resources": "TBD"},
            coveragePrediction="Review Markdown",
            content=full_content,
            message="AI response failed JSON validation. Parsing as raw text."
        )

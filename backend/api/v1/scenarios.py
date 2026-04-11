from fastapi import APIRouter
from schemas import ScenarioGenerationRequest, ScenarioResponse
import sys
import os
import json

# Add tools to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "tools")))

try:
    from llm_processor import generate_test_plan_content # Assuming it's a generic LLM caller
except ImportError:
    pass

router = APIRouter()

@router.post("/generate", response_model=ScenarioResponse)
async def generate_scenarios(request: ScenarioGenerationRequest):
    plan_json = json.dumps(request.planContext.get("test_plan", {}), indent=2)
    stories_json = json.dumps(request.planContext.get("user_stories", []), indent=2)
    
    prompt = f"""
    SYSTEM ROLE: You are a Senior QA Engineer.
    TASK: Generate comprehensive test scenarios based on the following Test Plan and User Stories.
    
    TEST PLAN:
    {plan_json}
    
    USER STORIES:
    {stories_json}
    
    STRICT INSTRUCTIONS:
    - Derive scenarios ONLY from the provided context.
    - Generate at least 3 scenarios per user story (1 Positive, 1 Negative, 1 Edge Case).
    - Base scenarios on ISTQB standards.
    - Return ONLY a JSON object with a "test_scenarios" array.
    
    JSON FORMAT:
    {{
      "test_scenarios": [
        {{
          "id": "TS-001",
          "title": "...",
          "user_story_id": "...",
          "type": "Positive | Negative | Edge",
          "description": "...",
          "test_conditions": [
            {{ "condition": "...", "expected_outcome": "..." }}
          ],
          "priority": "P0-P3",
          "severity": "Critical-Low"
        }}
      ]
    }}
    """

    res = generate_test_plan_content(
        provider=request.llmConfig.provider,
        endpoint=request.llmConfig.endpoint or "",
        api_key=request.llmConfig.apiKey,
        model=request.llmConfig.model,
        feature_data={"id": "SCENARIO-GEN", "title": "Scenario Generation"},
        additional_context=prompt
    )

    if res["status"] == "error":
        return ScenarioResponse(status="error", scenarios=[], message=res["message"])

    full_content = res["content"]
    try:
        json_str = full_content.strip()
        if "```json" in json_str:
            json_str = json_str.split("```json")[1].split("```")[0].strip()
        data = json.loads(json_str)
        return ScenarioResponse(
            status="success",
            scenarios=data.get("test_scenarios", []),
            rawOutput=full_content
        )
    except:
        return ScenarioResponse(
            status="error", 
            scenarios=[], 
            message="Failed to parse LLM response as JSON",
            rawOutput=full_content
        )

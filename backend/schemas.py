from pydantic import BaseModel
from typing import Optional, Dict, Any

class JiraConfigRequest(BaseModel):
    url: str
    credentials: str
    ticketId: str

class LLMConfigRequest(BaseModel):
    provider: str
    apiKey: str
    model: str
    endpoint: Optional[str] = None

class RequirementAnalysisRequest(BaseModel):
    jiraConfig: JiraConfigRequest
    llmConfig: LLMConfigRequest
    additionalContext: Optional[str] = ""

class AnalysisResponse(BaseModel):
    status: str
    ticketDetails: Optional[Dict[str, Any]] = None
    aiGeneratedContent: Optional[str] = None
    message: Optional[str] = None

class TestPlanRequest(BaseModel):
    requirementText: str
    jiraConfig: Optional[JiraConfigRequest] = None
    llmConfig: LLMConfigRequest
    additionalContext: Optional[str] = ""

class TestPlanResponse(BaseModel):
    status: str
    planTitle: str
    strategy: str
    estimation: Dict[str, str]
    coveragePrediction: str
    content: str # Full plan markdown
    testPlan: Optional[Dict[str, Any]] = None # ISTQB Structured Data
    userStories: Optional[list] = None # Derived User Stories
    message: Optional[str] = None

class ScenarioGenerationRequest(BaseModel):
    planContext: Dict[str, Any]
    llmConfig: LLMConfigRequest
    additionalContext: Optional[str] = ""

class ScenarioResponse(BaseModel):
    status: str
    scenarios: list
    rawOutput: Optional[str] = None
    message: Optional[str] = None

class URLAnalysisRequest(BaseModel):
    url: str
    llmConfig: LLMConfigRequest
    additionalContext: Optional[str] = ""

class URLAnalysisResponse(BaseModel):
    status: str
    url: str
    techStack: Optional[list] = []
    features: Optional[list] = []
    domPreview: Optional[str] = None
    confidence: Optional[str] = "90%"
    message: Optional[str] = None

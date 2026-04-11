import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure backend can be imported correctly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

load_dotenv()

from backend.api.v1.requirements import router as requirements_router
from backend.api.v1.planning import router as planning_router
from backend.api.v1.scenarios import router as scenarios_router
from backend.api.v1.analyzer import router as analyzer_router

app = FastAPI(title="IntelliPlan AI API", version="1.0.0")

app.include_router(requirements_router, prefix="/api/v1/requirements", tags=["Requirements"])
app.include_router(planning_router, prefix="/api/v1/planning", tags=["Planning"])
app.include_router(scenarios_router, prefix="/api/v1/scenarios", tags=["Scenarios"])
app.include_router(analyzer_router, prefix="/api/v1/analyzer", tags=["Analyzer"])

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "IntelliPlan AI API is live", "status": "operational"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

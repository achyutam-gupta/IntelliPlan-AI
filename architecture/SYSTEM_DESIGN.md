# IntelliPlan AI: System Design & Architecture

## 1. Vision
Build the "Cursor for QA" — a unified platform for the entire Software Testing Lifecycle (STLC), replacing fragmented tools with an AI-orchestrated environment.

## 2. High-Level Architecture
The system follows a **Modular Monolith** approach (transitionable to microservices) to balance development speed with scalability.

### Layers:
- **Presentation Layer (ui/)**: React 19 + Vite. A high-fidelity, dual-theme (Dark/Light) interface with split-pane workspaces and real-time logs.
- **API Layer (backend/)**: FastAPI (Python). Handles routing, business logic, and orchestration between modules.
- **AI Intelligence Layer**: LLM-driven decision engine (Groq, Ollama) for requirement analysis, test case generation, and flaky test prediction.
- **Execution Engine**: Containerized execution environment using Playwright and Selenium.
- **Data Layer**: 
  - **PostgreSQL**: Stores persistent data (Users, Requirements, Test Plans, Scenarios).
  - **Redis**: Handles real-time execution logs, queueing, and caching.

## 3. Modular Breakdown
1. **Requirement Intelligence Module**: Jira/ADO integration, AI-driven risk analysis, and Traceability Matrix generation.
2. **Test Planning Engine**: Strategy generation, effort estimation, and coverage modeling.
3. **Test Design Studio**: A Cursor-like editor for writing natural language test cases and auto-generating automation code.
4. **Environment Orchestrator**: Manages browser/device matrices and provisioning.
5. **Execution Engine**: Parallel execution, real-time log streaming, and CI/CD triggers.
6. **Analytics & Insights**: Post-execution reports, AI-driven RCA (Root Cause Analysis), and Release Readiness scores.

## 4. Technology Stack
| Category | Technology |
| :--- | :--- |
| **Frontend** | React, CSS (Vanilla), Vite |
| **Backend** | Python (FastAPI), Pydantic |
| **Database** | PostgreSQL, SQLAlchemy |
| **Caching/Queue** | Redis, Celery (for async tests) |
| **Automation** | Playwright, Selenium |
| **AI** | LLM (Groq, Ollama) |
| **Deployment** | Docker, Docker Compose |

## 5. Directory Structure
```text
IntelliPlan-AI/
├── architecture/      # Technical SOPs and Design Docs
├── backend/           # FastAPI application
├── ui/                # React application
├── database/          # Migrations and SQL schemas
├── tools/             # Standalone Python scripts (Atomic Deterministic Logic)
├── containers/        # Dockerfiles for execution agents
└── .env               # Unified environment configuration
```

## 6. Phase 1 Goals: System Design
- [x] High-level architectural mapping.
- [ ] Database schema definition.
- [ ] Backend boilerplate setup.

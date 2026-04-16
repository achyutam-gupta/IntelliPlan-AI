# IntelliPlan AI - Phased Release Strategy

To ensure a stable and progressive rollout of the IntelliPlan AI platform, we need to implement a structured versioning system alongside a phased release approach. This ensures testing is robust, user feedback is integrated continuously, and new features are added without breaking existing workflows.

## 1. Versioning System: Semantic Versioning (SemVer)

Adopt **Semantic Versioning (MAJOR.MINOR.PATCH)** for your project structure:
- **MAJOR (vX.0.0):** Incompatible or breaking changes (e.g., completely replacing GROQ with another LLM provider or revamping the database schema).
- **MINOR (v0.X.0):** Backwards-compatible new features (e.g., adding ADO or X-Ray integration when Jira is already working).
- **PATCH (v0.0.X):** Backwards-compatible bug fixes (e.g., fixing a UI glitch in the glassmorphism layout, API connection tweaks).

*Current State should be considered `v0.1.0` (Alpha/MVP).*

## 2. Git Branching Strategy

To manage phases safely, use a **three-tier branching strategy**:
1. `main` / `production`: Represents the stable, released platform. 
2. `staging` / `beta`: For final acceptance testing. Contains features merged from development.
3. `develop`: The active integration branch. Feature branches (`feat/jira-integration`, `fix/ui-layout`) merge here first.

## 3. Release Phases

### Phase 1: Minimal Viable Product (MVP) - (v0.5.0)
**Goal:** Deliver the core value proposition locally or to a limited user base.
- **Features Included:**
  - Standardized UI (Dark-themed, Glassmorphism).
  - Basic navigation and state persistence (`sessionStorage`).
  - Active LLM connection (Ollama/GROQ).
  - Jira API integration to fetch User Stories.
  - Basic Test Plan Generation (`.docx` export).
- **Milestone:** The system correctly pulls a ticket, uses the LLM to process it, and outputs a valid file.

### Phase 2: Beta Release & Expanded Integrations - (v0.8.0)
**Goal:** Expand functionality and deploy to an early-adopter environment.
- **Features Included:**
  - Robust exception handling (Connection limits, LLM timeouts, malformed Jira tickets).
  - Complete integration of ADO and X-Ray alongside Jira.
  - Introduction of "Test Scenarios" and "Test Case specifications" generation.
  - Basic database implementation for saving historical test generations.
- **Milestone:** End-to-end stability for 3+ data sources and reliable QA output formats.

### Phase 3: Commercial / Production V1 - (v1.0.0)
**Goal:** Public release ready for enterprise users.
- **Features Included:**
  - Complete "Project Settings" and "User Profile" UI.
  - User Authentication (Login, Role-based access).
  - Code Generation module fully tested.
  - UI/UX completely polished, responsive on all major desktop resolutions.
- **Milestone:** Application deployed to production cloud hosting (e.g., Vercel + AWS) with full security parameters.

### Phase 4: Multi-Tenant SaaS & Orchestration (v2.0.0+)
**Goal:** Scaling the platform for B2B or wide distribution.
- **Features Included:**
  - Multi-tenant cloud databases.
  - Vendor Marketplace modules.
  - Analytics and usage tracking.
  - Advanced orchestration, CI/CD pipeline hookups for auto-test creation.
- **Milestone:** A self-sustaining subscription product.

## 4. How to Start Immediately

1. **Tag your current commit:** Run `git tag -a v0.1.0 -m "Initial Alpha build"` and push it to track your baseline.
2. **Move to a `develop` branch:** Stop pushing directly to `main`. Use `git checkout -b develop`.
3. **Draft a Changelog:** Keep a `CHANGELOG.md` file charting what was added, changed, or fixed in each version increment.

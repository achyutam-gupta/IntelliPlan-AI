USER_STORY_SPEC.md
1. Executive Summary
Feature ID: {{SYSTEM_PREFIX}}-{{ID}}
Objective: {{One sentence: What is the primary problem we are solving?}}
Success Metric: {{e.g., Reduce latency by 20%, Increase CTR by 5%}}
2. The Interaction Logic (Job Story)
Standard "User Stories" are often too vague. We use the "Situation-Motivation-Expected Outcome" framework to ensure the AI understands the trigger.
SITUATION: When {{Context/User State}}...
MOTIVATION: I want to {{Action/Interaction}}...
EXPECTED OUTCOME: So that {{Clear, measurable result}}.
3. Strict Acceptance Criteria (AC)
The AI will use these to generate your Test Cases. Be explicit.
ID
Requirement
Logic/Constraint
AC_01
Functional
{{The system must [Action] when [Trigger]}}
AC_02
UI/State
{{Visual feedback/Shimmer/Loading state requirements}}
AC_03
Data/API
{{Required fields, status codes (200/400/500), or payload specs}}
AC_04
Privacy/Auth
{{Who can see this? What happens if the session expires?}}
4. Edge Case & "Blast Radius"
The "What-Ifs": {{What happens if the user double-taps? What if the background sync fails?}}
Backward Compatibility: How does this affect users on older versions of the app?
Negative Path: If the API returns a 403 Forbidden, the UI must show: {{Specific Error Message}}.
5. Technical Metadata (For Automation)
Feature Toggle: {{CONFIG_GATE_NAME}} (e.g., is_new_ui_enabled)
Logging: Must emit event {{EVENT_NAME}} with parameters {{LIST_PARAMS}}.
Platform: [ ] iOS [ ] Android [ ] Web [ ] Portal
6. QA "Test-Ready" Checklist
[ ] ACs are verifiable (No "user-friendly" or "fast" without metrics).
[ ] Design assets are linked.
[ ] Localization keys are defined.
[ ] "Kill Switch" logic defined (What happens if we have to turn this off in Prod?).
import json
import requests
from groq import Groq

def call_llm_with_failover(prompt, primary_config, fallback_config):
    """
    Orchestration Layer:
    Prioritizes NVIDIA (Primary) with automated failover to Groq.
    """
    # Attempt Primary (Nvidia/OpenAI-Compatible)
    try:
        # User defined Nvidia as primary
        if primary_config.get("provider", "").lower() == "nvidia":
            headers = {
                "Authorization": f"Bearer {primary_config.get('apiKey')}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": primary_config.get("model") or "mistralai/mistral-large-2411",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2
            }
            # Using a generic OpenAI-compatible endpoint for Nvidia
            endpoint = primary_config.get("endpoint") or "https://integrate.api.nvidia.com/v1/chat/completions"
            response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
            
            if response.status_code == 200:
                return {"status": "success", "content": response.json()['choices'][0]['message']['content'], "provider": "Nvidia"}
            else:
                print(f"Nvidia failed with status {response.status_code}. Falling back to Groq...")
    except Exception as e:
        print(f"Nvidia error: {str(e)}. Falling back to Groq...")

    # Fallback to Groq
    try:
        client = Groq(api_key=fallback_config.get("apiKey"))
        completion = client.chat.completions.create(
            model=fallback_config.get("model") or "llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        return {"status": "success", "content": completion.choices[0].message.content, "provider": "Groq"}
    except Exception as e:
        return {"status": "error", "message": f"All LLM providers failed: {str(e)}"}

def analyze_ui_elements(elements, url, context):
    """
    Reasoning Layer:
    Maps raw DOM elements to the 100+ category taxonomy and generates assets.
    """
    taxonomy_context = """
    CLASSIFICATION TAXONOMY:
    1. Forms & Inputs: Text, Textarea, Password, Email, Phone, Number, Search, Date/Time Pickers, File Upload, Color Picker.
    2. Selection Controls: Checkbox, Radio, Toggle, Dropdowns (Single/Multi), Auto-complete, Chips, Sliders, Ratings, Transfer List, Tree Select.
    3. Buttons & Actions: Primary, Secondary, Icon, FAB, Submit, Split, Dropdown Action, Context Menu, Copy, Download.
    4. Navigation: Breadcrumbs, Pagination, Tabs, Steppers, Navbars, Sidebars, Menu Bars, Command Palettes.
    5. Data Display: Tables (Sortable/Filterable), KPI Cards, Progress Bars, Skeletons, Badges, Timelines, Trees.
    6. SaaS Components: Kanban Boards, Chat Widgets, Drag & Drop, Rich Text Editors, Code Editors.
    7. Feedback & Overlays: Modals, Drawers, Tooltips, Toasts, Alerts, Banners.
    """

    prompt = f"""
    You are an AI Automation Engineer. Analyze the following DOM elements from {url}.
    
    CONTEXT:
    {context}
    
    TAXONOMY FOR CLASSIFICATION:
    {taxonomy_context}
    
    RAW DOM ELEMENTS:
    {json.dumps(elements[:200])}
    
    TASK:
    1. Map each element to its correct category and sub-category from the taxonomy.
    2. Identify the optimal locator strategy (ID, Name, CSS, or Data-TestID).
    3. Generate a Playwright (JS) code snippet to interact with the primary module found.
    4. Generate 3 ISTQB-aligned test scenarios (Positive, Negative, Edge Case).
    
    OUTPUT FORMAT (JSON ONLY):
    {{
        "techStack": ["Detected Frameworks"],
        "features": [
            {{
                "category": "Taxonomy Category",
                "name": "Logical Name",
                "locator": "Selector String",
                "interaction": "click/type/select"
            }}
        ],
        "playwrightCode": "Complete JS snippet",
        "scenarios": [
            {{"title": "...", "type": "Positive", "steps": "..."}}
        ],
        "risks": ["Identification risks"]
    }}
    """
    return prompt

def generate_test_plan_content(provider, endpoint, api_key, model, feature_data, additional_context):
    """ Legacy compatible function for Test Plan module """
    prompt = f"Create a test plan for: {feature_data.get('title')}. Context: {additional_context}"
    # This will be updated to use call_llm_with_failover in a full refactor
    # For now, keeping signature similar for compatibility
    return call_llm_with_failover(prompt, {"provider": provider, "apiKey": api_key, "model": model, "endpoint": endpoint}, {})

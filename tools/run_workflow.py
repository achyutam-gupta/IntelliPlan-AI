import os
import requests
import json
import base64

JIRA_EMAIL = os.environ.get("JIRA_EMAIL", "")
JIRA_TOKEN = os.environ.get("JIRA_TOKEN", "")
JIRA_URL = os.environ.get("JIRA_URL", "https://ailearning2026.atlassian.net/rest/api/3/issue/INFRA-1")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")

def fetch_jira():
    print("[*] Fetching Jira Data...")
    auth = base64.b64encode(f"{JIRA_EMAIL}:{JIRA_TOKEN}".encode()).decode()
    headers = {"Authorization": f"Basic {auth}", "Accept": "application/json"}
    r = requests.get(JIRA_URL, headers=headers)
    if r.status_code == 200:
        data = r.json()
        summary = data['fields'].get('summary', '')
        description = data['fields'].get('description', {})
        # Extraer texto limpio de Atlassian Document Format
        text_blocks = []
        def extract_text(node):
            if 'text' in node:
                text_blocks.append(node['text'])
            if 'content' in node:
                for child in node['content']:
                    extract_text(child)
        extract_text(description)
        desc_text = " ".join(text_blocks)
        
        return f"Summary: {summary}\nDescription Context: {desc_text[:3000]}" # Limitar si es muy largo
    else:
        raise Exception(f"Failed to fetch Jira: {r.status_code} {r.text}")

def call_groq(system_prompt, user_prompt):
    print(f"[*] Calling Groq with model {GROQ_MODEL}...")
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }
    r = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
    if r.status_code == 200:
        return r.json()['choices'][0]['message']['content']
    else:
        raise Exception(f"Groq API Error: {r.text}")

def read_file(path):
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
        return content[:4000] # Limiting template size to avoid massive token overflows on free tier

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    try:
        jira_data = fetch_jira()
        
        # Load templates
        base_dir = r"c:\Users\Achyutam\OneDrive\Desktop\AI learning\IntelliPlan.AI\Templates"
        out_dir = r"c:\Users\Achyutam\OneDrive\Desktop\AI learning\IntelliPlan.AI\.tmp\INFRA-5"
        
        t_us = read_file(os.path.join(base_dir, "Use Story", "User Story.md"))
        t_tp = read_file(os.path.join(base_dir, "TestPlan_Template", "Test Plan - Template.md"))
        t_tsc = read_file(os.path.join(base_dir, "test Scenario template", "New Text Document.md"))
        t_tc = read_file(os.path.join(base_dir, "Test Case Template", "Test Case.md"))
        
        print(f"[*] Generating User Stories...")
        us_out = call_groq(
            f"You are an expert PM. Generate User Stories exactly adhering to this template structure:\n\n{t_us}",
            f"Based on this Jira Requirement, populate the user stories:\n{jira_data}"
        )
        write_file(os.path.join(out_dir, "1_User_Stories.md"), us_out)
        
        print("[*] Generating Test Plan...")
        tp_out = call_groq(
            f"You are an expert QA Lead. Generate a Test Plan exactly following this template structure:\n\n{t_tp}",
            f"Based on the Jira Requirement and User Stories below, generate the test plan:\nREQ:\n{jira_data}\n\nUSER STORIES:\n{us_out}"
        )
        write_file(os.path.join(out_dir, "2_Test_Plan.md"), tp_out)
        
        print("[*] Generating Test Scenarios...")
        tsc_out = call_groq(
            f"You are an expert QA engineer. Generate test scenarios using this exact structure:\n\n{t_tsc}",
            f"Based on the Test Plan and User Stories, generate 3 critical test scenarios:\nREQ:\n{jira_data}\n\nUSER STORIES:\n{us_out}"
        )
        write_file(os.path.join(out_dir, "3_Test_Scenarios.md"), tsc_out)
        
        print("[*] Generating Test Cases...")
        tc_out = call_groq(
            f"You are an expert QA tester. Generate detailed test cases using this exact template structure:\n\n{t_tc}",
            f"Based on the Test Scenarios below, generate standard test cases:\n\n{tsc_out}"
        )
        write_file(os.path.join(out_dir, "4_Test_Cases.md"), tc_out)
        
        print("[+] Workflow completed successfully. Files saved to .tmp/INFRA-5")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()

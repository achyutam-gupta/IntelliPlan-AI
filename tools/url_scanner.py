import sys
import json
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

async def scan_url(url):
    """
    Deterministic Extraction Layer:
    Fetches raw HTML using Playwright to handle dynamic SPAs,
    then parses and cleans it for LLM consumption.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        try:
            # Navigate with a generous timeout for complex SaaS apps
            await page.goto(url, wait_until="networkidle", timeout=60000)
            
            # Extract content after JS execution
            content = await page.content()
            
            # Use BeautifulSoup for deterministic cleaning
            soup = BeautifulSoup(content, 'html.parser')
            
            # Remove non-UI elements to save context tokens
            for tag in soup(['script', 'style', 'meta', 'link', 'head', 'noscript', 'svg', 'path', 'iframe']):
                tag.decompose()
            
            # Target interactive and data-rich tags
            target_tags = [
                'button', 'input', 'a', 'select', 'textarea', 'form', 
                'table', 'tr', 'td', 'th', 'ul', 'ol', 'li', 
                'nav', 'header', 'footer', 'main', 'aside', 'section', 'article',
                'div', 'span', 'p' # Included for context, filtered by attributes below
            ]
            
            results = []
            
            # Iterate and filter for meaningful elements
            for element in soup.find_all(target_tags):
                # Filter for interactive or meaningful nodes
                is_interactive = element.name in ['button', 'input', 'a', 'select', 'textarea', 'form']
                has_id = element.get('id')
                has_name = element.get('name')
                has_role = element.get('role')
                has_aria = any(attr.startswith('aria-') for attr in element.attrs)
                has_data_testid = any(attr.startswith('data-') for attr in element.attrs)
                
                # Check for common SaaS patterns (Kanban, Steppers, etc.) in classes or IDs
                class_str = " ".join(element.get('class', []))
                is_saas_structure = any(pattern in class_str.lower() or pattern in (has_id or "").lower() 
                                       for pattern in ['kanban', 'stepper', 'wizard', 'modal', 'card', 'table', 'grid', 'tab', 'menu'])
                
                if is_interactive or has_id or has_name or has_role or has_aria or has_data_testid or is_saas_structure:
                    # Clean the element representation
                    clean_el = {
                        "tag": element.name,
                        "id": has_id,
                        "name": has_name,
                        "text": element.get_text(strip=True)[:100], # Limit text content
                        "role": has_role,
                        "type": element.get('type'),
                        "placeholder": element.get('placeholder'),
                        "classes": element.get('class'),
                        "aria": {k: v for k, v in element.attrs.items() if k.startswith('aria-')},
                        "data": {k: v for k, v in element.attrs.items() if k.startswith('data-')}
                    }
                    results.append(clean_el)
            
            # Final output structured for LLM Reasoning Layer
            return {
                "status": "success",
                "url": url,
                "elementCount": len(results),
                "elements": results[:500] # Hard limit to avoid context blowup
            }

        except Exception as e:
            return {"status": "error", "message": f"Scan failed: {str(e)}"}
        finally:
            await browser.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "error", "message": "No URL provided"}))
        sys.exit(1)
    
    target_url = sys.argv[1]
    result = asyncio.run(scan_url(target_url))
    print(json.dumps(result))

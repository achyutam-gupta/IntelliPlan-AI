import os
import re
import glob

base_dir = r"c:\Users\Achyutam\OneDrive\Desktop\AI learning\IntelliPlan.AI\ui\src\pages"
files = glob.glob(os.path.join(base_dir, "*.jsx"))

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    orig_content = content
    
    # 1. Fix useless escapes string \"Inter\", -> '"Inter"'
    content = content.replace(r'\"Inter\"', '"Inter"')
    
    # 2. Fix missing `IconSearch` imports from '../components/Icons'
    if "IconSearch" in content and "import { IconSearch" not in content and "IconSearch " not in [m.group(0) for m in re.finditer(r'import \{[^}]*IconSearch[^}]*\}', content)]:
        # check if there's an import from '../components/Icons'
        if "from '../components/Icons'" in content:
            content = re.sub(r"import\s*\{([^}]*)\}\s*from\s*'../components/Icons';", r"import { \1, IconSearch } from '../components/Icons';", content)
        else:
            # Add after first import
            content = re.sub(r"(import React.*?;\n)", r"\1import { IconSearch } from '../components/Icons';\n", content, count=1)

    # 3. UserStories.jsx useless escape
    if "UserStories.jsx" in path:
        content = content.replace(r'\-', '-')

    # 4. TestPlan.jsx llmResponse unused
    if "TestPlan.jsx" in path:
         content = re.sub(r'const\s+llmResponse\s*=\s*await\s+generateContentWithLLM', r'await generateContentWithLLM', content)

    if content != orig_content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed lint errors in {os.path.basename(path)}")

import os
import re
import glob

# The premium glass header to replace existing headers
HEADER_SNIPPET = """        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'rgba(8,12,20,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '320px', transition: 'border 0.2s' }}>
            <IconSearch />
            <input type="text" placeholder="Search..." style={{ background: 'transparent', border: 'none', color: 'white', marginLeft: '0.75rem', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>Ctrl K</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
            <span style={{ color: '#3b82f6', cursor: 'pointer', transition: 'color 0.2s' }}>Workspace</span>
            <span style={{ color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s' }}>Project Settings</span>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ position: 'relative', cursor: 'pointer', color: '#94a3b8' }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <div style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, background: '#ef4444', borderRadius: '50%' }} />
            </div>
            <img src="https://i.pravatar.cc/150?u=current_user" alt="User" style={{ width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
        </header>"""

base_dir = r"c:\Users\Achyutam\OneDrive\Desktop\AI learning\IntelliPlan.AI\ui\src\pages"
files = glob.glob(os.path.join(base_dir, "*.jsx"))

for path in files:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    orig_content = content
    # Standardize `#0f172a` main app backgrounds to `#080c14`
    content = re.sub(r"background:\s*'(#0f172a|#0F172A)'", "background: '#080c14'", content)
    content = re.sub(r'background:\s*"(#0f172a|#0F172A)"', "background: '#080c14'", content)
    
    # Also standardize fonts and overflows:
    # Some files just have  `<div className="app-layout" style={{display: 'flex', height: '100vh', background: '#080c14'}}>`
    content = re.sub(
        r"style={{display:\s*'flex',\s*height:\s*'100vh',\s*background:\s*'#080c14'([^}]*)}}",
        r"style={{display: 'flex', height: '100vh', background: '#080c14', color: 'white', overflow: 'hidden', fontFamily: '\"Inter\", sans-serif'}}",
        content
    )
    
    # Replace header <header ...> ... </header> if not URLAnalyzer.jsx
    if "URLAnalyzer.jsx" not in path:
        if "<header" in content:
            # find start of header, end of header
            content = re.sub(r"<header.*?</header>", HEADER_SNIPPET, content, flags=re.DOTALL)
        elif "<div className=\"top-search\"" in content:
            # specifically for dashboard/testcases etc if they use top-search div instead of header
            # we need to accurately select the top-search div
            # A naive regex may capture too much if there are nested divs. 
            pass # We'll do it manually using Python's string methods for divs

    if content != orig_content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {os.path.basename(path)}")


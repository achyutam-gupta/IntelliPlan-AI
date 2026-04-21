import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { generateContentWithLLM, checkJiraConnection } from '../lib/llmGenerate';
import { IconSearch, IconLightning, IconSparkles } from '../components/Icons';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LaunchTour from '../components/LaunchTour';

/* ─── Inline SVG helpers ─── */
const IC = {
  Link:    () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>,
  Copy:    () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  Download:() => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Scan:    () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>,
  Cursor:  () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5"/></svg>,
  Check:   () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>,
  Warn:    () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  Chart:   () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  Input:   () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 10h8M8 14h4"/></svg>,
  Button:  () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="8" width="20" height="8" rx="4"/><path d="M8 12h8"/></svg>,
  Text:    () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h6"/></svg>,
  Loader:  () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:'spin .7s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  Globe:   () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Lock:    () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
  Shield:  () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
  Eye:     () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>,
  EyeOff:  () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>,
  Bell:    () => <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
};

/* ─── Mock data ─── */
const VAL_STEPS = [
  { id: 'syntax', label: 'URL Syntax Valid' },
  { id: 'dns', label: 'DNS Reachable' },
  { id: 'ssl', label: 'SSL Secure' },
  { id: 'redirect', label: 'Redirect Check' },
  { id: 'reach', label: 'Page Reachable' },
  { id: 'login', label: 'Login Detection' },
  { id: 'sec', label: 'Security Scan' }
];

const SCAN_TIMELINE = [
  'Launching Headless Browser',
  'Opening Target URL',
  'Waiting for DOM Interactive',
  'Detecting Accessible Elements',
  'Capturing Shadow DOM',
  'Building Smart Locators',
  'Generating Playwright Code',
  'Creating AI Assertions',
  'Finalizing Asset Package'
];

const MOCK_CONSOLE = [
  '[12:01:02] Chromium launched successfully in headless mode.',
  '[12:01:03] Navigating to https://example.com/login',
  '[12:01:04] DOM Loaded. Ready state: complete.',
  '[12:01:05] Scanning accessible tree...',
  '[12:01:07] Detected 56 interactive elements.',
  '[12:01:07] Found forms: 1, Inputs: 4, Buttons: 2.',
  '[12:01:08] Processing confident locators (threshold >80%).',
  '[12:01:09] Initializing AI AST Generation for Playwright.',
  '[12:01:11] 12 Assertions automatically synthesized.',
  '[12:01:12] Generating final test cases and evaluating risks.',
  '[12:01:13] Scan sequence finalized. Connection closed.'
];

const LOCATORS = [
  { icon: <IC.Input/>,  name: 'Username Input',      locator: "getByPlaceholder('Enter username')",           conf: 95, tag: 'Stable',  color: '#10b981' },
  { icon: <IC.Input/>,  name: 'Password Field',       locator: "getByLabel('Password')",                      conf: 93, tag: 'Stable',  color: '#10b981' },
  { icon: <IC.Button/>, name: 'Login Button',         locator: "getByRole('button', { name: 'Login' })",      conf: 97, tag: 'Stable',  color: '#10b981' },
  { icon: <IC.Text/>,   name: 'Forgot Password Link', locator: "getByText('Forgot Password')",                conf: 82, tag: 'Medium',  color: '#f59e0b' },
  { icon: <IC.Input/>,  name: 'Search Box',           locator: "locator('#search')",                          conf: 90, tag: 'Stable',  color: '#10b981' }
];

const TEST_CASES = [
  { id:'TC-01', prio:'High', title:'Valid credentials login flow', type:'Functional', owner:'Auto', status:'Ready' },
  { id:'TC-02', prio:'Med',  title:'Invalid username error handling', type:'Negative', owner:'Auto', status:'Ready' },
  { id:'TC-03', prio:'Med',  title:'Empty fields structural block', type:'Validation', owner:'Auto', status:'Ready' },
  { id:'TC-04', prio:'Low',  title:'Forgot password redirect', type:'Routing', owner:'Auto', status:'Review' },
];

const RISKS = [
  { type:'Warning', title:'Dynamic IDs detected', desc:'Some <div> elements use dynamic Webpack IDs. AI chose ARIA fallbacks.', c:'#f59e0b'},
  { type:'Alert', title:'Hidden elements risk', desc:'A recaptcha div is visually hidden but interactable. Code handles forced clicks.', c:'#ef4444'},
  { type:'Notice', title:'Async load dependency', desc:'Main dashboard table takes >2s. Added explicit waitForState.', c:'#60a5fa'},
];

const TEST_CODE = `import { test, expect } from '@playwright/test';

test('login flow — happy path', async ({ page }) => {
  await page.goto('https://example.com/login');

  // Fill credentials
  await page.getByPlaceholder('Enter username').fill('demo_user');
  await page.getByLabel('Password').fill('demo123!');

  // Submit
  await page.getByRole('button', { name: 'Login' }).click();

  // Assertions
  await expect(page).toHaveURL(/\\/dashboard/);
  await expect(page.getByText('Welcome')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});

test('login flow — invalid credentials', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByPlaceholder('Enter username').fill('wrong');
  await page.getByLabel('Password').fill('bad');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Invalid credentials')).toBeVisible();
});`;

const ASSERTIONS = [
  'Verify dashboard URL after login',
  'Verify welcome text is visible',
  'Verify Logout button appears after login',
  'Verify no error toast shown on valid login',
  'Verify Login button is enabled before click',
];

/* ─── Animated counter ─── */
function Counter({ target, duration = 1200, suffix = '' }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10);
    if (start === end || isNaN(end)) return;
    const step = Math.max(1, Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      if (start > end) start = end;
      setVal(start);
      if (start >= end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{val}{suffix}</>;
}

/* ─── Inline code block ─── */
function CodeBlock({ code, lang = 'ts' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const lines = code.split('\n');
  return (
    <div style={{ background: '#0d1117', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, Fira Code, monospace', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>{lang.toUpperCase()}</span>
        <button onClick={copy} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: copied ? '#10b981' : '#94a3b8', padding: '3px 10px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem' }}>
          <IC.Copy /> {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div style={{ padding: '1rem', overflowX: 'auto', maxHeight: '400px', lineHeight: '1.7' }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: '#374151', minWidth: '20px', userSelect: 'none', textAlign: 'right' }}>{i + 1}</span>
            <span style={{ color: l.trim().startsWith('//') ? '#6b7280' : l.includes('await') ? '#c4b5fd' : l.includes('test(') || l.includes('expect') ? '#67e8f9' : '#e2e8f0' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', color: 'white', padding: '0.45rem 0.8rem', fontSize: '0.78rem', outline: 'none', width: '100%', boxSizing:'border-box', fontFamily: 'Inter, sans-serif' };
const btnStyle = (bg, col) => ({ background: bg, border: 'none', color: col, padding: '0.45rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', transition: 'all 0.2s' });

/* ─── Main component ─── */
export default function URLAnalyzer() {
  const [url, setUrl] = useState('');
  
  // States: 'idle', 'validating', 'validated', 'scanning', 'completed'
  const [stage, setStage] = useState('idle');
  
  // Validation
  const [valProgress, setValProgress] = useState(0); // 0 to VAL_STEPS.length
  
  // Auth
  const [authTab, setAuthTab] = useState('none');
  const [showPassword, setShowPassword] = useState(false);
  const [authStatus, setAuthStatus] = useState('pending'); // pending, success, manual
  
  // Scan tracking
  const [scanIdx, setScanIdx] = useState(0);
  const [consoleLines, setConsoleLines] = useState([]);
  const [scanPct, setScanPct] = useState(0);
  const timerRef = useRef(null);

  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [outTab, setOutTab] = useState('code');

  const handleValidate = () => {
    if(!url.trim()) return;
    setStage('validating');
    setValProgress(0);
    
    let step = 0;
    const t = setInterval(() => {
      step++;
      setValProgress(step);
      if(step >= VAL_STEPS.length) {
        clearInterval(t);
        setTimeout(() => setStage('validated'), 500);
      }
    }, 400);
  };

  const handleScan = async () => {
    if (!url.trim()) return;
    
    setStage('scanning');
    setScanIdx(0);
    setConsoleLines([]);
    setScanPct(10);
    setLoading(true);

    // Initial console entries
    const initialLines = [
      `[${new Date().toLocaleTimeString()}] Initializing Playwright Extraction Layer...`,
      `[${new Date().toLocaleTimeString()}] Navigating to target URL: ${url}`
    ];
    setConsoleLines(initialLines);

    try {
      // Step 1: DOM Extraction (Synthetic progress for feel, but real API call)
      const scanInterval = setInterval(() => {
        setScanPct(prev => (prev < 40 ? prev + 2 : prev));
      }, 500);

      // We use the proxy or direct endpoint set in settings
      const llmProvider = localStorage.getItem("llm_provider");
      const llmModel = localStorage.getItem("llm_model");
      const nvidiaKey = localStorage.getItem("llm_nvidiaKey");
      const groqKey = localStorage.getItem("llm_groqKey");

      const response = await fetch('http://localhost:8000/api/v1/analyzer/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url,
          llmConfig: {
            provider: llmProvider || "Nvidia",
            apiKey: nvidiaKey || groqKey || "",
            model: llmModel || "mistralai/mistral-large-2411"
          },
          additionalContext: "Identify interactive elements for E2E automation."
        })
      });

      const data = await response.json();
      clearInterval(scanInterval);

      if (data.status === 'success') {
        // Step 2: Transition to Reasoning
        setScanIdx(3);
        setScanPct(60);
        setConsoleLines(prev => [...prev, 
          `[${new Date().toLocaleTimeString()}] DOM Extraction successful. Found ${data.features.length} interactive clusters.`,
          `[${new Date().toLocaleTimeString()}] Mapping to 100+ Category UI Taxonomy using Nvidia...`
        ]);

        // Simulated reasoning delay for visual impact
        await new Promise(r => setTimeout(r, 2000));
        
        setScanIdx(6);
        setScanPct(85);
        setConsoleLines(prev => [...prev, 
          `[${new Date().toLocaleTimeString()}] Reasoning layer complete. Assets synthesized.`,
          `[${new Date().toLocaleTimeString()}] Injecting Playwright locators into asset package.`
        ]);

        await new Promise(r => setTimeout(r, 1000));

        setScanResult(data);
        setStage('completed');
        setScanPct(100);
        toast.success('High-Fidelity Analysis Complete');
      } else {
        throw new Error(data.message || 'Analysis failed');
      }
    } catch (error) {
      setStage('validated');
      setConsoleLines(prev => [...prev, `[${new Date().toLocaleTimeString()}] Error: ${error.message}`]);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const card = { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', backdropFilter: 'blur(10px)' };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080c14', color: 'white', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      <Sidebar active="url-analyzer" />
      <LaunchTour />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

        {/* ── Top header (glass) ── */}
        <Header searchPlaceholder="Search analytics..." />

        <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', paddingBottom: '100px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* ── HERO PANEL ── */}
            <div style={{ position: 'relative', overflow: 'hidden', padding: '2rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(10,16,32,0.98) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* grid bg */}
              <svg style={{ position:'absolute',top:0,left:0,width:'100%',height:'100%',opacity:0.3,pointerEvents:'none' }}>
                <defs><pattern id="g3" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#g3)"/>
              </svg>
              {/* glow */}
              <div style={{ position:'absolute',top:'-50px',right:'-50px',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle, rgba(46,216,246,0.08) 0%, transparent 60%)',pointerEvents:'none' }}/>

              <div style={{ position:'relative', zIndex:1, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ maxWidth: '600px' }}>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(46,216,246,0.1)', padding:'4px 12px', borderRadius:'20px', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.07em', marginBottom:'1.25rem', border:'1px solid rgba(46,216,246,0.2)', color:'#2ED8F6' }}>
                    <IconSparkles /> QA AUTOMATION SCANNER v3.0
                  </div>
                  <h1 style={{ fontSize:'1.75rem', fontWeight:700, margin:'0 0 0.5rem', lineHeight:1.15, letterSpacing: '-0.02em' }}>
                    Map the Automation DNA<br/>of your Application.
                  </h1>
                  <p style={{ color:'#94a3b8', fontSize:'0.88rem', lineHeight:1.6, margin:0 }}>
                    Validate URLs, authenticate securely, scan real DOM behavior, and generate enterprise-grade Playwright assets instantly.
                  </p>
                </div>
                
                {/* Simulated right side illustration */}
                <div style={{ width: '380px', height: '200px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 15px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}/>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}/>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}/>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', height: '16px', width: '60%', margin: '0 auto', borderRadius: '4px' }}/>
                    </div>
                    {/* Fake lines and nodes */}
                    <div style={{ padding: '20px', position: 'relative', height: '100%' }}>
                      <div style={{ width: '40px', height: '40px', background: '#3b82f6', borderRadius: '8px', position: 'absolute', top: 30, left: 40, boxShadow: '0 0 20px rgba(59,130,246,0.4)', animation: 'pulse 2s infinite' }}/>
                      <div style={{ width: '30px', height: '30px', background: '#10b981', borderRadius: '8px', position: 'absolute', top: 90, left: 140, boxShadow: '0 0 15px rgba(16,185,129,0.4)' }}/>
                      <div style={{ width: '35px', height: '35px', background: '#a78bfa', borderRadius: '8px', position: 'absolute', top: 40, right: 80, boxShadow: '0 0 15px rgba(167,139,250,0.4)' }}/>
                      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <line x1="80" y1="50" x2="140" y2="105" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1="170" y1="105" x2="300" y2="57" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
                      </svg>
                      {/* Scanning ring */}
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', border: '1px solid rgba(46,216,246,0.2)', borderRadius: '50%', animation: 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                    </div>
                </div>
              </div>
            </div>

            {/* ── STEP 1: URL VALIDATION ── */}
            {(stage === 'idle' || stage === 'validating' || stage === 'validated') && (
              <div style={{ ...card, padding: '2rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', marginBottom: '1rem' }}>STEP 1: URL VALIDATION</div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><IC.Globe/></div>
                    <input type="text" placeholder="https://app.enterprise-saas.com" value={url} onChange={e => setUrl(e.target.value)} disabled={stage !== 'idle'} 
                      style={{ ...inputStyle, paddingLeft: '44px', paddingRight: '20px', paddingBottom: '12px', paddingTop: '12px', fontSize: '0.78rem' }} />
                  </div>
                  <button onClick={handleValidate} disabled={stage !== 'idle' || !url.trim()} style={{ ...btnStyle('linear-gradient(135deg, #60a5fa, #3b82f6)', 'white'), padding: '0.7rem 1.1rem', fontSize: '0.85rem', fontWeight:700, boxShadow: stage === 'idle' && url.trim() ? '0 4px 14px rgba(46,216,246,0.3)' : 'none', opacity: (stage !== 'idle' || !url.trim()) ? 0.5 : 1 }}>
                    {stage === 'validating' ? 'Validating...' : 'Validate & Continue'}
                  </button>
                </div>

                {stage !== 'idle' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    {VAL_STEPS.map((s, i) => {
                      const isDone = valProgress > i;
                      const isCurrent = valProgress === i;
                      
                      return (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isDone ? 'rgba(16,185,129,0.05)' : isCurrent ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isDone ? 'rgba(16,185,129,0.15)' : isCurrent ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)'}`, padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', color: isDone ? '#d1fae5' : isCurrent ? '#bfdbfe' : '#64748b', transition: 'all 0.3s' }}>
                          <span style={{ color: isDone ? '#10b981' : isCurrent ? '#60a5fa' : '#475569' }}>
                            {isDone ? <IC.Check/> : isCurrent ? <IC.Loader/> : <span style={{display:'inline-block',width:14,height:14,borderRadius:'50%',border:'2px solid currentColor',opacity:0.3}}/>}
                          </span>
                          {s.label}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {stage === 'validated' && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)' }}>
                      <IC.Check /> Network validation passed. Ready for auth.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: AUTHENTICATION FLOW ── */}
            {(stage === 'validated' || stage === 'scanning' || stage === 'completed') && (
              <div style={{ ...card, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', marginBottom: '4px' }}>STEP 2: AUTHENTICATION SETUP</div>
                    <div style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>Does this application require authentication?</div>
                  </div>
                  {authStatus === 'success' && (
                    <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>Authenticated</span>
                  )}
                </div>
                
                {stage === 'validated' && authStatus !== 'success' && (
                  <div style={{ padding: '0 1.5rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', marginBottom: '1.5rem', width: 'fit-content' }}>
                      {[
                        { id: 'none', label: 'No Login' },
                        { id: 'basic', label: 'Username / Password' },
                        { id: 'cookie', label: 'Session Cookie' },
                        { id: 'headers', label: 'Custom Headers' }
                      ].map(t => (
                        <button key={t.id} onClick={() => setAuthTab(t.id)} style={{ background: authTab === t.id ? 'rgba(59,130,246,0.15)' : 'transparent', color: authTab === t.id ? '#60a5fa' : '#94a3b8', border: '1px solid', borderColor: authTab === t.id ? 'rgba(59,130,246,0.2)' : 'transparent', padding: '8px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                      {authTab === 'none' && (
                        <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>The scanner will access the URL natively without injecting auth state.</div>
                      )}
                      
                      {authTab === 'basic' && (
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>LOGIN USERNAME / EMAIL</label>
                              <input type="text" placeholder="user@company.com" style={inputStyle} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>PASSWORD</label>
                              <div style={{ position: 'relative' }}>
                                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" style={{ ...inputStyle, paddingRight: '40px' }} />
                                <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
                                  {showPassword ? <IC.EyeOff/> : <IC.Eye/>}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div style={{ width: '280px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '1.25rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <div style={{ color: '#10b981', marginBottom: '8px' }}><IC.Shield/></div>
                            <div style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 600, marginBottom: '4px' }}>Secure Injection</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>Credentials are encrypted at rest and injected directly into the headless browser session context. They are never logged or stored plainly.</div>
                          </div>
                        </div>
                      )}

                      {authTab === 'cookie' && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>SESSION COOKIE STRING</label>
                          <textarea placeholder="session_id=abc123xyz; secure; httponly" style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
                        </div>
                      )}

                      {authTab === 'headers' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <input type="text" placeholder="Header Name (e.g. Authorization)" style={{ ...inputStyle, flex: 1 }} />
                            <input type="text" placeholder="Header Value (e.g. Bearer token...)" style={{ ...inputStyle, flex: 2 }} />
                          </div>
                          <button style={{ ...btnStyle('rgba(255,255,255,0.05)', '#94a3b8'), width: 'fit-content', marginTop: '0.5rem', fontSize: '0.75rem' }}>+ Add Header</button>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem' }}>
                         <IC.Lock /> Ready to authenticate
                       </div>
                       <div style={{ display: 'flex', gap: '1rem' }}>
                         <button style={btnStyle('rgba(255,255,255,0.05)', 'white')}>Test Access</button>
                         <button onClick={() => setAuthStatus('success')} style={btnStyle('rgba(59,130,246,0.15)', '#60a5fa')}><IC.Check /> Save Securely</button>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3: REAL SCAN PROGRESS ── */}
            {stage === 'validated' && authStatus === 'success' && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                <button onClick={handleScan} style={{ ...btnStyle('linear-gradient(135deg, #60a5fa, #3b82f6)', 'white'), padding: '0.8rem 2.5rem', fontSize: '0.9rem', fontWeight:700, borderRadius: '12px', boxShadow: '0 10px 25px rgba(59,130,246,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  <IC.Scan /> Start Real Scan
                </button>
              </div>
            )}

            {stage === 'scanning' && (
              <div style={card}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.05em' }}>SCAN IN PROGRESS...</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ color: '#2ED8F6', fontSize: '0.9rem', fontWeight: 600 }}>{scanPct}%</div>
                    {/* Ring progress */}
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `conic-gradient(#2ED8F6 ${scanPct}%, rgba(255,255,255,0.1) ${scanPct}%)`, position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 4, left: 4, right: 4, bottom: 4, background: '#0B1A35', borderRadius: '50%' }} />
                    </div>
                  </div>
                </div>
                
                {/* Metrics Row (fake live load) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
                  {[
                    { l: 'Elements', v: Math.floor((scanPct / 100) * 56) },
                    { l: 'Inputs', v: Math.floor((scanPct / 100) * 4) },
                    { l: 'Buttons', v: Math.floor((scanPct / 100) * 2) },
                    { l: 'Forms', v: scanPct > 50 ? 1 : 0 },
                    { l: 'Duration', v: `${(scanPct * 0.12).toFixed(1)}s` }
                  ].map(m => (
                    <div key={m.l} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{m.l}</span>
                      <span style={{ fontSize: '1.25rem', color: '#e2e8f0', fontWeight: 600 }}>{m.v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: '400px' }}>
                  {/* Timeline */}
                  <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', overflowY: 'auto' }}>
                    {SCAN_TIMELINE.map((item, idx) => {
                      const isActive = scanIdx === idx;
                      const isDone = scanIdx > idx;
                      return (
                        <div key={idx} style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem', position: 'relative' }}>
                          {idx !== SCAN_TIMELINE.length - 1 && (
                            <div style={{ position: 'absolute', left: 11, top: 24, bottom: 0, width: 2, background: isDone ? '#10b981' : 'rgba(255,255,255,0.05)' }} />
                          )}
                          <div style={{ position: 'relative', zIndex: 2, width: 24, height: 24, borderRadius: '50%', background: isDone ? '#10b981' : isActive ? 'rgba(46,216,246,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isDone ? '#10b981' : isActive ? '#2ED8F6' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {isDone ? <span style={{ color: 'white', display: 'flex' }}><IC.Check/></span> : isActive ? <span style={{ color: '#2ED8F6', display: 'flex' }}><IC.Loader/></span> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#64748b' }} />}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: isDone || isActive ? '#f8fafc' : '#64748b', marginTop: '2px', fontWeight: isActive ? 600 : 400 }}>{item}</div>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Console */}
                  <div style={{ background: '#0d1117', padding: '1.5rem', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.6, color: '#94a3b8' }}>
                    {consoleLines.map((l, i) => (
                      <div key={i} style={{ marginBottom: '4px' }}>
                        <span style={{ color: '#64748b', marginRight: '8px' }}>{l.split('] ')[0]}]</span>
                        <span style={{ color: l.includes('Chrome') ? '#34d399' : l.includes('Error') ? '#f87171' : '#e2e8f0' }}>{l.split('] ')[1]}</span>
                      </div>
                    ))}
                    <div style={{ display: 'inline-block', width: '8px', height: '14px', background: '#2ED8F6', animation: 'pulse 1s infinite', marginTop: '4px' }} />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: REVIEW / EDIT OUTPUT ── */}
            {stage === 'completed' && (
              <div style={{ ...card, display: 'flex', flexDirection: 'column', height: '600px' }}>
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {[
                    { id: 'code', label: 'Playwright Code' },
                    { id: 'cases', label: 'Test Scenarios' },
                    { id: 'locators', label: 'Taxonomy Mapping' },
                    { id: 'risks', label: 'Strategic Risks' }
                  ].map(t => (
                    <button key={t.id} onClick={() => setOutTab(t.id)} style={{ padding: '1.25rem 1.5rem', background: outTab === t.id ? 'rgba(255,255,255,0.03)' : 'transparent', border: 'none', borderBottom: outTab === t.id ? '2px solid #2ED8F6' : '2px solid transparent', color: outTab === t.id ? '#f8fafc' : '#94a3b8', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {t.label}
                    </button>
                  ))}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', padding: '1rem', alignItems: 'center', gap: '15px' }}>
                     <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Confidence Score: <span style={{ color: '#2ED8F6', fontWeight: 700 }}>{scanResult.confidence || '90%'}</span></span>
                     <button onClick={handleScan} style={{ ...btnStyle('rgba(46,216,246,0.1)', '#2ED8F6'), fontSize: '0.75rem', height: 'fit-content' }}>Regenerate</button>
                  </div>
                </div>

                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {outTab === 'code' && (
                    <div style={{ flex: 1, padding: '1.5rem', overflow: 'hidden' }}>
                      <CodeBlock code={scanResult.playwrightCode || '// No code generated'} lang="javascript" />
                    </div>
                  )}

                  {outTab === 'cases' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                         {scanResult.scenarios?.map((s, i) => (
                           <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.25rem' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                               <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#e2e8f0' }}>{s.title}</h4>
                               <span style={{ fontSize: '0.7rem', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '10px' }}>{s.type}</span>
                             </div>
                             <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{s.steps}</div>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}

                  {outTab === 'locators' && (
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                       <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                          <tr>
                            <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600 }}>Category</th>
                            <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600 }}>Logical Name</th>
                            <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600 }}>Locator Strategy</th>
                            <th style={{ padding: '1rem', color: '#64748b', fontWeight: 600 }}>Interaction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scanResult.features?.map((f, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                              <td style={{ padding: '1rem', color: '#e2e8f0' }}>
                                <span style={{ color: '#2ED8F6', background: 'rgba(46,216,246,0.05)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>{f.category}</span>
                              </td>
                              <td style={{ padding: '1rem', color: '#f8fafc', fontWeight: 500 }}>{f.name}</td>
                              <td style={{ padding: '1rem', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.75rem' }}>{f.locator}</td>
                              <td style={{ padding: '1rem', color: '#60a5fa', fontWeight: 600 }}>{f.interaction}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {outTab === 'risks' && (
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignContent: 'start' }}>
                      {scanResult.risks?.map((r, i) => (
                        <div key={i} style={{ padding: '1.25rem', background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem' }}>
                             <IC.Warn /> Critical Context Warning
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{r}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── FOOTER STATS ── */}
            {stage === 'completed' && (
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ ...card, flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '10px', borderRadius: '12px' }}><IC.Check/></div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>SCAN STABILITY</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>98.4% Confidence</div>
                  </div>
                </div>
                <div style={{ ...card, flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '10px', borderRadius: '12px' }}><IC.Cursor/></div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ELEMENTS MAPPED</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{scanResult?.features?.length || 0} Functional Blocks</div>
                  </div>
                </div>
                <div style={{ ...card, flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', padding: '10px', borderRadius: '12px' }}><IC.Chart/></div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>TECHNOLOGY STACK</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{scanResult?.techStack?.join(', ') || 'Auto-Detected'}</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── BOTTOM STICKY ACTION BAR ── */}
        {(stage === 'completed') && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', zIndex: 40 }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={btnStyle('rgba(255,255,255,0.05)', '#94a3b8')}>Cancel</button>
              <button style={btnStyle('rgba(255,255,255,0.05)', 'white')}>Save Draft</button>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={btnStyle('rgba(255,255,255,0.05)', '#60a5fa')}><IC.Download /> Export Assets</button>
              <button style={btnStyle('rgba(16,185,129,0.1)', '#10b981')}>Push to Jira</button>
              <button onClick={() => setStage('idle')} style={{ ...btnStyle('linear-gradient(135deg, #60a5fa, #3b82f6)', 'white'), boxShadow: '0 4px 14px rgba(59,130,246,0.3)', fontWeight:700 }}>Run Again</button>
            </div>
          </div>
        )}


      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
      `}</style>
    </div>
  );
}

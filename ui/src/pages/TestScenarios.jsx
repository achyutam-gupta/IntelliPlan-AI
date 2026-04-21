import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateContentWithLLM, parseLLMJSON } from '../lib/llmGenerate';
import { IconSearch, IconSparkles } from '../components/Icons';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TestScenarioTemplateRaw from '../templates/test_scenario_spec.md?raw';

/* ─── Inline SVGs ─── */
const Ic = {
  Save:    ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Export:  ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Refresh: ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Check:   ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>,
  Warn:    ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Send:    ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Loader:  ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:'spin .7s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  Chevron: (p)=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{transform:p.open?'rotate(180deg)':'none',transition:'transform .2s'}}><path d="M19 9l-7 7-7-7"/></svg>,
  Expand:  ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
};

/* ─── Color maps ─── */
const PRIO_C   = { Critical:'#ef4444', High:'#f97316', Medium:'#3b82f6', Low:'#64748b', P0:'#ef4444', P1:'#f97316', P2:'#3b82f6', P3:'#64748b' };
const TYPE_C   = { Functional:'#3b82f6', Security:'#10b981', Integration:'#3b82f6', Negative:'#f59e0b', 'Edge Case':'#fb7185', Performance:'#06b6d4', API:'#3b82f6', UX:'#fb7185', Regression:'#64748b' };
const STATUS_C = { Draft:'#94a3b8', Reviewed:'#60a5fa', Approved:'#10b981', Blocked:'#ef4444' };

export default function TestScenarios() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('guestMode') === 'true') {
      navigate('/login');
    }
  }, [navigate]);

  /* ── Load upstream data from sessionStorage ── */
  const storyPool   = JSON.parse(sessionStorage.getItem('us_stories')   || '[]');
  const tpData      = JSON.parse(sessionStorage.getItem('tp_data')      || 'null');
  const tpSelected  = JSON.parse(sessionStorage.getItem('tp_selected')  || '[]');
  const tpStoryPool = JSON.parse(sessionStorage.getItem('tp_storyPool') || '[]');

  /* ── State ── */
  const [scenarios, setScenarios]   = useState(() => JSON.parse(sessionStorage.getItem('ts_scenarios') || '[]'));
  const [selected, setSelected]     = useState(() => new Set(JSON.parse(sessionStorage.getItem('ts_selected') || '[]')));
  const [generating, setGen]        = useState(false);
  const [generated, setGenerated]   = useState(() => JSON.parse(sessionStorage.getItem('ts_generated') || 'false'));
  const [expanded, setExpanded]     = useState(null);
  const [searchQ, setSearchQ]       = useState('');
  const [filterPrio, setFilterPrio] = useState('All');
  const [filterType, setFilterType] = useState('All');

  /* ── Session persistence ── */
  useEffect(() => {
    sessionStorage.setItem('ts_scenarios',  JSON.stringify(scenarios));
    sessionStorage.setItem('ts_selected',   JSON.stringify(Array.from(selected)));
    sessionStorage.setItem('ts_generated',  JSON.stringify(generated));
  }, [scenarios, selected, generated]);

  /* ── Build input context ── */
  const inputStories  = tpStoryPool.length > 0 ? tpStoryPool : storyPool;
  const activeStories = tpSelected.length > 0
    ? inputStories.filter(s => tpSelected.includes(s.id))
    : inputStories;

  /* ══════════════════════════════════════════════
     handleGenerate — Template-Driven LLM Pipeline
     ══════════════════════════════════════════════ */
  const handleGenerate = async () => {
    if (activeStories.length === 0 && !tpData) {
      return toast.error('No upstream data found. Complete User Stories → Test Plan first.');
    }

    setGen(true);

    try {
      const storiesJSON = JSON.stringify(activeStories, null, 2);
      const planJSON    = tpData
        ? JSON.stringify(tpData, null, 2)
        : 'No test plan data available — infer scope from user stories.';

      const promptText = `Role: Act as a Senior QA Test Architect specializing in ISTQB-aligned test scenario design. Your job is to analyze the provided User Stories and Test Plan to derive comprehensive, traceable Test Scenarios that conform strictly to the template structure below.

Input Assets:

Standard Template:
### TEST SCENARIO TEMPLATE RULES ###
${TestScenarioTemplateRaw}
####################################

Source Data — User Stories:
${storiesJSON}

Source Data — Test Plan:
${planJSON}

Execution Logic:

- Extract: Identify every distinct functional flow, business rule, edge case, negative path, and security boundary from the User Stories. Cross-reference with the Test Plan's scope (in-scope items), test types, and risk areas to ensure coverage alignment.
- Map: For each identified flow, create a Test Scenario that maps to:
  * A specific User Story (linkedStory field) — use the story ID directly
  * The corresponding risk level from the Test Plan
  * The test type (Functional, Security, Integration, Negative, Edge Case, Performance) aligned to the Test Plan's test type matrix
- Synthesize:
  * Derive scenario names that are action-oriented and unambiguous (e.g., "Verify OAuth2 token refresh on session expiry")
  * Write descriptions that explain the WHAT and WHY — what flow is being validated and why it matters from a business/risk perspective
  * Identify preconditions required for each scenario (environment state, data prerequisites, user roles)
  * Generate 2-4 test conditions per scenario that define the core assertions (positive path, negative path, boundary)
  * Assign priority based on the linked story's priority and the Test Plan's risk assessment
- Validate: Ensure every in-scope User Story has at least 2 scenarios. Ensure a mix of Positive, Negative, and Edge Case scenario types. If data is missing, infer professional defaults or mark as [PENDING_REVIEW].

Generate between 8-15 scenarios to ensure comprehensive coverage without redundancy.

JSON FORMATTING RULES:
1. NO raw newlines inside strings. Use \n instead.
2. Escape all internal double quotes (e.g., "Verification of \"Advanced\" settings").
3. Ensure every scenario is separated by a comma.
4. Provide ONLY the JSON array. Do not wrap in markdown. Do not add commentary outside the JSON array.

[
  {
    "id": "TS-001",
    "name": "Clear, action-oriented scenario name",
    "description": "What this scenario validates and why it matters",
    "priority": "Critical|High|Medium|Low",
    "type": "Functional|Security|Integration|Negative|Edge Case|Performance",
    "linkedStory": "US-XXX",
    "preconditions": "Prerequisites that must be true before execution",
    "testConditions": [
      { "conditionId": "SC-01", "condition": "What to test", "expectedOutcome": "Expected result" }
    ],
    "businessImpact": "Why failure matters to the business",
    "testLevel": "System|Integration|UAT",
    "status": "Draft"
  }
]`;

      const llmResponse = await generateContentWithLLM(promptText);
      if(!llmResponse) throw new Error("No response from LLM");
      
      const parsed = parseLLMJSON(llmResponse);
      setScenarios(parsed);
      setSelected(new Set(parsed.map(s => s.id)));
      setGenerated(true);
      toast.success(`${parsed.length} Test Scenarios generated successfully.`);
    } catch (err) {
      console.error('Scenario generation error:', err);
      toast.error(`Scenario generation failed: ${err.message}`);
      setGenerated(true);
    }

    setGen(false);
  };

  const handleExport = () => {
    if (!scenarios.length) return toast.error("No scenarios to export.");
    const blob = new Blob([JSON.stringify(scenarios, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-scenarios-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Test Scenarios exported as JSON.");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  /* ── Selection helpers ── */
  const toggleSelect = (id) => setSelected(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const selectAll    = () => setSelected(new Set(scenarios.map(s => s.id)));
  const clearAll     = () => setSelected(new Set());

  /* ── Filtering ── */
  const visible = scenarios.filter(s => {
    if (searchQ && !s.name?.toLowerCase().includes(searchQ.toLowerCase()) && !s.id?.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (filterPrio !== 'All' && s.priority !== filterPrio) return false;
    if (filterType !== 'All' && s.type !== filterType) return false;
    return true;
  });

  /* ── Computed metrics ── */
  const types         = [...new Set(scenarios.map(s => s.type).filter(Boolean))];
  const linkedStories = [...new Set(scenarios.map(s => s.linkedStory).filter(Boolean))];
  const highPrioCount = scenarios.filter(s => s.priority === 'Critical' || s.priority === 'High').length;
  const coveragePct   = activeStories.length > 0 ? Math.min(100, Math.round((linkedStories.length / activeStories.length) * 100)) : 0;

  const typeCounts = {};
  scenarios.forEach(s => { typeCounts[s.type] = (typeCounts[s.type] || 0) + 1; });

  /* ── Shared styles ── */
  const card   = { background:'rgba(15,23,42,0.7)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' };
  const inCard = { background:'rgba(8,12,20,0.6)',  border:'1px solid rgba(255,255,255,0.05)', borderRadius:'8px', padding:'1rem 1.1rem' };
  const btn    = (c) => ({ display:'flex',alignItems:'center',gap:'6px',background:`${c}12`,border:`1px solid ${c}28`,color:c,padding:'0.42rem 0.85rem',borderRadius:'7px',fontSize:'0.76rem',fontWeight:600,cursor:'pointer' });
  const tag    = (c) => ({ background:`${c}15`,color:c,border:`1px solid ${c}25`,padding:'1px 7px',borderRadius:'8px',fontSize:'0.66rem',fontWeight:700 });
  const inp    = { background:'rgba(15,23,42,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',color:'white',outline:'none',padding:'0.42rem 0.7rem',fontSize:'0.78rem',boxSizing:'border-box' };

  return (
    <div style={{ display:'flex',height:'100vh',background:'#080c14',color:'white',overflow:'hidden' }}>
      <Sidebar active="scenarios"/>
      <div style={{ flex:1,display:'flex',flexDirection:'column',overflow:'hidden' }}>
        <Header searchPlaceholder="Search architecture..." />

        {/* ── Page Header ── */}
        <div style={{ padding:'1.25rem 2rem 0',flexShrink:0 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
            <div>
              <h1 style={{ fontSize:'1.75rem',fontWeight:700,margin:'0 0 4px' }}>Test Scenario Intelligence Module</h1>
              <p style={{ color:'#64748b',margin:0,fontSize:'0.88rem' }}>Derive comprehensive, ISTQB-aligned test scenarios from approved user stories and test plans using AI scenario analysis.</p>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:'10px',flexShrink:0 }}>
              <span style={{ color:'#64748b',fontSize:'0.75rem',fontWeight:600 }}>Step 4 of 8</span>
              <div style={{ display:'flex',gap:'4px' }}>
                {Array.from({length:8},(_,i)=>(
                  <div key={i} style={{ width:i===3?'24px':'16px',height:'4px',borderRadius:'2px',background:i<=2?'#10b981':i===3?'#60a5fa':'rgba(255,255,255,0.08)' }}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3-Column Body ── */}
        <div style={{ flex:1,display:'grid',gridTemplateColumns:'268px 1fr 228px',gap:'1rem',padding:'1rem 2rem 0',overflow:'hidden',minHeight:0 }}>

          {/* ════════════════════════════
              LEFT — Source Context Panel
              ════════════════════════════ */}
          <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',overflowY:'auto',paddingBottom:'4rem',paddingRight:'4px' }}>

            {/* Source Stories */}
            <div style={card}>
              <div style={{ padding:'0.9rem 1.1rem',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <span style={{ fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>SOURCE USER STORIES</span>
                  <span style={{ ...tag('#60a5fa') }}>{activeStories.length} loaded</span>
                </div>
              </div>
              <div style={{ maxHeight:'200px',overflowY:'auto' }}>
                {activeStories.length > 0 ? activeStories.map(s => (
                  <div key={s.id} style={{ display:'flex',gap:'8px',padding:'0.55rem 1.1rem',borderBottom:'1px solid rgba(255,255,255,0.04)',alignItems:'center' }}>
                    <span style={{ fontSize:'0.68rem',fontWeight:700,color:'#60a5fa',flexShrink:0 }}>{s.id}</span>
                    <span style={{ fontSize:'0.75rem',color:'#94a3b8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',flex:1 }}>{s.title}</span>
                    {s.priority && <span style={{ ...tag(PRIO_C[s.priority]||'#64748b'),fontSize:'0.58rem' }}>{s.priority}</span>}
                  </div>
                )) : (
                  <div style={{ padding:'1.25rem',textAlign:'center',fontSize:'0.78rem',color:'#475569' }}>
                    No stories loaded.
                    <div style={{ marginTop:'6px',fontSize:'0.72rem',color:'#64748b' }}>Complete Stage 1 (User Stories) and Stage 2 (Test Plan) first.</div>
                  </div>
                )}
              </div>
            </div>

            {/* Test Plan Summary */}
            <div style={card}>
              <div style={{ padding:'0.9rem 1.1rem',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>TEST PLAN CONTEXT</span>
              </div>
              <div style={{ padding:'0.75rem 1.1rem' }}>
                {tpData ? (
                  <>
                    <p style={{ margin:'0 0 0.5rem',fontSize:'0.75rem',color:'#94a3b8',lineHeight:1.5 }}>
                      {(tpData.objective || '').length > 150
                        ? (tpData.objective || '').substring(0, 150) + '…'
                        : tpData.objective || 'Objective not available'}
                    </p>
                    <div style={{ display:'flex',gap:'4px',flexWrap:'wrap',marginBottom:'0.5rem' }}>
                      {(tpData.inScope || []).slice(0, 3).map((s,i) => (
                        <span key={i} style={{ ...tag('#10b981'),fontSize:'0.6rem' }}>
                          {s.length > 28 ? s.substring(0,28)+'…' : s}
                        </span>
                      ))}
                    </div>
                    <div style={{ display:'flex',gap:'6px' }}>
                      <span style={{ ...tag('#60a5fa') }}>{(tpData.testTypes || []).length} Test Types</span>
                      <span style={{ ...tag('#ef4444') }}>{(tpData.risks || []).length} Risks</span>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize:'0.75rem',color:'#475569',textAlign:'center',padding:'0.5rem 0' }}>No test plan loaded. Complete Stage 2 first.</div>
                )}
              </div>
            </div>

            {/* Generate Button */}
            <div style={card}>
              <div style={{ padding:'0.75rem 1.1rem' }}>
                <button
                  id="generate-scenarios-btn"
                  onClick={handleGenerate}
                  disabled={generating || (activeStories.length === 0 && !tpData)}
                  style={{
                    width:'100%',
                    background: generating
                      ? 'rgba(59,130,246,0.2)'
                      : 'linear-gradient(135deg,#60a5fa,#3b82f6)',
                    border:'none', padding:'0.7rem', borderRadius:'8px', color:'white',
                    fontWeight:700, fontSize:'0.85rem',
                    cursor: (generating || (!activeStories.length && !tpData)) ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                    boxShadow: generating ? 'none' : '0 4px 14px rgba(59,130,246,0.35)'
                  }}
                >
                  {generating ? <Ic.Loader/> : <IconSparkles/>}
                  {generating ? 'Deriving Scenarios…' : 'Generate Test Scenarios'}
                </button>
              </div>
            </div>

            {/* AI Insight */}
            <div style={{ background:'rgba(59,130,246,0.07)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'10px',padding:'1rem 1.1rem' }}>
              <div style={{ display:'flex',gap:'8px',alignItems:'flex-start' }}>
                <div style={{ color:'#60a5fa',flexShrink:0 }}><IconSparkles/></div>
                <div>
                  <div style={{ fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.06em',color:'#60a5fa',marginBottom:'4px' }}>AI INSIGHT</div>
                  <p style={{ margin:'0 0 8px',fontSize:'0.76rem',color:'#93c5fd',lineHeight:1.5 }}>
                    {scenarios.length > 0
                      ? <>
                          <strong>{scenarios.length}</strong> scenarios derived covering <strong>{linkedStories.length}</strong> stories. <strong>{highPrioCount}</strong> high-priority paths identified. Story coverage: <strong>{coveragePct}%</strong>.
                        </>
                      : <>{activeStories.length} user stories and {tpData ? 'a validated test plan' : 'no test plan'} available as input. Click Generate to derive scenarios.</>
                    }
                  </p>
                  {generated && coveragePct < 100 && scenarios.length > 0 && (
                    <p style={{ margin:0,fontSize:'0.72rem',color:'#64748b' }}>💡 Some stories may lack scenario coverage. Consider regenerating for full traceability.</p>
                  )}
                  {generated && scenarios.length > 0 && (
                    <div style={{ display:'flex',gap:'6px',marginTop:'8px' }}>
                      <button onClick={selectAll} style={{ ...btn('#3b82f6'),fontSize:'0.7rem' }}>Auto Select All</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════
              CENTER — Scenario Cards / Table
              ════════════════════════════════ */}
          <div style={{ display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0 }}>

            {/* Header bar */}
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.85rem',flexShrink:0 }}>
              <div>
                <h2 style={{ fontSize:'1.1rem',fontWeight:700,margin:'0 0 2px' }}>Derived Test Scenarios</h2>
                <p style={{ margin:0,fontSize:'0.75rem',color:'#475569' }}>
                  {scenarios.length > 0
                    ? `${scenarios.length} scenarios  •  ${selected.size} selected  •  Editable`
                    : 'Generate scenarios to populate this view'}
                </p>
              </div>
              {scenarios.length > 0 && (
                <div style={{ display:'flex',gap:'6px' }}>
                  <button onClick={() => toast.success("Scenario state saved.")} style={btn('#10b981')}><Ic.Save/>Save</button>
                  <button onClick={handleExport} style={btn('#60a5fa')}><Ic.Export/>Export</button>
                  <button onClick={handleShare} style={{ ...btn('#3b82f6'), display:'flex', alignItems:'center', gap:'6px' }}><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Share</button>
                  <button onClick={handleGenerate} disabled={generating} style={{ ...btn('#f97316') }}><Ic.Refresh/>Regen</button>
                </div>
              )}
            </div>

            {/* Search & Filter bar */}
            {scenarios.length > 0 && (
              <div style={{ display:'flex',gap:'8px',marginBottom:'0.75rem',flexShrink:0 }}>
                <div style={{ flex:1,display:'flex',alignItems:'center',...inp }}>
                  <IconSearch/>
                  <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search scenarios…" style={{ background:'transparent',border:'none',color:'white',marginLeft:'6px',outline:'none',fontSize:'0.78rem',width:'100%' }}/>
                </div>
                <select value={filterPrio} onChange={e=>setFilterPrio(e.target.value)} style={{ ...inp,width:'120px' }}>
                  <option value="All">All Priority</option>
                  {['Critical','High','Medium','Low'].map(p=><option key={p}>{p}</option>)}
                </select>
                <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ ...inp,width:'130px' }}>
                  <option value="All">All Types</option>
                  {types.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            )}

            {/* ── Skeleton loading ── */}
            {generating && (
              <div style={{ flex:1,display:'flex',flexDirection:'column',gap:'0.75rem',overflowY:'auto' }}>
                {[1,2,3,4,5].map(n=>(
                  <div key={n} style={{ ...card,padding:'1.25rem',minHeight:'90px' }}>
                    {[70,50,85,40].map((w,i)=>(
                      <div key={i} style={{ height:'11px',borderRadius:'5px',background:'rgba(255,255,255,0.05)',marginBottom:'0.65rem',width:`${w}%`,animation:'pulse 1.4s ease-in-out infinite' }}/>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* ── Scenario cards (generated) ── */}
            {!generating && generated && scenarios.length > 0 && (
              <div style={{ flex:1,overflowY:'auto',paddingBottom:'5rem',paddingRight:'4px',display:'flex',flexDirection:'column',gap:'0.65rem' }}>
                {visible.map(sc => {
                  const isSelected = selected.has(sc.id);
                  const isExpanded = expanded === sc.id;
                  return (
                    <div key={sc.id} style={{
                      ...card,
                      border:`1px solid ${isSelected ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.07)'}`,
                      transition:'border .2s, background .2s',
                      background: isSelected ? 'rgba(15,23,55,0.8)' : 'rgba(15,23,42,0.7)'
                    }}>
                      {/* Card header — clickable for selection */}
                      <div style={{ display:'flex',alignItems:'flex-start',gap:'0.75rem',padding:'1rem 1.1rem',cursor:'pointer' }} onClick={()=>toggleSelect(sc.id)}>
                        {/* Checkbox */}
                        <div style={{
                          width:'18px',height:'18px',borderRadius:'5px',
                          border: isSelected ? 'none' : '2px solid rgba(255,255,255,0.2)',
                          background: isSelected ? '#3b82f6' : 'transparent',
                          display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'2px'
                        }}>
                          {isSelected && <Ic.Check/>}
                        </div>

                        {/* Content */}
                        <div style={{ flex:1,minWidth:0 }}>
                          {/* Badge row */}
                          <div style={{ display:'flex',alignItems:'center',gap:'6px',marginBottom:'6px',flexWrap:'wrap' }}>
                            <span style={{ fontSize:'0.7rem',fontWeight:700,color:'#3b82f6',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',padding:'2px 8px',borderRadius:'6px' }}>{sc.id}</span>
                            <span style={{ ...tag(PRIO_C[sc.priority]||'#64748b') }}>{sc.priority}</span>
                            <span style={{ ...tag(TYPE_C[sc.type]||'#94a3b8') }}>{sc.type}</span>
                            {sc.linkedStory && (
                              <span style={{ fontSize:'0.65rem',color:'#475569',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',padding:'1px 7px',borderRadius:'6px' }}>↳ {sc.linkedStory}</span>
                            )}
                            <span style={{ ...tag(STATUS_C[sc.status]||'#94a3b8') }}>{sc.status || 'Draft'}</span>
                          </div>
                          {/* Scenario name */}
                          <h3 style={{ fontSize:'0.95rem',fontWeight:600,margin:'0 0 4px',color:'#f8fafc' }}>{sc.name}</h3>
                          {/* Description (clamped) */}
                          <p style={{ fontSize:'0.8rem',color:'#94a3b8',margin:0,lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{sc.description}</p>
                        </div>

                        {/* Expand button */}
                        <button onClick={e=>{e.stopPropagation();setExpanded(isExpanded?null:sc.id)}} style={{
                          background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',
                          color:'#94a3b8',padding:'4px 10px',borderRadius:'6px',cursor:'pointer',
                          display:'flex',alignItems:'center',gap:'5px',fontSize:'0.72rem',fontWeight:600,flexShrink:0
                        }}>
                          <Ic.Expand/> {isExpanded ? 'Hide' : 'Details'}
                        </button>
                      </div>

                      {/* ── Expanded details ── */}
                      {isExpanded && (
                        <div style={{ padding:'0 1.1rem 1.1rem',borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                          {/* Preconditions */}
                          {sc.preconditions && (
                            <div style={{ marginTop:'0.85rem' }}>
                              <div style={{ fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.07em',color:'#475569',marginBottom:'0.5rem' }}>PRECONDITIONS</div>
                              <div style={{ ...inCard,fontSize:'0.8rem',color:'#94a3b8',lineHeight:1.6 }}>{sc.preconditions}</div>
                            </div>
                          )}

                          {/* Test Conditions */}
                          {sc.testConditions && sc.testConditions.length > 0 && (
                            <div style={{ marginTop:'0.85rem' }}>
                              <div style={{ fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.07em',color:'#475569',marginBottom:'0.5rem' }}>TEST CONDITIONS</div>
                              <div style={{ ...inCard,padding:'0.5rem 0' }}>
                                {sc.testConditions.map((tc,i) => (
                                  <div key={i} style={{
                                    display:'flex',gap:'10px',padding:'0.45rem 1rem',alignItems:'flex-start',
                                    borderBottom: i < sc.testConditions.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                                  }}>
                                    <span style={{ fontSize:'0.7rem',fontWeight:700,color:'#3b82f6',flexShrink:0,width:'45px',marginTop:'2px' }}>{tc.conditionId}</span>
                                    <span style={{ fontSize:'0.78rem',color:'#e2e8f0',flex:1,lineHeight:1.4 }}>{tc.condition}</span>
                                    <span style={{ fontSize:'0.75rem',color:'#10b981',flexShrink:0,maxWidth:'200px',lineHeight:1.4 }}>→ {tc.expectedOutcome}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Business Impact */}
                          {sc.businessImpact && (
                            <div style={{ marginTop:'0.85rem' }}>
                              <div style={{ fontSize:'0.68rem',fontWeight:700,letterSpacing:'0.07em',color:'#475569',marginBottom:'0.5rem' }}>BUSINESS IMPACT</div>
                              <div style={{ ...inCard,fontSize:'0.78rem',color:'#f59e0b',lineHeight:1.5,borderLeft:'3px solid #f59e0b' }}>{sc.businessImpact}</div>
                            </div>
                          )}

                          {/* Test Level */}
                          {sc.testLevel && (
                            <div style={{ marginTop:'0.65rem',display:'flex',gap:'6px',alignItems:'center' }}>
                              <span style={{ fontSize:'0.68rem',fontWeight:700,color:'#475569' }}>Test Level:</span>
                              <span style={{ ...tag('#06b6d4') }}>{sc.testLevel}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {visible.length === 0 && scenarios.length > 0 && (
                  <div style={{ textAlign:'center',padding:'2rem',color:'#475569',fontSize:'0.85rem' }}>No scenarios match your current filters.</div>
                )}
              </div>
            )}

            {/* ── Generated but empty (parse error) ── */}
            {!generating && generated && scenarios.length === 0 && (
              <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#374151' }}>
                <div style={{ fontSize:'2.5rem',marginBottom:'1rem' }}>⚠️</div>
                <div style={{ fontSize:'1rem',fontWeight:600,color:'#64748b' }}>Generation completed but no scenarios were parsed.</div>
                <div style={{ fontSize:'0.82rem',color:'#475569',marginTop:'4px' }}>Check LLM configuration and try regenerating.</div>
              </div>
            )}

            {/* ── Empty state (never generated) ── */}
            {!generated && !generating && (
              <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#374151' }}>
                <div style={{ fontSize:'2.5rem',marginBottom:'1rem' }}>🧪</div>
                <div style={{ fontSize:'1rem',fontWeight:600,color:'#64748b' }}>
                  Click <strong style={{ color:'#a78bfa' }}>Generate Test Scenarios</strong> to derive scenarios.
                </div>
                <div style={{ fontSize:'0.82rem',color:'#475569',marginTop:'4px' }}>Requires completed User Stories and Test Plan from previous stages.</div>
              </div>
            )}
          </div>

          {/* ═════════════════════════
              RIGHT — Metrics Panel
              ═════════════════════════ */}
          <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',overflowY:'auto',paddingBottom:'4rem',paddingLeft:'4px' }}>

            {/* Scenario Metrics */}
            <div style={card}>
              <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>SCENARIO METRICS</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',background:'rgba(255,255,255,0.05)' }}>
                {[
                  { label:'Total',     val:scenarios.length,       color:'#3b82f6' },
                  { label:'Selected',  val:selected.size,          color:'#60a5fa' },
                  { label:'High Prio', val:highPrioCount,          color:'#ef4444' },
                  { label:'Coverage',  val:coveragePct+'%',        color:'#10b981' },
                  { label:'Types',     val:types.length,           color:'#f97316' },
                  { label:'Stories',   val:linkedStories.length,   color:'#06b6d4' },
                ].map((m,i)=>(
                  <div key={i} style={{ padding:'0.75rem 0.85rem',background:'rgba(15,23,42,0.7)' }}>
                    <div style={{ fontSize:'1.4rem',fontWeight:800,color:m.color }}>{m.val}</div>
                    <div style={{ fontSize:'0.65rem',color:'#64748b',fontWeight:600,marginTop:'1px' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage by Type */}
            <div style={card}>
              <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>COVERAGE BY TYPE</div>
              <div style={{ padding:'0.75rem 1rem' }}>
                {scenarios.length > 0 ? Object.entries(typeCounts).map(([type, count],i) => (
                  <div key={i} style={{ display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.6rem' }}>
                    <span style={{ fontSize:'0.74rem',color:'#94a3b8',width:'85px',flexShrink:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{type}</span>
                    <div style={{ flex:1,height:'5px',background:'rgba(255,255,255,0.06)',borderRadius:'3px',overflow:'hidden' }}>
                      <div style={{ width:`${(count/scenarios.length)*100}%`,height:'100%',background:TYPE_C[type]||'#94a3b8',borderRadius:'3px',transition:'width 1s ease' }}/>
                    </div>
                    <span style={{ fontSize:'0.7rem',fontWeight:700,color:TYPE_C[type]||'#94a3b8',width:'20px',textAlign:'right' }}>{count}</span>
                  </div>
                )) : (
                  <div style={{ fontSize:'0.75rem',color:'#475569',textAlign:'center',padding:'0.5rem 0' }}>Generate scenarios to see coverage.</div>
                )}
              </div>
            </div>

            {/* AI Review Checks */}
            <div style={card}>
              <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>AI REVIEW</div>
              <div style={{ padding:'0.75rem 1rem',display:'flex',flexDirection:'column',gap:'0.5rem' }}>
                {[
                  { ok: scenarios.length >= 8,                                                            txt:'Sufficient count (≥8 scenarios)' },
                  { ok: coveragePct >= 80,                                                                txt:'Story coverage ≥ 80%' },
                  { ok: types.length >= 3,                                                                txt:'Multi-type coverage (≥3 types)' },
                  { ok: scenarios.some(s => s.type === 'Negative' || s.type === 'Edge Case'),             txt:'Negative/edge cases included' },
                  { ok: scenarios.every(s => s.preconditions),                                            txt:'All preconditions defined' },
                  { ok: scenarios.every(s => s.testConditions && s.testConditions.length > 0),            txt:'Test conditions populated' },
                ].map((c,i)=>(
                  <div key={i} style={{ display:'flex',gap:'7px',alignItems:'flex-start',fontSize:'0.74rem',color:c.ok?'#94a3b8':'#fbbf24',lineHeight:1.4 }}>
                    <span style={{ color:c.ok?'#10b981':'#f59e0b',flexShrink:0,marginTop:'2px' }}>{c.ok ? <Ic.Check/> : <Ic.Warn/>}</span>{c.txt}
                  </div>
                ))}
              </div>
            </div>

            {/* Export Actions */}
            <div style={card}>
              <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>EXPORT</div>
              <div style={{ padding:'0.75rem 1rem',display:'flex',flexDirection:'column',gap:'0.45rem' }}>
                {[['Export CSV','#10b981'],['Export PDF','#60a5fa'],['Sync to Jira','#f97316'],['→ Test Cases','#3b82f6']].map(([l,c])=>(
                  <button
                    key={l}
                    onClick={l.includes('Test Cases') ? ()=>navigate('/test-cases') : undefined}
                    style={{ ...btn(c),justifyContent:'center',fontSize:'0.73rem' }}
                  >
                    <Ic.Export/>{l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════ Sticky Bottom Bar ════ */}
        {generated && scenarios.length > 0 && (
          <div style={{
            position:'absolute',bottom:'1.25rem',left:'284px',right:'1rem',
            background:'rgba(10,16,32,0.97)',border:'1px solid rgba(139,92,246,0.25)',
            borderRadius:'14px',padding:'0.85rem 1.5rem',
            display:'flex',alignItems:'center',justifyContent:'space-between',
            backdropFilter:'blur(12px)',boxShadow:'0 -4px 30px rgba(0,0,0,0.5)',zIndex:30
          }}>
            <div style={{ display:'flex',alignItems:'center',gap:'1rem' }}>
              <span style={{ background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.25)',color:'#10b981',padding:'0.35rem 0.85rem',borderRadius:'7px',fontSize:'0.78rem',fontWeight:700 }}>✅ Scenarios Ready</span>
              <span style={{ fontSize:'0.78rem',color:'#64748b' }}>{scenarios.length} scenarios · {selected.size} selected · {coveragePct}% story coverage</span>
            </div>
            <div style={{ display:'flex',gap:'0.65rem' }}>
              <button style={{ ...btn('#60a5fa'),fontSize:'0.78rem' }}><Ic.Export/> Export</button>
              <button
                id="proceed-test-cases-btn"
                onClick={()=>{
                  sessionStorage.setItem('ts_scenarios', JSON.stringify(scenarios));
                  sessionStorage.setItem('ts_selected', JSON.stringify(Array.from(selected)));
                  navigate('/test-cases');
                }}
                style={{
                  display:'flex',alignItems:'center',gap:'8px',
                  background:'linear-gradient(135deg,#60a5fa,#3b82f6)',
                  border:'none',padding:'0.65rem 1.5rem',borderRadius:'9px',
                  color:'white',fontWeight:700,fontSize:'0.88rem',cursor:'pointer',
                  boxShadow:'0 4px 14px rgba(59,130,246,0.35)'
                }}
              >
                Proceed to Test Cases <Ic.Send/>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}}`}</style>
    </div>
  );
}

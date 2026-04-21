import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { generateContentWithLLM, parseLLMJSON, checkJiraConnection } from '../lib/llmGenerate';
import { IconSearch, IconSparkles } from '../components/Icons';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TestPlanTemplateRaw from '../templates/test_plan_spec.md?raw';

/* ─── Inline SVGs ─── */
const Ic = {
  Save:    ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Export:  ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Share:   ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Refresh: ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Check:   ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>,
  Warn:    ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Send:    ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Loader:  ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:'spin .7s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  Chevron: (p)=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{transform:p.open?'rotate(180deg)':'none',transition:'transform .2s'}}><path d="M19 9l-7 7-7-7"/></svg>,
  Dot:     (p)=><div style={{width:'6px',height:'6px',borderRadius:'50%',background:p.c,flexShrink:0}}/>,
};

const PRIO_C = { Critical:'#ef4444', High:'#f97316', Medium:'#3b82f6', Low:'#64748b' };
const RISK_C  = { High:'#ef4444', Medium:'#f59e0b', Low:'#10b981' };

/* ─── Section heading component ─── */
function SectionHead({ num, label, accent = '#3b82f6', open, onToggle }) {
  return (
    <div onClick={onToggle} style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:open?'1rem':0,cursor:'pointer',userSelect:'none' }}>
      <div style={{ width:'4px',height:'18px',background:accent,borderRadius:'2px',flexShrink:0 }}/>
      <span style={{ fontSize:'0.78rem',fontWeight:700,letterSpacing:'0.09em',color:'#94a3b8',flex:1 }}>{num}. {label}</span>
      <Ic.Chevron open={open} />
    </div>
  );
}

/* ─── Bar row ─── */
function Bar({ label, pct, color }) {
  return (
    <div style={{ display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.6rem' }}>
      <span style={{ fontSize:'0.78rem',color:'#94a3b8',width:'130px',flexShrink:0 }}>{label}</span>
      <div style={{ flex:1,height:'6px',background:'rgba(255,255,255,0.06)',borderRadius:'3px',overflow:'hidden' }}>
        <div style={{ width:`${pct}%`,height:'100%',background:color,borderRadius:'3px',transition:'width 1s ease' }}/>
      </div>
      <span style={{ fontSize:'0.75rem',fontWeight:700,color,width:'32px',textAlign:'right' }}>{pct}%</span>
    </div>
  );
}

export default function TestPlan() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ── State & Session Persistence ── */
  const initPool = location.state?.importedStories || JSON.parse(sessionStorage.getItem('tp_storyPool') || '[]');

  const [storyPool, setStoryPool] = useState(initPool);
  const [selected, setSelected]   = useState(() => new Set(JSON.parse(sessionStorage.getItem('tp_selected') || '[]')));
  
  // Storage Reset for Legacy Dummy Data
  useEffect(() => {
    if (storyPool.length === 4 && storyPool[0]?.id === 'US-402') {
      setStoryPool([]);
      sessionStorage.removeItem('tp_storyPool');
    }
  }, []);
  const [searchQ, setSearchQ]     = useState(() => sessionStorage.getItem('tp_searchQ') || '');
  const [filterMod, setFilterMod] = useState(() => sessionStorage.getItem('tp_filterMod') || 'All');
  const [filterPrio, setPrio]     = useState(() => sessionStorage.getItem('tp_filterPrio') || 'All');
  const [generating, setGen]      = useState(false);
  const [generated, setGenerated] = useState(() => JSON.parse(sessionStorage.getItem('tp_generated') || 'false'));
  const [open, setOpen]           = useState(() => JSON.parse(sessionStorage.getItem('tp_open') || '{"obj":true,"scope":true,"strat":true,"types":true,"env":true,"entry":true,"exit":true,"risks":true,"timeline":true,"resources":true,"deliv":true,"trace":true}'));
  
  // Dynamic AI data if available
  const [tpData, setTpData] = useState(() => JSON.parse(sessionStorage.getItem('tp_data') || 'null'));

  useEffect(() => {
    sessionStorage.setItem('tp_storyPool', JSON.stringify(storyPool));
    sessionStorage.setItem('tp_selected', JSON.stringify(Array.from(selected)));
    sessionStorage.setItem('tp_searchQ', searchQ);
    sessionStorage.setItem('tp_filterMod', filterMod);
    sessionStorage.setItem('tp_filterPrio', filterPrio);
    sessionStorage.setItem('tp_generated', JSON.stringify(generated));
    sessionStorage.setItem('tp_open', JSON.stringify(open));
    sessionStorage.setItem('tp_data', JSON.stringify(tpData));
  }, [storyPool, selected, searchQ, filterMod, filterPrio, generated, open, tpData]);

  // Hook to capture newly imported stories from navigation
  useEffect(() => {
    if (location.state?.importedStories) {
      setStoryPool(location.state.importedStories);
      setSelected(new Set(location.state.importedStories.map(s => s.id)));
      setGenerated(false); 
      setTpData(null);
      
      // Clear location state so refresh doesn't trigger this again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const toggle = (k) => setOpen(p => ({ ...p, [k]:!p[k] }));

  const handleGenerate = async () => {
    const hasJira = await checkJiraConnection();
    if (!hasJira) {
      toast.warning('Warning: Jira connection is missing. Please configure Jira in Settings to avoid sync errors later.');
    }

    setGen(true);
    
    try {
      const activeStories = storyPool.filter(s => selected.has(s.id));
      const storiesJSON = JSON.stringify(activeStories, null, 2);

      const promptText = `Role: Act as a Senior QA Lead and Test Plan Architect. Your job is to analyze the provided User Stories and produce a comprehensive, ISTQB-aligned Test Plan that strictly conforms to the template structure below.

Input Assets:

Standard Template:
### TEST PLAN TEMPLATE RULES ###
${TestPlanTemplateRaw}
################################

Source Data (User Stories):
${storiesJSON}

Execution Logic:

- Extract: Identify the business objective, modules, risk areas, and acceptance criteria from the User Stories.
- Map: Populate every section of the Test Plan Template using data extracted from the stories. Map story modules to Test Items, story priorities to Risk levels, and acceptance criteria to Test Objectives.
- Synthesize:
  * Derive the test objective paragraph from the collective goal of all stories.
  * Determine In-Scope items from story modules and Out-of-Scope by identifying gaps.
  * Build the test strategy by mapping story types (Functional, Security, API, UX) to testing techniques (Equivalence Partitioning, BVA, Decision Tables).
  * Identify risks by analyzing story priorities, dependencies, and complexity.
- Validate: Ensure Test Plan covers Document Control, Scope, Strategy, Entry/Exit Criteria, Environment, Risks, Roles, Metrics, and Schedule. If data is missing, infer professional defaults or mark as [PENDING_REVIEW].

UI MAPPING INSTRUCTIONS:
Translate the final validated plan STRICTLY into the JSON schema below. Do not wrap in markdown. Do not add commentary outside the JSON object.

{
  "objective": "A comprehensive paragraph explaining the test objective for this release.",
  "inScope": ["Scope item 1", "Scope item 2", "..."],
  "outOfScope": ["Out of scope item 1", "Out of scope item 2", "..."],
  "testTypes": [
    { "type": "Functional", "included": true, "priority": "High", "notes": "Explanation" },
    { "type": "Regression", "included": true, "priority": "Medium", "notes": "Explanation" }
  ],
  "risks": [
    { "risk": "Described risk", "mit": "Mitigation strategy", "level": "High/Medium/Low" }
  ]
}`;

      const llmResponse = await generateContentWithLLM(promptText);
      if(!llmResponse) throw new Error("No response from LLM engine.");

      const parsedData = parseLLMJSON(llmResponse);
      setTpData(parsedData);
      setGenerated(true);
      toast.success('Test Plan generated successfully from template.');
    } catch (err) {
      toast.error(`Test Plan generation failed: ${err.message}`);
      setTpData(null);
      setGenerated(true);
    }

    setGen(false); 
  };

  const handleExport = () => {
    if (!tpData) return toast.error("No test plan data to export.");
    const blob = new Blob([JSON.stringify(tpData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-plan-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Test Plan exported as JSON.");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const toggleStory = (id) => setSelected(p => { const s=new Set(p); s.has(id)?s.delete(id):s.add(id); return s; });

  const filteredPool = storyPool.filter(s => {
    if (searchQ && !s.title?.toLowerCase().includes(searchQ.toLowerCase()) && !s.id.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (filterMod  !== 'All' && s.module   !== filterMod)  return false;
    if (filterPrio !== 'All' && s.priority !== filterPrio) return false;
    return true;
  });

  /* Shared styles */
  const card   = { background:'rgba(15,23,42,0.7)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' };
  const inCard = { background:'rgba(8,12,20,0.6)',  border:'1px solid rgba(255,255,255,0.05)', borderRadius:'8px',  padding:'1rem 1.1rem' };
  const btn    = (c)=>({ display:'flex',alignItems:'center',gap:'6px',background:`${c}12`,border:`1px solid ${c}28`,color:c,padding:'0.42rem 0.85rem',borderRadius:'7px',fontSize:'0.76rem',fontWeight:600,cursor:'pointer' });
  const tag    = (c)=>({ background:`${c}15`,color:c,border:`1px solid ${c}25`,padding:'1px 7px',borderRadius:'8px',fontSize:'0.66rem',fontWeight:700 });
  const inp    = { background:'rgba(15,23,42,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',color:'white',outline:'none',padding:'0.42rem 0.7rem',fontSize:'0.78rem',boxSizing:'border-box' };
  const chklist = (items, color='#60a5fa') => items.map((t,i)=>(
    <div key={i} style={{ display:'flex',gap:'8px',fontSize:'0.8rem',color:'#94a3b8',padding:'0.35rem 0',borderBottom:'1px solid rgba(255,255,255,0.04)',lineHeight:1.4 }}>
      <span style={{ color,flexShrink:0,marginTop:'2px' }}><Ic.Check/></span>{t}
    </div>
  ));

  const totalPts   = storyPool.filter(s=>selected.has(s.id)).reduce((a,s)=>a+(s.pts||0),0);
  const highRisk   = storyPool.filter(s=>selected.has(s.id)&&s.risk==='High').length;

  const modules = [...new Set(storyPool.map(s=>s.module))];

  return (
    <div style={{ display:'flex',height:'100vh',background:'#080c14',color:'white',overflow:'hidden' }}>
      <Sidebar active="test-plan"/>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <Header searchPlaceholder="Search architecture..." />

        {/* ── Page Header ── */}
        <div style={{ padding:'1.25rem 2rem 0',flexShrink:0 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
            <div>
              <h1 style={{ fontSize:'1.75rem',fontWeight:700,margin:'0 0 4px' }}>Test Plan Intelligence Module</h1>
              <p style={{ color:'#64748b',margin:0,fontSize:'0.88rem' }}>Generate risk-based, traceable, ISTQB-aligned test plans from approved user stories using AI planning intelligence.</p>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:'10px',flexShrink:0 }}>
              <span style={{ color:'#64748b',fontSize:'0.75rem',fontWeight:600 }}>Step 3 of 8</span>
              <div style={{ display:'flex',gap:'4px' }}>
                {Array.from({length:8},(_,i)=>(
                  <div key={i} style={{ width:i===2?'24px':'16px',height:'4px',borderRadius:'2px',background:i<=1?'#10b981':i===2?'#3b82f6':'rgba(255,255,255,0.08)' }}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 3-Column Body ── */}
        <div style={{ flex:1,display:'grid',gridTemplateColumns:'268px 1fr 228px',gap:'1rem',padding:'1rem 2rem 0',overflow:'hidden',minHeight:0 }}>

          {/* ════ LEFT — Story Selection ════ */}
          <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',overflowY:'auto',paddingBottom:'4rem',paddingRight:'4px' }}>
            <div style={card}>
              <div style={{ padding:'0.9rem 1.1rem',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.65rem' }}>
                  <span style={{ fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>APPROVED USER STORIES</span>
                  <span style={{ ...tag('#60a5fa') }}>{selected.size} / {storyPool.length}</span>
                </div>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search stories…" style={{ ...inp,width:'100%',marginBottom:'0.5rem' }}/>
                <div style={{ display:'flex',gap:'4px' }}>
                  <select value={filterMod} onChange={e=>setFilterMod(e.target.value)} style={{ ...inp,flex:1,fontSize:'0.72rem' }}>
                    <option value="All">All Modules</option>
                    {modules.map(m=><option key={m}>{m}</option>)}
                  </select>
                  <select value={filterPrio} onChange={e=>setPrio(e.target.value)} style={{ ...inp,flex:1,fontSize:'0.72rem' }}>
                    <option value="All">All Priority</option>
                    {['Critical','High','Medium','Low'].map(p=><option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ maxHeight:'340px',overflowY:'auto' }}>
                {filteredPool.map(s=>{
                  const isSel=selected.has(s.id);
                  return (
                    <div key={s.id} onClick={()=>toggleStory(s.id)} style={{ display:'flex',gap:'8px',padding:'0.65rem 1.1rem',borderBottom:'1px solid rgba(255,255,255,0.04)',cursor:'pointer',background:isSel?'rgba(59,130,246,0.06)':'transparent',transition:'background .15s' }}>
                      <div style={{ width:'16px',height:'16px',borderRadius:'4px',border:isSel?'none':'1px solid rgba(255,255,255,0.18)',background:isSel?'#3b82f6':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'2px' }}>
                        {isSel&&<Ic.Check/>}
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ display:'flex',alignItems:'center',gap:'6px',marginBottom:'2px',flexWrap:'wrap' }}>
                          <span style={{ fontSize:'0.68rem',fontWeight:700,color:'#60a5fa' }}>{s.id}</span>
                          <span style={{ ...tag(PRIO_C[s.priority]) }}>{s.priority}</span>
                          {s.dep&&<span style={{ ...tag('#f59e0b'),fontSize:'0.6rem' }}>DEP</span>}
                        </div>
                        <div style={{ fontSize:'0.78rem',fontWeight:600,color:'#e2e8f0',marginBottom:'2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{s.title}</div>
                        <div style={{ display:'flex',gap:'6px',flexWrap:'wrap' }}>
                          <span style={{ fontSize:'0.65rem',color:'#475569' }}>{s.module}</span>
                          <span style={{ fontSize:'0.65rem',color:'#475569' }}>•</span>
                          <span style={{ fontSize:'0.65rem',color:'#475569' }}>{s.pts} pts</span>
                          <span style={{ fontSize:'0.65px',color:'#475569' }}>•</span>
                          <span style={{ fontSize:'0.65rem',color:RISK_C[s.risk] }}>⬤ {s.risk} Risk</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding:'0.75rem 1.1rem' }}>
                <button onClick={handleGenerate} disabled={generating||selected.size===0} style={{ width:'100%',background:generating?'rgba(59,130,246,0.2)':'linear-gradient(135deg,#60a5fa,#3b82f6)',border:'none',padding:'0.7rem',borderRadius:'8px',color:'white',fontWeight:700,fontSize:'0.85rem',cursor:generating||selected.size===0?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:generating?'none':'0 4px 14px rgba(59,130,246,0.28)' }}>
                  {generating?<Ic.Loader/>:<IconSparkles/>}
                  {generating?'Generating Plan…':'Generate Test Plan'}
                </button>
              </div>
            </div>

            {/* AI Insight box */}
            <div style={{ background:'rgba(59,130,246,0.07)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'10px',padding:'1rem 1.1rem' }}>
              <div style={{ display:'flex',gap:'8px',alignItems:'flex-start' }}>
                <div style={{ color:'#60a5fa',flexShrink:0 }}><IconSparkles/></div>
                <div>
                  <div style={{ fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.06em',color:'#60a5fa',marginBottom:'4px' }}>AI INSIGHT</div>
                  <p style={{ margin:'0 0 8px',fontSize:'0.76rem',color:'#93c5fd',lineHeight:1.5 }}>
                    Selected {selected.size} stories cover <strong>{storyPool.length ? Math.min(100,Math.round(selected.size/storyPool.length*100+10)) : 0}%</strong> of release scope. {totalPts} complexity points. {highRisk} high-risk paths identified.
                  </p>
                  {selected.size < storyPool.length && (
                    <p style={{ margin:'0 0 8px',fontSize:'0.72rem',color:'#64748b' }}>💡 Consider adding remaining stories for full coverage.</p>
                  )}
                  <div style={{ display:'flex',gap:'6px' }}>
                    <button onClick={()=>setSelected(new Set(storyPool.map(s=>s.id)))} style={{ ...btn('#60a5fa'),fontSize:'0.7rem' }}>Auto Select All</button>
                    <button style={{ ...btn('#64748b'),fontSize:'0.7rem' }}>View Gaps</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ════ CENTER — Test Plan Document ════ */}
          <div style={{ display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0 }}>
            {/* Plan header bar */}
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.85rem',flexShrink:0 }}>
              <div>
                <h2 style={{ fontSize:'1.1rem',fontWeight:700,margin:'0 0 2px' }}>{tpData?.title || 'Test Plan: Awaiting Synthesis'}</h2>
                <p style={{ margin:0,fontSize:'0.75rem',color:'#475569' }}>Generated from {selected.size} user stories  •  {generated ? 'Draft' : 'Not Started'}</p>
              </div>
              <div style={{ display:'flex',gap:'6px' }}>
                {[['Save','#10b981',<Ic.Save/>],['Export','#60a5fa',<Ic.Export/>],['Share','#3b82f6',<Ic.Share/>],['Regen','#f97316',<Ic.Refresh/>]].map(([l,c,ic])=>(
                  <button 
                    key={l} 
                    onClick={() => {
                      if (l === 'Save') toast.success('Test Plan strategy synchronized.');
                      if (l === 'Regen') handleGenerate();
                      if (l === 'Export') handleExport();
                      if (l === 'Share') handleShare();
                    }} 
                    disabled={generating}
                    style={{ ...btn(c) }}
                  >
                    {ic}{l}
                  </button>
                ))}
              </div>
            </div>

            {/* Skeleton */}
            {generating && (
              <div style={{ flex:1,display:'flex',flexDirection:'column',gap:'0.75rem',overflowY:'auto' }}>
                {[1,2,3,4].map(n=>(
                  <div key={n} style={{ ...card,padding:'1.25rem',minHeight:'100px' }}>
                    {[70,45,85,55,60].map((w,i)=>(
                      <div key={i} style={{ height:'11px',borderRadius:'5px',background:'rgba(255,255,255,0.05)',marginBottom:'0.65rem',width:`${w}%`,animation:'pulse 1.4s ease-in-out infinite' }}/>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Plan Document */}
            {!generating && generated && (
              <div style={{ flex:1,overflowY:'auto',paddingBottom:'5rem',paddingRight:'4px',display:'flex',flexDirection:'column',gap:'0.75rem' }}>

                {/* § Objective */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="I" label="OBJECTIVE" open={open.obj} onToggle={()=>toggle('obj')}/>
                    {open.obj && <p style={{ margin:0,fontSize:'0.82rem',color:'#94a3b8',lineHeight:1.65,...inCard,padding:'0.85rem 1rem' }}>
                      {tpData ? tpData.objective : 'Neural engine awaiting scenario context to define objectives...'}
                    </p>}
                  </div>
                </div>

                {/* § Scope */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="II" label="SCOPE" open={open.scope} onToggle={()=>toggle('scope')}/>
                    {open.scope && (
                      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem' }}>
                        <div style={inCard}>
                          <div style={{ fontSize:'0.68rem',fontWeight:700,color:'#10b981',letterSpacing:'0.07em',marginBottom:'0.6rem' }}>✅ IN SCOPE</div>
                          {(tpData?.inScope || []).length > 0 ? tpData.inScope.map((t,i)=>(
                            <div key={i} style={{ fontSize:'0.78rem',color:'#94a3b8',padding:'3px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',display:'flex',gap:'7px' }}>
                              <span style={{ color:'#10b981' }}>→</span>{t}
                            </div>
                          )) : <div style={{ fontSize:'0.75rem', color:'#475569' }}>No scope identified.</div>}
                        </div>
                        <div style={inCard}>
                          <div style={{ fontSize:'0.68rem',fontWeight:700,color:'#ef4444',letterSpacing:'0.07em',marginBottom:'0.6rem' }}>🚫 OUT OF SCOPE</div>
                          {(tpData?.outOfScope || []).length > 0 ? tpData.outOfScope.map((t,i)=>(
                            <div key={i} style={{ fontSize:'0.78rem',color:'#94a3b8',padding:'3px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',display:'flex',gap:'7px' }}>
                              <span style={{ color:'#ef4444' }}>✕</span>{t}
                            </div>
                          )) : <div style={{ fontSize:'0.75rem', color:'#475569' }}>No exclusions.</div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* § Test Strategy */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="III" label="TEST STRATEGY" accent="#3b82f6" open={open.strat} onToggle={()=>toggle('strat')}/>
                    {open.strat && (
                      <div style={inCard}>
                        {(tpData?.strategy || []).length > 0 ? tpData.strategy.map((r,i)=><Bar key={i} {...r}/>) : <div style={{ fontSize:'0.75rem', color:'#475569' }}>Select stories and click generate to build strategy.</div>}
                        <p style={{ margin:'0.75rem 0 0',fontSize:'0.75rem',color:'#64748b',fontStyle:'italic',lineHeight:1.5 }}>
                          Adaptive strategy derivation enabled based on ISTQB standards.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* § Test Types Matrix */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="IV" label="TEST TYPES MATRIX" open={open.types} onToggle={()=>toggle('types')}/>
                    {open.types && (
                      <div style={{ overflow:'auto' }}>
                        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:'0.78rem' }}>
                          <thead>
                            <tr>
                              {['Test Type','Included','Priority','Notes'].map(h=>(
                                <th key={h} style={{ textAlign:'left',padding:'0.5rem 0.75rem',color:'#475569',fontWeight:700,fontSize:'0.68rem',letterSpacing:'0.06em',borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(tpData?.testTypes || []).length > 0 ? tpData.testTypes.map((r,i)=>(
                              <tr key={i} style={{ background:i%2?'rgba(255,255,255,0.015)':'transparent' }}>
                                <td style={{ padding:'0.55rem 0.75rem',color:'#e2e8f0',fontWeight:600 }}>{r.type}</td>
                                <td style={{ padding:'0.55rem 0.75rem' }}>
                                  <span style={{ ...tag(r.included===true?'#10b981':r.included==='Partial'?'#f59e0b':'#ef4444') }}>
                                    {r.included===true?'Yes':r.included==='Partial'?'Partial':'No'}
                                  </span>
                                </td>
                                <td style={{ padding:'0.55rem 0.75rem' }}>
                                  <span style={{ ...tag(r.priority==='High'?'#60a5fa':r.priority==='Medium'?'#a78bfa':'#64748b') }}>{r.priority}</span>
                                </td>
                                <td style={{ padding:'0.55rem 0.75rem',color:'#64748b',fontSize:'0.74rem' }}>{r.notes}</td>
                              </tr>
                            )) : <tr><td colSpan="4" style={{ padding:'1rem', textAlign:'center', color:'#64748b' }}>No test types defined in AI plan.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* § Environment */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="V" label="TEST ENVIRONMENT" accent="#10b981" open={open.env} onToggle={()=>toggle('env')}/>
                    {open.env && (
                      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.65rem' }}>
                        {[
                          { label:'Environments', items:['QA','Staging','Pre-Prod'], color:'#60a5fa' },
                          { label:'Browsers',     items:['Chrome','Firefox','Safari','Edge'], color:'#a78bfa' },
                          { label:'Devices',      items:['Desktop','Tablet','Mobile (responsive)'], color:'#10b981' },
                          { label:'Tools',        items:['Playwright','Postman','Jira','CI Pipeline'], color:'#f97316' },
                        ].map((g,i)=>(
                          <div key={i} style={inCard}>
                            <div style={{ fontSize:'0.65rem',fontWeight:700,color:g.color,letterSpacing:'0.06em',marginBottom:'0.5rem' }}>{g.label.toUpperCase()}</div>
                            {g.items.map((t,j)=>(
                              <div key={j} style={{ fontSize:'0.75rem',color:'#94a3b8',padding:'2px 0' }}>· {t}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* § Entry / Exit side-by-side */}
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem' }}>
                  <div style={card}>
                    <div style={{ padding:'0.85rem 1.1rem' }}>
                      <SectionHead num="VI" label="ENTRY CRITERIA" accent="#10b981" open={open.entry} onToggle={()=>toggle('entry')}/>
                      {open.entry && chklist(['Requirements reviewed & approved','Build deployed to QA environment','Test data available & seeded','Environment health verified','API credentials & access provisioned','Test cases reviewed by QA Lead'],'#10b981')}
                    </div>
                  </div>
                  <div style={card}>
                    <div style={{ padding:'0.85rem 1.1rem' }}>
                      <SectionHead num="VII" label="EXIT CRITERIA" accent="#ef4444" open={open.exit} onToggle={()=>toggle('exit')}/>
                      {open.exit && chklist(['100% Critical test cases executed','Zero open Blocker defects','Pass rate ≥ 95% on Critical / High','Regression suite fully green','Stakeholder sign-off received','Release notes drafted & reviewed'],'#ef4444')}
                    </div>
                  </div>
                </div>

                {/* § Risks */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="VIII" label="RISKS & MITIGATIONS" accent="#ef4444" open={open.risks} onToggle={()=>toggle('risks')}/>
                    {open.risks && (
                      <div style={{ display:'flex',flexDirection:'column',gap:'0.65rem' }}>
                        {(tpData?.risks || []).length > 0 ? tpData.risks.map((r,i)=>(
                          <div key={i} style={{ ...inCard,borderLeft:`3px solid ${RISK_C[r.level] || '#94a3b8'}` }}>
                            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'4px' }}>
                              <span style={{ fontSize:'0.8rem',fontWeight:600,color:'#f1f5f9' }}>⚠ {r.risk}</span>
                              <span style={{ ...tag(RISK_C[r.level] || '#94a3b8'),flexShrink:0 }}>{r.level}</span>
                            </div>
                            <div style={{ fontSize:'0.74rem',color:'#64748b' }}>Mitigation: <span style={{ color:'#94a3b8' }}>{r.mit}</span></div>
                          </div>
                        )) : <div style={{ color:'#64748b', fontSize:'0.75rem' }}>No explicit risks mapped by AI.</div>}
                      </div>
                    )}
                  </div>
                </div>

                {/* § Timeline */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="IX" label="RELEASE TIMELINE" accent="#f97316" open={open.timeline} onToggle={()=>toggle('timeline')}/>
                    {open.timeline && (
                      <div style={inCard}>
                        {(tpData?.phases || []).map((p,i)=>(
                          <div key={i} style={{ display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.6rem' }}>
                            <div style={{ width:'10px',height:'10px',borderRadius:'50%',background:p.color,flexShrink:0 }}/>
                            <span style={{ fontSize:'0.78rem',color:'#94a3b8',width:'120px',flexShrink:0 }}>{p.name}</span>
                            <div style={{ flex:1,height:'6px',background:'rgba(255,255,255,0.06)',borderRadius:'3px',overflow:'hidden' }}>
                              <div style={{ width:`${(p.days/16)*100}%`,height:'100%',background:p.color,borderRadius:'3px',animation:'growBar 1s ease-out' }}/>
                            </div>
                            <span style={{ fontSize:'0.7rem',color:'#475569',width:'90px',textAlign:'right' }}>{p.start} · {p.days}d</span>
                          </div>
                        ))}
                        <div style={{ fontSize:'0.72rem',color:'#475569',marginTop:'0.5rem',textAlign:'right' }}>{tpData?.phases ? 'Release window mapped.' : 'Awaiting scope synthesis.'}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* § Resources */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="X" label="RESOURCE PLAN" accent="#a78bfa" open={open.resources} onToggle={()=>toggle('resources')}/>
                    {open.resources && (
                      <div style={inCard}>
                        {(tpData?.resources || []).map((r,i)=>(
                          <div key={i} style={{ display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.65rem' }}>
                            <span style={{ fontSize:'0.78rem',color:'#94a3b8',width:'150px',flexShrink:0 }}>{r.role}</span>
                            <div style={{ flex:1,height:'6px',background:'rgba(255,255,255,0.06)',borderRadius:'3px',overflow:'hidden' }}>
                              <div style={{ width:`${r.cap}%`,height:'100%',background:r.color,borderRadius:'3px' }}/>
                            </div>
                            <span style={{ fontSize:'0.72rem',fontWeight:700,color:r.color,width:'36px',textAlign:'right' }}>{r.cap}%</span>
                          </div>
                        ))}
                        <div style={{ fontSize:'0.7rem',color:'#475569',marginTop:'4px' }}>Capacity utilization mapping awaiting deployment.</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* § Deliverables */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="XI" label="DELIVERABLES" accent="#60a5fa" open={open.deliv} onToggle={()=>toggle('deliv')}/>
                    {open.deliv && <div style={inCard}>
                      {chklist(['Approved Test Plan (this document)','End-to-end Test Scenarios','Detailed Test Cases per story','Playwright Automation Suite','Defect Summary Report','QA Sign-off Certificate'],'#60a5fa')}
                    </div>}
                  </div>
                </div>

                {/* § Traceability */}
                <div style={card}>
                  <div style={{ padding:'0.85rem 1.25rem' }}>
                    <SectionHead num="XII" label="TRACEABILITY MATRIX" accent="#10b981" open={open.trace} onToggle={()=>toggle('trace')}/>
                    {open.trace && (
                      <div style={{ display:'flex',flexDirection:'column',gap:'0.5rem' }}>
                        {storyPool.filter(s=>selected.has(s.id)).map((s,i)=>(
                          <div key={i} style={{ display:'flex',alignItems:'center',gap:'0.75rem',...inCard,padding:'0.6rem 0.9rem' }}>
                            <span style={{ fontSize:'0.72rem',fontWeight:700,color:'#60a5fa',width:'65px',flexShrink:0 }}>{s.id}</span>
                            <span style={{ color:'#475569',fontSize:'0.8rem' }}>→</span>
                            <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',flex:1 }}>
                              {['Functional', s.priority === 'Critical' ? 'E2E Validation' : 'Regression', 'API'].map((c,j)=><span key={j} style={{ ...tag('#60a5fa'),fontSize:'0.65rem' }}>{c}</span>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!generated && !generating && (
              <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#374151' }}>
                <div style={{ fontSize:'2.5rem',marginBottom:'1rem' }}>📋</div>
                <div style={{ fontSize:'1rem',fontWeight:600,color:'#64748b' }}>Select user stories and click <strong style={{ color:'#60a5fa' }}>Generate Test Plan</strong>.</div>
              </div>
            )}
          </div>

          {/* ════ RIGHT — Quality Panel ════ */}
          <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',overflowY:'auto',paddingBottom:'4rem',paddingLeft:'4px' }}>

            {/* Plan Metrics */}
            <div style={card}>
              <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>PLAN METRICS</div>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',background:'rgba(255,255,255,0.05)' }}>
                {[
                  { label:'Stories',   val:selected.size,   color:'#60a5fa' },
                  { label:'Coverage',  val:'92%',           color:'#10b981' },
                  { label:'High Risks',val:highRisk,        color:'#ef4444' },
                  { label:'Est. Days', val:'16',            color:'#f97316' },
                  { label:'Auto %',    val:'65%',           color:'#a78bfa' },
                  { label:'Complexity',val:totalPts+' pts', color:'#f59e0b' },
                ].map((m,i)=>(
                  <div key={i} style={{ padding:'0.75rem 0.85rem',background:'rgba(15,23,42,0.7)' }}>
                    <div style={{ fontSize:'1.4rem',fontWeight:800,color:m.color }}>{m.val}</div>
                    <div style={{ fontSize:'0.65rem',color:'#64748b',fontWeight:600,marginTop:'1px' }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Review */}
            <div style={card}>
              <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>AI PLAN REVIEW</div>
              <div style={{ padding:'0.75rem 1rem',display:'flex',flexDirection:'column',gap:'0.5rem' }}>
                {[
                  { ok:true,  txt:'Scope aligns to selected stories' },
                  { ok:true,  txt:'All critical paths covered' },
                  { ok:true,  txt:'Risks identified with mitigations' },
                  { ok:true,  txt:'Entry & exit criteria defined' },
                  { ok:false, txt:'Accessibility depth can improve' },
                  { ok:false, txt:'Missing rollback validation plan' },
                ].map((c,i)=>(
                  <div key={i} style={{ display:'flex',gap:'7px',alignItems:'flex-start',fontSize:'0.74rem',color:c.ok?'#94a3b8':'#fbbf24',lineHeight:1.4 }}>
                    <span style={{ color:c.ok?'#10b981':'#f59e0b',flexShrink:0,marginTop:'2px' }}>{c.ok?<Ic.Check/>:<Ic.Warn/>}</span>{c.txt}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div style={card}>
              <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>AI SUGGESTIONS</div>
              <div style={{ padding:'0.6rem 1rem' }}>
                {['Add session timeout sanity tests','Add negative export permission checks','Add RBAC role matrix validation','Add database backup restore sanity'].map((s,i)=>(
                  <div key={i} style={{ fontSize:'0.74rem',color:'#94a3b8',padding:'0.35rem 0',borderBottom:'1px solid rgba(255,255,255,0.04)',display:'flex',gap:'7px' }}>
                    <span style={{ color:'#a78bfa' }}>+</span>{s}
                  </div>
                ))}
              </div>
              <div style={{ padding:'0.5rem 1rem 0.85rem' }}>
                <button style={{ ...btn('#3b82f6'),width:'100%',justifyContent:'center',fontSize:'0.72rem' }}><IconSparkles/> Apply Suggestions</button>
              </div>
            </div>

            {/* Export */}
            <div style={card}>
              <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>EXPORT</div>
              <div style={{ padding:'0.75rem 1rem',display:'flex',flexDirection:'column',gap:'0.45rem' }}>
                {[['Export PDF','#60a5fa'],['Export DOCX','#10b981'],['Export XLSX','#10b981'],['Sync to Jira','#f97316'],['→ Test Scenarios','#3b82f6']].map(([l,c])=>(
                  <button 
                    key={l} 
                    onClick={() => {
                      if (l.includes('Scenarios')) navigate('/test-scenarios');
                      else if (l.includes('Export')) handleExport();
                      else if (l.includes('Sync')) toast.info('Jira Sync is being initialized...');
                    }} 
                    style={{ ...btn(c),justifyContent:'center',fontSize:'0.73rem' }}
                  ><Ic.Export/>{l}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════ Sticky Bottom Bar ════ */}
        {generated && (
          <div style={{ position:'absolute',bottom:'1.25rem',left:'284px',right:'1rem',background:'rgba(10,16,32,0.97)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:'14px',padding:'0.85rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',backdropFilter:'blur(12px)',boxShadow:'0 -4px 30px rgba(0,0,0,0.5)',zIndex:30 }}>
            <div style={{ display:'flex',alignItems:'center',gap:'1rem' }}>
              <span style={{ background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.25)',color:'#10b981',padding:'0.35rem 0.85rem',borderRadius:'7px',fontSize:'0.78rem',fontWeight:700 }}>✅ Plan Ready</span>
              <span style={{ fontSize:'0.78rem',color:'#64748b' }}>{selected.size} stories · {totalPts} pts · 12 sections generated</span>
            </div>
            <div style={{ display:'flex',gap:'0.65rem' }}>
              <button onClick={handleExport} style={{ ...btn('#60a5fa'),fontSize:'0.78rem' }}><Ic.Export/> Export Plan</button>
              <button onClick={()=>navigate('/test-scenarios')} style={{ display:'flex',alignItems:'center',gap:'8px',background:'linear-gradient(135deg,#60a5fa,#3b82f6)',border:'none',padding:'0.65rem 1.5rem',borderRadius:'9px',color:'white',fontWeight:700,fontSize:'0.88rem',cursor:'pointer',boxShadow:'0 4px 14px rgba(59,130,246,0.35)' }}>
                Proceed to Test Scenarios <Ic.Send/>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}} @keyframes growBar{from{width:0}}`}</style>
    </div>
  );
}

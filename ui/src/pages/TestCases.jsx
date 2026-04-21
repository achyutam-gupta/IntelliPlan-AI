import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateContentWithLLM, parseLLMJSON, checkJiraConnection } from '../lib/llmGenerate';
import { IconSearch, IconSparkles } from '../components/Icons';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TestCaseTemplateRaw from '../templates/test_case_spec.md?raw';

/* ─── Inline SVGs ─── */
const Ic = {
  Save:    ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  Export:  ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Refresh: ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Check:   ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>,
  Warn:    ()=><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Send:    ()=><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Loader:  ()=><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:'spin .7s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  Expand:  ()=><svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Code:    ()=><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>,
};

/* ─── Color maps ─── */
const PRIO_C = { Critical:'#ef4444', High:'#f97316', Medium:'#3b82f6', Low:'#64748b' };
const TYPE_C = { Functional:'#60a5fa', Security:'#10b981', Regression:'#3b82f6', API:'#60a5fa', Smoke:'#f97316', UAT:'#fb7185', Negative:'#f59e0b', 'Edge Case':'#fb7185', Performance:'#06b6d4' };

export default function TestCases() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (sessionStorage.getItem('guestMode') === 'true') {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  /* ── Load upstream data from sessionStorage ── */
  const scenarios   = JSON.parse(sessionStorage.getItem('ts_scenarios') || '[]');
  const tsSelected  = JSON.parse(sessionStorage.getItem('ts_selected')  || '[]');
  const storyPool   = JSON.parse(sessionStorage.getItem('us_stories')   || '[]');
  const tpData      = JSON.parse(sessionStorage.getItem('tp_data')      || 'null');

  /* ── State ── */
  const [cases, setCases] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('tc_cases') || '[]'); } catch { return []; }
  });
  
  const [selected, setSelected] = useState(() => {
    try {
      const stored = sessionStorage.getItem('tc_selected');
      const parsed = JSON.parse(stored || '[]');
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch { return new Set(); }
  });

  const [generating, setGen] = useState(false);
  const [generated, setGenerated] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('tc_generated') || 'false'); } catch { return false; }
  });

  const [expanded, setExpanded]     = useState(null);
  const [searchQ, setSearchQ]       = useState('');
  const [filterPrio, setFilterPrio] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [syncing, setSyncing]       = useState(false);

  const handleSyncJira = async () => {
    const selectedCases = cases.filter(c => selected.has(c.id));
    if (selectedCases.length === 0) return toast.error("No cases selected for sync.");
    
    setSyncing(true);
    let successCount = 0;
    
    try {
      const email = localStorage.getItem('jira_email');
      const token = localStorage.getItem('jira_token');
      if (!email || !token) throw new Error("Jira credentials missing in Settings.");
      const encoded = btoa(`${email}:${token}`);
      
      for (const tc of selectedCases) {
        let key = tc.jiraKey;
        if (!key) {
           const sc = scenarios.find(s => s.id === tc.linkedScenario);
           if (sc) {
              const us = storyPool.find(u => u.id === sc.linkedStory);
              if (us) key = us.jiraKey;
           }
        }
        
        if (!key) {
          console.warn(`[SYNC] No Jira Key found for ${tc.id}`);
          continue;
        }

        const syncContent = `AI-Generated Test Case: ${tc.title}\nID: ${tc.id}\nPriority: ${tc.priority}\n\nSteps:\n${(tc.steps||[]).map(s => `${s.step}. ${s.action} -> ${s.expected}`).join('\n')}`;

        const jiraBase = localStorage.getItem('jira_url')?.replace(/\/$/, '');
        if (!jiraBase) throw new Error("Jira URL missing in Settings.");

        const res = await fetch(`/api/v1/integrations/jira/rest/api/3/issue/${key}/comment`, {
          method: 'POST',
          headers: { 
            Authorization: `Basic ${encoded}`, 
            'Content-Type': 'application/json', 
            Accept: 'application/json',
            'x-target-base-url': jiraBase
          },
          body: JSON.stringify({
            body: { type: "doc", version: 1, content: [{ type: "paragraph", content: [{ type: "text", text: syncContent }] }] }
          })
        });

        if (res.ok) successCount++;
      }
      
      if (successCount > 0) toast.success(`Synced ${successCount} cases to Jira issues.`);
      else toast.error("Sync failed: No valid Jira links resolved.");
      
    } catch (err) {
      console.error(err);
      toast.error(`Sync error: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleExport = () => {
    if (!cases.length) return toast.error("No cases to export.");
    const blob = new Blob([JSON.stringify(cases, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-cases-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Test Cases exported as JSON.");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  /* ── Session persistence ── */
  useEffect(() => {
    sessionStorage.setItem('tc_cases',     JSON.stringify(cases));
    sessionStorage.setItem('tc_selected',  JSON.stringify(Array.from(selected)));
    sessionStorage.setItem('tc_generated', JSON.stringify(generated));
  }, [cases, selected, generated]);

  /* ── Build input context ── */
  const activeScenarios = tsSelected.length > 0
    ? scenarios.filter(s => tsSelected.includes(s.id))
    : scenarios;

  /* ── handleGenerate ── */
  const handleGenerate = async () => {
    if (activeScenarios.length === 0) return toast.error('No test scenarios found.');
    await checkJiraConnection();
    setGen(true);

    try {
      const scenariosJSON = JSON.stringify(activeScenarios, null, 2);
      const storiesJSON   = storyPool.length > 0 ? JSON.stringify(storyPool, null, 2) : 'No user stories available.';

      const promptText = `Role: Senior QA Automation Engineer (ISTQB Certified).
      Task: Decompose Scenarios into atomic, executable Test Cases.
      
      REQUIRED JSON SCHEMA (STRICT):
      [
        {
          "id": "TC-001",
          "title": "Verifiable title",
          "priority": "Critical|High|Medium|Low",
          "testType": "Functional|Security|Regression|API|Smoke|UAT",
          "automationCandidate": "Yes|No|Partial",
          "preconditions": "Environment/Data state",
          "steps": [
            { "step": 1, "action": "User action", "expected": "System response" }
          ],
          "expectedResult": "Overall outcome",
          "linkedScenario": "SC-XXX"
        }
      ]

      TEMPLATE:
      ${TestCaseTemplateRaw}
      
      INPUT DATA:
      Scenarios: ${scenariosJSON}
      Reference Stories: ${storiesJSON}

      Requirement: Generate EXACTLY 8-12 cases. Output ONLY the JSON array.`;

      const llmResponse = await generateContentWithLLM(promptText);
      if(!llmResponse) throw new Error("No response from AI");
      
      const rawParsed = parseLLMJSON(llmResponse);
      const items = Array.isArray(rawParsed) ? rawParsed : (rawParsed.testCases || []);
      
      // Normalization Layer: Map erratic LLM keys to UI schema
      const normalized = items.map(item => ({
        id: item.id || item.tc_id || item.caseId || `TC-${Math.floor(Math.random()*900)+100}`,
        title: item.title || item.test_title || item.name || item.testCaseTitle || 'Untitled Test Case',
        priority: item.priority || item.severity || 'Medium',
        testType: item.testType || item.type || 'Functional',
        automationCandidate: item.automationCandidate || item.automation || 'No',
        preconditions: item.preconditions || item.pre_req || 'Standard environment',
        steps: Array.isArray(item.steps) ? item.steps : (Array.isArray(item.testSteps) ? item.testSteps : []),
        expectedResult: item.expectedResult || item.final_outcome || '',
        linkedScenario: item.linkedScenario || item.scenario_id || ''
      }));
      
      setCases(normalized);
      setSelected(new Set(normalized.map(c => c.id)));
      setGenerated(true);
      toast.success(`${normalized.length} aligned cases generated.`);
    } catch (err) {
      console.error(err);
      toast.error(`Alignment failed: ${err.message}`);
    } finally {
      setGen(false);
    }
  };

  /* ── Helpers ── */
  const toggleSelect = (id) => setSelected(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const selectAll    = () => setSelected(new Set(cases.map(c => c.id)));
  const clearAll     = () => setSelected(new Set());

  const visible = cases.filter(c => {
    if (searchQ && !c.title?.toLowerCase().includes(searchQ.toLowerCase()) && !c.id?.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (filterPrio !== 'All' && c.priority !== filterPrio) return false;
    if (filterType !== 'All' && c.testType !== filterType) return false;
    return true;
  });

  const testTypes       = [...new Set(cases.map(c => c.testType).filter(Boolean))];
  const linkedScenarios = [...new Set(cases.map(c => c.linkedScenario).filter(Boolean))];
  const highPrioCount   = cases.filter(c => ['Critical','High','HIGH'].includes(c.priority)).length;
  const autoYes         = cases.filter(c => c.automationCandidate === 'Yes').length;
  const autoPartial     = cases.filter(c => c.automationCandidate === 'Partial').length;
  const autoReadyPct    = cases.length > 0 ? Math.round(((autoYes + autoPartial * 0.5) / cases.length) * 100) : 0;
  const scenarioCovPct  = activeScenarios.length > 0 ? Math.min(100, Math.round((linkedScenarios.length / activeScenarios.length) * 100)) : 0;
  const totalSteps      = cases.reduce((a, c) => a + (c.steps?.length || 0), 0);

  const typeCounts = {}; cases.forEach(c => { typeCounts[c.testType] = (typeCounts[c.testType] || 0) + 1; });
  const prioCounts = {}; cases.forEach(c => { prioCounts[c.priority] = (prioCounts[c.priority] || 0) + 1; });

  const card   = { background:'rgba(15,23,42,0.7)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' };
  const inCard = { background:'rgba(8,12,20,0.6)',  border:'1px solid rgba(255,255,255,0.05)', borderRadius:'8px', padding:'1rem 1.1rem' };
  const btn    = (c) => ({ display:'flex',alignItems:'center',gap:'6px',background:`${c}12`,border:`1px solid ${c}28`,color:c,padding:'0.42rem 0.85rem',borderRadius:'7px',fontSize:'0.76rem',fontWeight:600,cursor:'pointer' });
  const tag    = (c) => ({ background:`${c}15`,color:c,border:`1px solid ${c}25`,padding:'1px 7px',borderRadius:'8px',fontSize:'0.66rem',fontWeight:700 });
  const inp    = { background:'rgba(15,23,42,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',color:'white',outline:'none',padding:'0.42rem 0.7rem',fontSize:'0.78rem' };

  return (
    <div style={{ display:'flex',height:'100vh',background:'#080c14',color:'white',overflow:'hidden' }}>
      <Sidebar active="test-cases"/>

      <div style={{ flex:1,display:'flex',flexDirection:'column',overflow:'hidden' }}>
        
        <Header searchPlaceholder="Search test cases..." />

        <div style={{ padding:'1.25rem 2rem 0',flexShrink:0 }}>
          <h1 style={{ fontSize:'1.75rem',fontWeight:700,margin:'0 0 4px' }}>Test Case Specification Engine</h1>
          <p style={{ color:'#64748b',margin:0,fontSize:'0.88rem' }}>Atomic, executable test definitions derived from scenarios using AI precision engineering.</p>
        </div>

        <div style={{ flex:1,display:'grid',gridTemplateColumns:'268px 1fr 248px',gap:'1rem',padding:'1rem 2rem 0',overflow:'hidden' }}>
          
          {/* LEFT PANEL */}
          <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',overflowY:'auto',paddingBottom:'4rem' }}>
            <div style={card}>
              <div style={{ padding:'0.9rem 1.1rem',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize:'0.7rem',fontWeight:700,color:'#64748b' }}>SOURCE CONTEXT</span>
              </div>
              <div style={{ padding:'1rem' }}>
                <div style={{ fontSize:'1.1rem',fontWeight:800,color:'#60a5fa' }}>{activeScenarios.length}</div>
                <div style={{ fontSize:'0.65rem',color:'#64748b' }}>Active Scenarios</div>
                <button onClick={handleGenerate} disabled={generating} style={{ width:'100%',marginTop:'1rem',background:'linear-gradient(135deg,#60a5fa,#3b82f6)',border:'none',padding:'0.75rem',borderRadius:'8px',color:'white',fontWeight:700,cursor:'pointer' }}>
                  {generating ? 'Generating...' : 'Generate Test Cases'}
                </button>
              </div>
            </div>
            {/* AI Insight */}
            <div style={{ background:'rgba(59,130,246,0.07)',border:'1px solid rgba(59,130,246,0.2)',borderRadius:'10px',padding:'1rem 1.1rem' }}>
              <IconSparkles/><div style={{ fontSize:'0.7rem',fontWeight:700,color:'#60a5fa',marginTop:'4px' }}>AI INSIGHT</div>
              <p style={{ fontSize:'0.76rem',color:'#93c5fd',lineHeight:1.5 }}>{cases.length} cases cover {scenarioCovPct}% of scenarios. {autoReadyPct}% are ready for automation.</p>
            </div>
          </div>

          {/* CENTER PANEL */}
          <div style={{ display:'flex',flexDirection:'column',overflow:'hidden' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.85rem' }}>
               <h2 style={{ fontSize:'1.1rem',fontWeight:700,margin:0 }}>Specification Artifacts</h2>
               <div style={{ display:'flex',gap:'6px' }}>
                 <button onClick={selectAll} style={btn('#60a5fa')}>Select All</button>
                 <button onClick={clearAll} style={btn('#64748b')}>Clear</button>
               </div>
            </div>

            <div style={{ display:'flex',gap:'8px',marginBottom:'0.75rem' }}>
               <div style={{ flex:1,display:'flex',alignItems:'center',...inp }}><IconSearch/><input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search..." style={{ background:'transparent',border:'none',color:'white',marginLeft:'6px',outline:'none',width:'100%' }}/></div>
               <select value={filterPrio} onChange={e=>setFilterPrio(e.target.value)} style={{ ...inp,width:'120px' }}><option value="All">All Priority</option>{['Critical','High','Medium','Low'].map(p=><option key={p}>{p}</option>)}</select>
               <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ ...inp,width:'120px' }}><option value="All">All Types</option>{testTypes.map(t=><option key={t}>{t}</option>)}</select>
            </div>

            <div style={{ flex:1,overflowY:'auto',paddingBottom:'5rem',display:'flex',flexDirection:'column',gap:'0.65rem' }}>
              {generating && <div style={{ border:'1px dashed #3b82f6',padding:'2rem',borderRadius:'12px',textAlign:'center',color:'#60a5fa' }}>AI is decomposing scenarios...</div>}
              {visible.map(tc => {
                const isSelected = selected.has(tc.id);
                const isExpanded = expanded === tc.id;
                return (
                  <div key={tc.id} style={{ ...card,border:`1px solid ${isSelected?'rgba(59,130,246,0.5)':'rgba(255,255,255,0.07)'}`,background:isSelected?'rgba(15,23,55,0.8)':'rgba(15,23,42,0.7)' }}>
                    <div style={{ display:'flex',padding:'1rem',cursor:'pointer',alignItems:'center' }} onClick={()=>toggleSelect(tc.id)}>
                      <div style={{ width:'18px',height:'18px',border:'2px solid rgba(255,255,255,0.2)',borderRadius:'5px',background:isSelected?'#3b82f6':'transparent',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center' }}>{isSelected&&<Ic.Check/>}</div>
                      <div style={{ flex:1,marginLeft:'12px' }}>
                        <div style={{ display:'flex',gap:'6px',marginBottom:'4px' }}><span style={tag('#60a5fa')}>{tc.id}</span><span style={tag(PRIO_C[tc.priority]||'#64748b')}>{tc.priority}</span></div>
                        <div style={{ fontWeight:600 }}>{tc.title}</div>
                      </div>
                      <button onClick={(e)=>{e.stopPropagation();setExpanded(isExpanded?null:tc.id)}} style={btn('#94a3b8')}>{isExpanded?'Hide':'Steps'}</button>
                    </div>
                    {isExpanded && (
                      <div style={{ padding:'0 1rem 1rem',borderTop:'1px solid rgba(255,255,255,0.05)',marginTop:'0.5rem' }}>
                        <div style={{ fontSize:'0.75rem',color:'#64748b',marginTop:'1rem' }}><strong>PRECONDITIONS:</strong> {tc.preconditions}</div>
                        <div style={{ marginTop:'1rem',background:'rgba(0,0,0,0.2)',borderRadius:'8px',overflow:'hidden' }}>
                           {tc.steps?.map((s,i)=>(
                             <div key={i} style={{ display:'grid',gridTemplateColumns:'40px 1fr 1fr',padding:'8px 12px',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                               <span style={{ color:'#60a5fa',fontWeight:700 }}>{i+1}</span>
                               <span style={{ fontSize:'0.82rem' }}>{s.action}</span>
                               <span style={{ fontSize:'0.82rem',color:'#10b981' }}>{s.expected}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ display:'flex',flexDirection:'column',gap:'0.75rem',overflowY:'auto' }}>
            <div style={card}>
               <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,color:'#64748b' }}>COVERAGE</div>
               <div style={{ padding:'1.5rem 1rem',textAlign:'center' }}>
                  <div style={{ fontSize:'2rem',fontWeight:800,color:'#10b981' }}>{autoReadyPct}%</div>
                  <div style={{ fontSize:'0.7rem',color:'#64748b' }}>Automation Ready</div>
               </div>
            </div>
            <div style={card}>
               <div style={{ padding:'0.75rem 1rem',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:'0.66rem',fontWeight:700,color:'#64748b' }}>PRIORITY MATRIX</div>
               <div style={{ padding:'1rem' }}>
                  {Object.entries(prioCounts).map(([p,c])=>(
                    <div key={p} style={{ fontSize:'0.73rem',marginBottom:'6px',display:'flex',justifyContent:'space-between' }}>
                      <span style={{ color:PRIO_C[p]||'white' }}>{p}</span><span>{c}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>

        {generated && cases.length > 0 && (
          <div style={{ position:'absolute',bottom:'1.25rem',left:'284px',right:'1rem',background:'rgba(10,16,32,0.97)',border:'1px solid rgba(59,130,246,0.25)',borderRadius:'14px',padding:'0.85rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',backdropFilter:'blur(12px)',zIndex:100 }}>
            <div style={{ display:'flex',gap:'1.5rem',alignItems:'center' }}>
               <div><strong>{selected.size}</strong> cases selected</div>
               <div style={{ width:'1px',height:'20px',background:'rgba(255,255,255,0.1)' }} />
               <button onClick={handleSyncJira} disabled={syncing} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'white',padding:'0.6rem 1.2rem',borderRadius:'9px',fontSize:'0.82rem',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:'8px' }}>
                  {syncing ? <Ic.Loader/> : <Ic.Refresh/>} {syncing ? 'Syncing...' : 'Sync to Jira'}
               </button>
            </div>
            <button onClick={()=>handleNavigation('/code-gen')} style={{ background:'linear-gradient(135deg,#60a5fa,#3b82f6)',border:'none',padding:'0.65rem 1.5rem',borderRadius:'9px',color:'white',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:'8px' }}>
               Proceed to Code Generation <Ic.Send/>
            </button>
          </div>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}}`}</style>
    </div>
  );
}

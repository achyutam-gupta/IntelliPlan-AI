import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generateContentWithLLM, checkJiraConnection } from '../lib/llmGenerate';
import { IconSearch, IconSparkles } from '../components/Icons';
import Sidebar from '../components/Sidebar';
import UserStoryTemplateRaw from '../templates/user_story_spec.md?raw';

/* ─── Inline SVG Icon palette ─── */
const Ic = {
  Upload:  () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  File:    () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Link2:   () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
  Check:   () => <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>,
  Warn:    () => <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Edit:    () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Expand:  () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Send:    () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Export:  () => <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Refresh: () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Plus:    () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Loader:  () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{animation:'spin .7s linear infinite'}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  Jira:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="4" height="16" rx="1"/><rect x="10" y="8" width="4" height="12" rx="1"/><rect x="16" y="12" width="4" height="8" rx="1"/></svg>,
};

/* ─── Shared styles ─── */
const cardBox = { background:'rgba(15,23,42,0.7)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px' };
const btn  = (accent) => ({ display:'flex',alignItems:'center',gap:'6px',border:`1px solid ${accent}30`,background:`${accent}10`,color:accent,padding:'0.45rem 0.85rem',borderRadius:'7px',fontSize:'0.78rem',fontWeight:600,cursor:'pointer' });
const tag  = (c) => ({ background:`${c}15`,color:c,border:`1px solid ${c}25`,padding:'2px 9px',borderRadius:'10px',fontSize:'0.68rem',fontWeight:700 });
const inputStyle = { background:'rgba(15,23,42,0.8)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',color:'white',outline:'none',padding:'0.5rem 0.8rem',fontSize:'0.82rem',width:'100%',boxSizing:'border-box' };

/* ─── Priority colors helper ─── */
const PRIO_BADGE = { Critical:'#ef4444', High:'#f97316', Medium:'#a78bfa', Low:'#64748b' };
const TYPE_BADGE = { Functional:'#60a5fa', Security:'#10b981', Negative:'#f59e0b', API:'#c084fc', UX:'#fb7185' };

export default function UserStories() {
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  /* ── State ── */
  const [uploadedFile, setUploadedFile] = useState(() => JSON.parse(sessionStorage.getItem('us_uploadedFile') || 'null'));
  const [pasteText, setPasteText] = useState(() => sessionStorage.getItem('us_pasteText') || '');
  const [importUrl, setImportUrl] = useState(() => sessionStorage.getItem('us_importUrl') || '');
  const [generating, setGenerating] = useState(false);
  const [stories, setStories]       = useState(() => JSON.parse(sessionStorage.getItem('us_stories') || '[]'));
  const [selected, setSelected]     = useState(() => new Set(JSON.parse(sessionStorage.getItem('us_selected') || '[]')));
  const [expanded, setExpanded]     = useState(null);
  const [searchQ, setSearchQ]       = useState('');
  const [filterPrio, setFilterPrio] = useState('All');
  const [fetchingJira, setFetchingJira] = useState(false);
  const [fetchedJiraData, setFetchedJiraData] = useState(() => JSON.parse(sessionStorage.getItem('us_fetchedJiraData') || 'null'));

  /* ── Session Persistence ── */
  useEffect(() => {
    sessionStorage.setItem('us_uploadedFile', JSON.stringify(uploadedFile));
    sessionStorage.setItem('us_pasteText', pasteText);
    sessionStorage.setItem('us_importUrl', importUrl);
    sessionStorage.setItem('us_stories', JSON.stringify(stories));
    sessionStorage.setItem('us_selected', JSON.stringify(Array.from(selected)));
    sessionStorage.setItem('us_fetchedJiraData', JSON.stringify(fetchedJiraData));
  }, [uploadedFile, pasteText, importUrl, stories, selected, fetchedJiraData]);

  /* ── File pick ── */
  const onFileDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files[0] || e.target.files?.[0];
    if (!f) return;
    setUploadedFile({ 
      name: f.name, 
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB', 
      type: f.name.split('.').pop().toUpperCase(), 
      content: 'Mock file content' // In a real app we'd read the file
    });
  }, []);

  const handleFetchJira = async () => {
    if (!importUrl) return toast.error("Please enter a Jira URL.");
    setFetchingJira(true);
    try {
      const email = localStorage.getItem('jira_email');
      const token = localStorage.getItem('jira_token');
      if (!email || !token) throw new Error("Jira credentials not set in Settings.");
      const encoded = btoa(`${email}:${token}`);
      const match = importUrl.match(/\/browse\/([A-Z0-9-]+)/);
      if (!match) throw new Error("Invalid Jira URL format. Must contain /browse/ISSUE-KEY");
      
      const res = await fetch(`/api/jira/rest/api/3/issue/${match[1]}`, {
        headers: { Authorization: `Basic ${encoded}`, Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`Jira returned ${res.status}`);
      const data = await res.json();
      
      let descText = typeof data.fields.description === 'string' ? data.fields.description : JSON.stringify(data.fields.description);
      
      setFetchedJiraData({
        key: data.key,
        summary: data.fields.summary,
        description: descText,
        type: data.fields.issuetype?.name || 'N/A'
      });
      toast.success(`Successfully fetched Jira Ticket: ${data.key}`);
    } catch (err) {
      toast.error(`Fetch failed: ${err.message}`);
    }
    setFetchingJira(false);
  };

  /* ── Generate trigger ── */
  const handleGenerate = async () => {
    if (!pasteText && !uploadedFile && !fetchedJiraData) {
      return toast.error("Please provide requirements via paste, upload, or Jira fetch.");
    }
    setGenerating(true);
    
    try {
      let context = '';
      if (pasteText) context += `Pasted Text: ${pasteText}\n`;
      if (uploadedFile) context += `File Upload: ${uploadedFile.name}\n`;
      if (fetchedJiraData) context += `Jira Ticket: ${fetchedJiraData.summary}\n${fetchedJiraData.description}\n`;

      const systemPrompt = `Role: Act as a Technical Requirement Transformer. Your job is to parse unstructured project data and map it into the defined USER_STORY_SPEC.md structure for UI rendering.

Input Assets:

Standard Template:
### USER STORY TEMPLATE RULES ###
${UserStoryTemplateRaw}
#################################

Source Data: 
{{RAW_INPUT_DATA}}
${context}

Execution Logic:

- Extract: Scan the Source Data for the "Business Goal" (JIRA) and "Technical Implementation" (Doc).
- Map: Inject the extracted details into the corresponding {{VARIABLE}} slots in the Standard Template.
- Synthesize: 
  * Convert JIRA requirements into the Job Story format (Situation/Motivation/Outcome).
  * Translate technical constraints from the Doc into Strict Acceptance Criteria.
  * Identify "Blast Radius" risks by analyzing dependencies mentioned in the technical text.
- Validate: Ensure every section of the template is populated. If data is missing for a specific field, use logic to infer a professional default or mark it as [PENDING_TECHNICAL_REVIEW].

UI MAPPING INSTRUCTIONS:
You must translate the final validated output STRICTLY into a JSON array of objects to be consumed by the UI. Do not wrap in markdown tags like \`\`\`json. 
Each object must have this exact structure:
{
  "id": "US-XXXX", 
  "title": "Short title",
  "module": "High level module",
  "type": "Functional/Security/UX/API",
  "priority": "Critical/High/Medium/Low",
  "qualityScore": 0-100,
  "role": "e.g. registered user",
  "goal": "e.g. log in to the system",
  "value": "e.g. securely access my dashboard",
  "criteria": [
    { "scenario": "Scenario name", "given": "...", "when": "...", "then": "..." }
  ],
  "notes": ["Test note 1", "Test note 2"]
}`;
      
      const llmResponse = await generateContentWithLLM(systemPrompt);
      if(!llmResponse) throw new Error("No response from LLM");
      
      // Clean potential markdown blocks
      let cleanResponse = llmResponse.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      
      // Extract only the JSON array part
      const startBracketIndex = cleanResponse.indexOf('[');
      const endBracketIndex = cleanResponse.lastIndexOf(']');
      if (startBracketIndex !== -1 && endBracketIndex !== -1) {
          cleanResponse = cleanResponse.substring(startBracketIndex, endBracketIndex + 1);
      }
      
      // Fix common LLM hallucinated trailing commas which break JSON.parse
      cleanResponse = cleanResponse.replace(/,\s*([\]}])/g, '$1');
      
      let parsedStories = JSON.parse(cleanResponse);
      
      setStories(parsedStories);
      setSelected(new Set()); // Reset selection
      toast.success('Successfully generated user stories!');
    } catch (err) {
      console.error(err);
      toast.error(`LLM generation failed: ${err.message}. Using fallback data.`);
      
      // Fallback Data so that UI functionality still persists
      setStories([
          {
            id: 'US-1024', title: 'Secure User Authentication', module: 'Authentication',
            type: 'Functional', priority: 'Critical', qualityScore: 94,
            role: 'registered user', goal: 'log in securely', value: 'access my personal dashboard',
            criteria: [{ scenario: 'Successful Login', given: 'on login page', when: 'valid credentials', then: 'dashboard' }],
            notes: ['Verify session token creation easily']
          }
      ]);
    }
    setGenerating(false); 
  };

  const toggleSelect = (id) => setSelected(p => { const s = new Set(p); s.has(id)?s.delete(id):s.add(id); return s; });
  const selectAll  = () => setSelected(new Set(stories.map(s => s.id)));
  const clearAll   = () => setSelected(new Set());

  const visible = stories.filter(s => {
    if (searchQ && !s.title.toLowerCase().includes(searchQ.toLowerCase()) && !s.id.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (filterPrio !== 'All' && s.priority !== filterPrio) return false;
    return true;
  });

  const avgQuality = stories.length ? Math.round(stories.reduce((a, s) => a + (s.qualityScore || 85), 0) / stories.length) : 0;
  const highPrio   = stories.filter(s => s.priority === 'Critical' || s.priority === 'High').length;

  return (
    <div style={{ display:'flex', height:'100vh', background:'#080c14', color:'white', overflow:'hidden' }}>
      <Sidebar active="user-stories" />

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        
        {/* ── Top Nav ── */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', background: 'rgba(8,12,20,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, zIndex: 50 }}>
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
        </header>

        {/* ── Page Header ── */}
        <div style={{ padding:'2rem 2rem 1rem', flexShrink:0 }}>
           <h1 style={{ fontSize:'1.75rem',fontWeight:700,margin:'0 0 4px' }}>User Stories Intelligence Module</h1>
           <p style={{ color:'#64748b',margin:0,fontSize:'0.88rem' }}>Parse requirement documents and automatically generate ISTQB-aligned User Stories using AI.</p>
        </div>

        {/* ── Top Metrics (KPIs) ── */}
        <div style={{ padding:'0 2rem 1.5rem', display:'flex', gap:'1rem' }}>
          {[
            { label:'Total Stories generated', val: stories.length, color:'#60a5fa' },
            { label:'High Priority Stories',  val: highPrio,       color:'#ef4444' },
            { label:'Average AI Quality',     val: avgQuality+'%', color:'#10b981' }
          ].map((m,i)=>(
            <div key={i} style={{ ...cardBox, padding:'1rem 1.5rem', flex: 1, display:'flex', flexDirection:'column', gap:'4px' }}>
              <div style={{ fontSize:'1.8rem',fontWeight:800,color:m.color }}>{m.val}</div>
              <div style={{ fontSize:'0.75rem',color:'#94a3b8',fontWeight:600 }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* ── Main Layout ── */}
        <div style={{ flex:1, display:'grid', gridTemplateColumns:'420px 1fr', gap:'1.5rem', padding:'0 2rem', overflow:'hidden', minHeight:0 }}>

          {/* LEFT: Input Requirements */}
          <div style={{ display:'flex',flexDirection:'column',gap:'1rem',overflowY:'auto',paddingBottom:'2rem' }}>
            
            <div style={cardBox}>
              <div style={{ padding:'1rem 1.25rem',borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize:'0.72rem',fontWeight:700,letterSpacing:'0.07em',color:'#64748b' }}>REQUIREMENT INPUT</div>
              </div>

              <div style={{ padding:'1.25rem' }}>
                
                {/* File Upload Section */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize:'0.75rem', fontWeight:600, color:'#e2e8f0', marginBottom:'0.5rem' }}>1. Upload Document </div>
                    <div
                        onDragOver={e=>e.preventDefault()}
                        onDrop={onFileDrop}
                        onClick={()=>fileRef.current?.click()}
                        style={{ border:'2px dashed rgba(59,130,246,0.25)',borderRadius:'10px',padding:'1.5rem 1rem',textAlign:'center',cursor:'pointer',background:'rgba(59,130,246,0.03)',transition:'all .2s' }}
                    >
                        <div style={{ color:'#3b82f6',marginBottom:'8px' }}><Ic.Upload /></div>
                        <div style={{ fontSize:'0.78rem',color:'#94a3b8',fontWeight:500 }}>Drop your document here or Click to browse</div>
                        <div style={{ fontSize:'0.68rem',color:'#475569',marginTop:'4px' }}>PDF, DOCX, XLSX, TXT</div>
                    </div>
                    <input type="file" ref={fileRef} style={{ display:'none' }} onChange={onFileDrop}/>
                    
                    {uploadedFile && (
                        <div style={{ marginTop:'0.75rem',background:'rgba(16,185,129,0.06)',border:'1px solid rgba(16,185,129,0.2)',borderRadius:'9px',padding:'0.75rem 1rem',display:'flex',gap:'10px',alignItems:'center' }}>
                            <div style={{ color:'#10b981' }}><Ic.File /></div>
                            <div style={{ flex:1,minWidth:0 }}>
                                <div style={{ fontSize:'0.78rem',fontWeight:600,color:'#e2e8f0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{uploadedFile.name}</div>
                            </div>
                            <button onClick={(e)=>{e.stopPropagation(); setUploadedFile(null)}} style={{ background:'transparent', border:'none', color:'#ef4444', cursor:'pointer' }}>✕</button>
                        </div>
                    )}
                </div>

                {/* Text Paste Section */}
                <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize:'0.75rem', fontWeight:600, color:'#e2e8f0', marginBottom:'0.5rem' }}>2. Paste Requirements (Optional)</div>
                    <textarea
                        value={pasteText} onChange={e=>setPasteText(e.target.value)}
                        placeholder="Paste additional context, business rules, acceptance criteria..."
                        style={{ ...inputStyle, height:'120px', resize:'vertical', lineHeight:1.6 }}
                    />
                </div>

                {/* Jira URL Section */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize:'0.75rem', fontWeight:600, color:'#e2e8f0', marginBottom:'0.5rem' }}>3. Fetch from Jira (Optional)</div>
                    <div style={{ display:'flex',gap:'6px' }}>
                        <input type="text" value={importUrl} onChange={e=>setImportUrl(e.target.value)} placeholder="https://org.atlassian.net/browse/..." style={inputStyle}/>
                        <button onClick={handleFetchJira} disabled={fetchingJira} style={{ ...btn('#60a5fa'), whiteSpace:'nowrap' }}>
                            {fetchingJira ? 'Fetching...' : 'Fetch'}
                        </button>
                    </div>
                    {fetchedJiraData && (
                        <div style={{ marginTop:'0.75rem',background:'rgba(59,130,246,0.06)',border:'1px solid rgba(59,130,246,0.15)',borderRadius:'9px',padding:'0.65rem 1rem' }}>
                          <div style={{ fontSize:'0.78rem',fontWeight:600,color:'#93c5fd' }}>{fetchedJiraData.key} Parsed</div>
                        </div>
                    )}
                </div>

                {/* Generate Button */}
                <button onClick={handleGenerate} disabled={generating} style={{ width:'100%',background:generating?'rgba(59,130,246,0.2)':'linear-gradient(135deg,#10b981,#059669)',border:'none',padding:'0.85rem',borderRadius:'8px',color:'white',fontWeight:700,cursor:generating?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',fontSize:'0.9rem',boxShadow:generating?'none':'0 4px 14px rgba(16,185,129,0.3)' }}>
                  {generating ? <Ic.Loader /> : <IconSparkles />}
                  {generating ? 'Generating Stories…' : 'Generate User Stories'}
                </button>
                
              </div>
            </div>
          </div>

          {/* RIGHT: Generated Stories */}
          <div style={{ display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0, paddingBottom:'2rem' }}>
            
            <div style={{ display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1rem', flexShrink:0 }}>
              <div style={{ flex:1,display:'flex',alignItems:'center',...inputStyle,maxWidth:'400px' }}>
                <IconSearch />
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search stories…" style={{ background:'transparent',border:'none',color:'white',marginLeft:'6px',outline:'none',fontSize:'0.82rem',width:'100%' }}/>
              </div>
              <button onClick={selectAll} style={{ ...btn('#60a5fa') }}>Select All</button>
              <button onClick={clearAll}  style={{ ...btn('#64748b') }}>Clear</button>
              <div style={{ flex: 1 }} />
              <button onClick={()=>{
                const selectedData = stories.filter(s => selected.has(s.id));
                navigate('/test-plan', { state: { importedStories: selectedData } });
              }} disabled={selected.size === 0} style={{ display:'flex',alignItems:'center',gap:'8px',background:selected.size > 0 ? 'linear-gradient(135deg,#60a5fa,#3b82f6)' : 'rgba(59,130,246,0.2)',border:'none',padding:'0.65rem 1.5rem',borderRadius:'9px',color:selected.size > 0 ? 'white' : 'rgba(255,255,255,0.5)',fontWeight:700,fontSize:'0.88rem',cursor:selected.size > 0 ? 'pointer' : 'not-allowed' }}>
                Create Test Plan <Ic.Send/>
              </button>
            </div>

            {generating && (
              <div style={{ display:'flex',flexDirection:'column',gap:'1rem',overflowY:'auto' }}>
                {[1,2,3].map(n=>(
                  <div key={n} style={{ ...cardBox,padding:'1.5rem',minHeight:'140px' }}>
                    {[70,45,85].map((w,i)=>(
                      <div key={i} style={{ height:'14px',borderRadius:'6px',background:'rgba(255,255,255,0.05)',marginBottom:'0.8rem',width:`${w}%`,animation:'pulse 1.4s ease-in-out infinite' }}/>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {!generating && stories.length === 0 && (
              <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#374151', border:'1px dashed rgba(255,255,255,0.1)', borderRadius:'12px', background:'rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize:'2.5rem',marginBottom:'1rem' }}>📄</div>
                <div style={{ fontSize:'1rem',fontWeight:600,color:'#94a3b8' }}>Generate User Stories to see them here</div>
                <div style={{ fontSize:'0.82rem',color:'#64748b',marginTop:'4px',textAlign:'center' }}>Upload a document or provide requirements context on the left to begin.</div>
              </div>
            )}

            {!generating && stories.length > 0 && (
              <div style={{ flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'0.85rem',paddingRight:'8px' }}>
                {visible.map(story => {
                  const isSelected = selected.has(story.id);
                  const isExpanded = expanded === story.id;
                  return (
                    <div key={story.id} style={{ ...cardBox,border:`1px solid ${isSelected?'rgba(59,130,246,0.5)':'rgba(255,255,255,0.07)'}`,transition:'border .2s',background:isSelected?'rgba(15,23,55,0.8)':'rgba(15,23,42,0.7)' }}>
                      <div style={{ display:'flex',alignItems:'flex-start',gap:'1rem',padding:'1.25rem',cursor:'pointer' }} onClick={()=>toggleSelect(story.id)}>
                        <div style={{ width:'20px',height:'20px',borderRadius:'6px',border:isSelected?'none':'2px solid rgba(255,255,255,0.2)',background:isSelected?'#3b82f6':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'2px' }}>
                          {isSelected && <Ic.Check/>}
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px',flexWrap:'wrap' }}>
                            <span style={{ fontSize:'0.75rem',fontWeight:700,color:'#60a5fa',background:'rgba(59,130,246,0.1)',border:'1px solid rgba(59,130,246,0.2)',padding:'2px 8px',borderRadius:'6px' }}>{story.id}</span>
                            <span style={{ ...tag(PRIO_BADGE[story.priority]||'#64748b') }}>{story.priority}</span>
                            <span style={{ ...tag(TYPE_BADGE[story.type]||'#94a3b8') }}>{story.type}</span>
                            <span style={{ fontSize:'0.72rem',color:'#475569',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',padding:'2px 8px',borderRadius:'6px' }}>{story.module}</span>
                          </div>
                          <h3 style={{ fontSize:'1.05rem',fontWeight:600,margin:'0 0 6px',color:'#f8fafc' }}>{story.title}</h3>
                          <p style={{ fontSize:'0.85rem',color:'#94a3b8',margin:0,lineHeight:1.5 }}>
                            As a <em style={{ color:'#93c5fd', fontStyle:'normal', fontWeight:600 }}>{story.role}</em>, I want to <em style={{ color:'#c4b5fd', fontStyle:'normal', fontWeight:600 }}>{story.goal}</em>, so that <em style={{ color:'#86efac', fontStyle:'normal', fontWeight:600 }}>{story.value}</em>.
                          </p>
                        </div>
                        <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'8px',flexShrink:0 }}>
                          <div style={{ fontSize:'0.8rem',fontWeight:700,color: (story.qualityScore || 80)>=90?'#10b981':(story.qualityScore || 80)>=75?'#f59e0b':'#ef4444', textAlign:'right' }}>
                            {story.qualityScore || 85}<span style={{ fontSize:'0.65rem',color:'#475569' }}>/100</span>
                            <div style={{ fontSize:'0.65rem',color:'#475569', fontWeight:500 }}>AI Scoring</div>
                          </div>
                          <button onClick={e=>{e.stopPropagation();setExpanded(isExpanded?null:story.id)}} style={{ background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',color:'#94a3b8',padding:'4px 12px',borderRadius:'6px',cursor:'pointer',display:'flex',alignItems:'center', gap:'6px', fontSize:'0.75rem', fontWeight:600 }}>
                            <Ic.Expand/> {isExpanded ? 'Hide' : 'View Story'}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={{ padding:'0 1.25rem 1.25rem',borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ marginTop:'1.25rem' }}>
                            <div style={{ fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.07em',color:'#475569',marginBottom:'0.75rem' }}>ACCEPTANCE CRITERIA (GHERKIN)</div>
                            {story.criteria?.map((c,ci)=>(
                              <div key={ci} style={{ background:'rgba(0,0,0,0.25)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'8px',padding:'1rem',marginBottom:'0.75rem',fontFamily:'JetBrains Mono,monospace',fontSize:'0.8rem',lineHeight:1.7 }}>
                                <div style={{ color:'#a78bfa',fontWeight:700,marginBottom:'8px' }}>Scenario: {c.scenario}</div>
                                <div><span style={{ color:'#60a5fa', fontWeight:600, marginRight:'8px' }}>Given</span> <span style={{ color:'#e2e8f0' }}>{c.given}</span></div>
                                <div><span style={{ color:'#10b981', fontWeight:600, marginRight:'8px' }}>When</span> <span style={{ color:'#e2e8f0' }}>{c.when}</span></div>
                                <div><span style={{ color:'#f59e0b', fontWeight:600, marginRight:'8px' }}>Then</span> <span style={{ color:'#e2e8f0' }}>{c.then}</span></div>
                              </div>
                            ))}
                          </div>
                          {story.notes && story.notes.length > 0 && (
                              <div style={{ marginTop:'1rem' }}>
                                <div style={{ fontSize:'0.75rem',fontWeight:700,letterSpacing:'0.07em',color:'#475569',marginBottom:'0.5rem' }}>TEST NOTES</div>
                                {story.notes.map((n,ni)=>(
                                  <div key={ni} style={{ display:'flex',gap:'8px',fontSize:'0.82rem',color:'#94a3b8',marginBottom:'4px',lineHeight:1.5 }}>
                                    <span style={{ color:'#60a5fa' }}>→</span> {n}
                                  </div>
                                ))}
                              </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.8}}`}</style>
    </div>
  );
}

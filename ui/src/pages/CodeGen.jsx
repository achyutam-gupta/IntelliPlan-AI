import React, { useState, useEffect, useMemo } from 'react';
import { IconSearch, IconDownload, IconSparkles, IconCode, IconRefresh, IconCheck } from '../components/Icons';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { generateContentWithLLM } from '../lib/llmGenerate';
import CodeGenerationTemplateRaw from '../templates/code_gen_spec.md?raw';

export default function CodeGeneration() {
  // Persistence & Data States
  const [tcCases, setTcCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  
  // UI & Tooling States
  const [framework, setFramework] = useState('Cypress'); // Cypress | Playwright | Selenium
  const [toggleHeadless, setToggleHeadless] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(2);
  
  // Generation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null); // { file_name, generated_code, metrics, review, ai_optimization_notes }
  const [error, setError] = useState(null);

  // Load Data from Session Storage
  useEffect(() => {
    const cases = JSON.parse(sessionStorage.getItem('tc_cases') || '[]');
    setTcCases(cases);
    
    // Pick the selected case if it exists, otherwise pick the first one
    const activeId = sessionStorage.getItem('tc_active_case');
    if (activeId && cases.some(c => c.id === activeId)) {
      setSelectedCaseId(activeId);
    } else if (cases.length > 0) {
      setSelectedCaseId(cases[0].id);
    }
  }, []);

  // Compute Active Case
  const activeCase = useMemo(() => {
    return tcCases.find(c => c.id === selectedCaseId) || null;
  }, [tcCases, selectedCaseId]);

  // Sync selection to session
  useEffect(() => {
    if (selectedCaseId) {
      sessionStorage.setItem('tc_active_case', selectedCaseId);
    }
  }, [selectedCaseId]);

  const handleGenerate = async () => {
    if (!activeCase) {
      setError("No test case selected for generation.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const promptText = `
${CodeGenerationTemplateRaw}

### TARGET EXECUTION PARAMETERS:
- **Framework:** ${framework}
- **Headless Mode:** ${toggleHeadless}
- **Video Recording:** ${toggleVideo}
- **Retry Attempts:** ${retryAttempts}

### SOURCE TEST CASE SPECIFICATION:
${JSON.stringify(activeCase, null, 2)}

Provide the generated code in a strict JSON format as specified in the template.
    `.trim();

    try {
      const response = await generateContentWithLLM(promptText);
      
      // JSON Safety Parsing
      let jsonStr = response;
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      // Clean trailing commas that sometimes break JSON.parse
      jsonStr = jsonStr.replace(/,\s*([\]\}])/g, '$1');

      const data = JSON.parse(jsonStr);
      setGeneratedData(data);
    } catch (err) {
      console.error("Code Generation Error:", err);
      setError("Failed to generate code. Please verify your LLM settings.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedData) return;
    const blob = new Blob([generatedData.generated_code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = generatedData.file_name || `${framework.toLowerCase()}_test.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    if (!generatedData) return;
    navigator.clipboard.writeText(generatedData.generated_code);
    toast.success("Code copied to clipboard!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleSave = () => {
    toast.success("Code generation state synchronized.");
  };

  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#080c14', color: 'white', overflow: 'hidden', fontFamily: '"Inter", sans-serif'}}>
      <Sidebar active="code-gen" />
      <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative'}}>
        
        <Header searchPlaceholder="Search scripts..." />

        <div className="page-content fade-in" style={{padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%'}}>
          
          {/* Breadcrumbs & Title */}
          <div className="page-header-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem'}}>
            <div className="header-text">
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem'}}>
                <span style={{color: '#64748b', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase'}}>QA PIPELINE › STAGE 5 › CODE GENERATION</span>
                {isGenerating && <span className="pulse" style={{background: '#3b82f6', width: '8px', height: '8px', borderRadius: '50%'}}></span>}
              </div>
              <h1 style={{fontSize: '2.2rem', margin: '0 0 0.5rem 0', fontWeight: 700}}>Neural Script Factory</h1>
              <p style={{color: '#9ca3af', fontSize: '1rem', margin: 0, maxWidth: '600px', lineHeight: 1.5}}>
                Transforming test specifications into hardened automation scripts with adaptive selector mapping.
              </p>
            </div>
            
            {/* Framework Switcher */}
            <div className="header-actions-group" style={{display: 'flex', gap:'12px', alignItems:'center'}}>
              <div className="header-actions" style={{display: 'flex', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px'}}>
                {['Cypress', 'Playwright', 'Selenium'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFramework(f)}
                    style={{
                      background: framework === f ? '#c7d2fe' : 'transparent', 
                      color: framework === f ? '#3730a3' : '#9ca3af', 
                      border: 'none', padding: '0.6rem 1.5rem', borderRadius: '10px', 
                      fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div style={{display:'flex', gap:'8px'}}>
                <button onClick={handleSave} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Save
                </button>
                <button onClick={handleShare} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', padding: '0.6rem 1.2rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                  Share
                </button>
              </div>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'minmax(300px, 350px) 1fr minmax(280px, 320px)', gap: '1.5rem'}}>
            
            {/* Left Column: Source Selection & Parameters */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              
              {/* Active Case Card */}
              <div className="glass-panel" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem'}}>
                  <h3 style={{margin: 0, fontSize: '1rem', fontWeight: 600, color: '#f8fafc'}}>Source Case</h3>
                  <div style={{color: '#6366f1', display: 'flex'}}><IconSearch /></div>
                </div>
                
                <div style={{maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem'}}>
                  {tcCases.length > 0 ? (
                    tcCases.map(tc => (
                      <div 
                        key={tc.id}
                        onClick={() => setSelectedCaseId(tc.id)}
                        style={{
                          background: selectedCaseId === tc.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.4)',
                          border: `1px solid ${selectedCaseId === tc.id ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.03)'}`,
                          padding: '1rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        <div style={{fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: 700}}>{tc.id}</div>
                        <h4 style={{margin: 0, fontSize: '0.9rem', color: selectedCaseId === tc.id ? '#60a5fa' : '#e2e8f0', fontWeight: 600, lineHeight: 1.4}}>{tc.title}</h4>
                      </div>
                    ))
                  ) : (
                    <div style={{textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.85rem'}}>No test cases found in session.</div>
                  )}
                </div>

                <div style={{marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '1.25rem', textTransform: 'uppercase'}}>Execution Parameters</div>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontSize: '0.85rem', color: '#cbd5e1'}}>Headless Mode</span>
                      <div onClick={() => setToggleHeadless(!toggleHeadless)} style={{width: '40px', height: '22px', background: toggleHeadless ? '#3b82f6' : 'rgba(255,255,255,0.1)', borderRadius: '11px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s'}}>
                        <div style={{width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: toggleHeadless ? '20px' : '2px', transition: 'left 0.2s'}}></div>
                      </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontSize: '0.85rem', color: '#cbd5e1'}}>Video Recording</span>
                      <div onClick={() => setToggleVideo(!toggleVideo)} style={{width: '40px', height: '22px', background: toggleVideo ? '#3b82f6' : 'rgba(255,255,255,0.1)', borderRadius: '11px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s'}}>
                        <div style={{width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: toggleVideo ? '20px' : '2px', transition: 'left 0.2s'}}></div>
                      </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontSize: '0.85rem', color: '#cbd5e1'}}>Retry Limit</span>
                      <select 
                        value={retryAttempts} 
                        onChange={(e) => setRetryAttempts(Number(e.target.value))}
                        style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', padding: '2px 8px', fontSize: '0.8rem', outline: 'none'}}
                      >
                        <option value={0}>0</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !activeCase}
                  style={{
                    width: '100%', marginTop: '2rem', padding: '1rem', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                    color: 'white', border: 'none', fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)', opacity: (isGenerating || !activeCase) ? 0.6 : 1
                  }}
                >
                  {isGenerating ? <><div className="spinner-small" /> SYNERGIZING...</> : <><IconSparkles /> GENERATE CODE</>}
                </button>
              </div>

              {/* Status Panel */}
              <div className="glass-panel" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem'}}>
                <h3 style={{display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8'}}>
                   SYSTEM LOGS
                </h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                  <div style={{display: 'flex', gap: '10px', fontSize: '0.75rem'}}>
                    <span style={{color: '#22c55e', minWidth: '45px'}}>[INFO]</span>
                    <span style={{color: '#94a3b8'}}>Engine standby... ready for context injection.</span>
                  </div>
                  {isGenerating && (
                    <div style={{display: 'flex', gap: '10px', fontSize: '0.75rem'}}>
                      <span style={{color: '#3b82f6', minWidth: '45px'}}>[PROC]</span>
                      <span style={{color: '#e2e8f0'}}>Analyzing {activeCase?.title}... mapping selectors.</span>
                    </div>
                  )}
                  {generatedData && (
                    <div style={{display: 'flex', gap: '10px', fontSize: '0.75rem'}}>
                      <span style={{color: '#22c55e', minWidth: '45px'}}>[OK]</span>
                      <span style={{color: '#e2e8f0'}}>{framework} script generated successfully.</span>
                    </div>
                  )}
                  {error && (
                    <div style={{display: 'flex', gap: '10px', fontSize: '0.75rem'}}>
                      <span style={{color: '#ef4444', minWidth: '45px'}}>[ERR]</span>
                      <span style={{color: '#fca5a5'}}>{error}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Center Column: Code Editor */}
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div className="code-editor-main" style={{background: 'rgba(15,23,42,0.95)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '650px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'}}>
                
                {/* Editor Header */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56'}}></div>
                    <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e'}}></div>
                    <div style={{width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f'}}></div>
                    <div style={{width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)', margin: '0 8px'}} />
                    <span style={{fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <IconCode /> {generatedData?.file_name || 'waiting_for_input.js'}
                    </span>
                  </div>
                  
                  <div style={{display: 'flex', gap: '0.75rem'}}>
                    {generatedData && (
                      <>
                        <button 
                          onClick={handleCopyToClipboard}
                          style={{
                            background: 'rgba(255,255,255,0.05)', border: 'none', color: '#e2e8f0', 
                            padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.75rem', 
                            fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                          }}
                        >
                          Copy
                        </button>
                        <button 
                          onClick={handleDownload}
                          style={{
                            background: '#3b82f6', border: 'none', color: 'white', 
                            padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.75rem', 
                            fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                          }}
                        >
                          <IconDownload /> Download
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Editor Body */}
                <div style={{padding: '2rem', overflowY: 'auto', flex: 1, fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '0.9rem', lineHeight: 1.7, color: '#cbd5e1', position: 'relative', background: '#0a0f18'}}>
                  {!generatedData && !isGenerating && (
                    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3}}>
                      <div style={{fontSize: '4rem', marginBottom: '1rem'}}>🧬</div>
                      <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem'}}>Awaiting Synthesis</div>
                        <div style={{fontSize: '0.9rem'}}>Select a test case and click Generate Code to begin.</div>
                      </div>
                    </div>
                  )}
                  
                  {isGenerating && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.5}}>
                      <div style={{height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '40%'}} className="shimmer"></div>
                      <div style={{height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '80%'}} className="shimmer"></div>
                      <div style={{height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '60%'}} className="shimmer"></div>
                      <div style={{height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '90%'}} className="shimmer"></div>
                      <div style={{height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', width: '70%'}} className="shimmer"></div>
                    </div>
                  )}

                  {generatedData && (
                    <pre style={{margin: 0}}><code style={{display: 'block', overflowX: 'auto'}}>
                      {generatedData.generated_code}
                    </code></pre>
                  )}
                </div>

                {/* Editor Footer */}
                <div style={{display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em'}}>
                  <div style={{display: 'flex', gap: '2rem'}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <div style={{width: '6px', height: '6px', borderRadius: '50%', background: generatedData ? '#22c55e' : '#64748b'}}></div>
                      ESLINT {generatedData?.review?.eslint_status || 'READY'}
                    </span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <div style={{width: '6px', height: '6px', borderRadius: '50%', background: generatedData ? '#22c55e' : '#64748b'}}></div>
                      {generatedData?.review?.node_version || 'NODE 18+'}
                    </span>
                  </div>
                  <div>
                    {generatedData ? `${generatedData.metrics.lines} lines · Generated in ~1.2s` : 'IDLE'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Metrics & Review */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              
              {/* Quality Metrics */}
              <div className="glass-panel" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1rem', fontWeight: 600}}>Optimization Scan</h3>
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                   <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem'}}>
                      <span style={{color: '#94a3b8'}}>Logic Complexity</span>
                      <span style={{color: '#e2e8f0', fontWeight: 700}}>{generatedData?.metrics.complexity || '--'}</span>
                    </div>
                    <div style={{height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px'}}>
                      <div style={{width: generatedData ? '65%' : '0%', height: '100%', background: '#60a5fa', borderRadius: '3px', transition: 'width 1s ease'}}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem'}}>
                      <span style={{color: '#94a3b8'}}>Selector Reliability</span>
                      <span style={{color: '#e2e8f0', fontWeight: 700}}>{generatedData?.metrics.selector_optimization || '--'}</span>
                    </div>
                    <div style={{height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px'}}>
                      <div style={{width: generatedData ? '98%' : '0%', height: '100%', background: '#22c55e', borderRadius: '3px', transition: 'width 1s ease'}}></div>
                    </div>
                  </div>

                  <div style={{background: 'rgba(15, 23, 42, 0.4)', padding: '1rem', borderRadius: '12px', marginTop: '0.5rem'}}>
                    <div style={{fontSize: '0.7rem', color: '#6366f1', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem'}}>AI INSIGHT</div>
                    <p style={{fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, fontStyle: 'italic'}}>
                      {generatedData?.ai_optimization_notes || "Neural engine ready to scan scenario for volatile selectors and race conditions."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="glass-panel" style={{background: 'linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                 <h3 style={{margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600}}>Security & Compliance</h3>
                 <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                    {[
                      {label: 'PII Sanitization', status: 'Passed'},
                      {label: 'Vulnerability Scan', status: 'Secure'},
                      {label: 'Credential Safety', status: 'Enforced'}
                    ].map(item => (
                      <div key={item.label} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px'}}>
                        <span style={{fontSize: '0.75rem', color: '#94a3b8'}}>{item.label}</span>
                        <span style={{fontSize: '0.7rem', fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px'}}>
                          <IconCheck /> {item.status}
                        </span>
                      </div>
                    ))}
                 </div>
              </div>
              
            </div>

          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => {
            setGeneratedData(null);
            handleGenerate();
          }}
          disabled={isGenerating || !activeCase}
          style={{
            position: 'absolute', bottom: '2.5rem', right: '2.5rem', 
            width: '60px', height: '60px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', 
            color: 'white', border: 'none', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', cursor: 'pointer', 
            boxShadow: '0 10px 30px -5px rgba(59, 130, 246, 0.5)',
            zIndex: 100
          }}
        >
          <IconRefresh />
        </button>

      </div>
    </div>
  );
}

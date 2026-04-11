import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconLightning, IconLink, IconDatabase, IconSparkles, IconStories, IconCode, IconSettings } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function URLAnalyzer() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(true); // default to true to show the UI from screenshot

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResults(true);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#0f172a', color: 'white'}}>
      <Sidebar active="url-analyzer" />
      <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
         <header className="top-nav" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
            <div className="search-bar" style={{display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '300px'}}>
              <IconSearch />
              <input type="text" placeholder="Search analytics..." style={{background: 'transparent', border: 'none', color: 'white', marginLeft: '0.5rem', outline: 'none', width: '100%'}} />
            </div>
            <div className="workspace-links" style={{display: 'flex', gap: '2rem', fontSize: '0.9rem'}}>
              <span className="active" style={{color: '#3b82f6', fontWeight: 500, cursor: 'pointer'}}>Workspace</span>
              <span style={{color: '#9ca3af', cursor: 'pointer'}}>Project Settings</span>
            </div>
         </header>
         
         <div className="page-content fade-in" style={{padding: '2rem', maxWidth: '1200px'}}>
            <div className="analyzer-banner glass" style={{position: 'relative', overflow: 'hidden', padding: '3rem 2rem', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.9))', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem'}}>
               <div className="mesh-gradient-bg" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.4}}>
                   {/* network nodes graphic representation */}
                   <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                   </svg>
               </div>
               <div style={{position: 'relative', zIndex: 1}}>
                 <div className="badge-eng" style={{display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)'}}><span style={{color: '#60a5fa'}}>●</span> DEEP CRAWL ENGINE V2.4</div>
                 <h1 style={{fontSize: '3rem', margin: '0 0 1rem 0', fontWeight: 700}}>Map the DNA of your <br/><span className="text-gradient-blue" style={{color: '#3b82f6'}}>Application.</span></h1>
                 <p style={{color: '#9ca3af', fontSize: '1.1rem', maxWidth: '500px', lineHeight: 1.6, marginBottom: '2rem'}}>Deploy our intelligent analyzer to extract features, components, and user flows directly from any URL.</p>
               </div>
            </div>

            <div className="input-row-vibrant" style={{display: 'flex', gap: '1rem', background: '#1e293b', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.05)', alignItems: 'center'}}>
               <div style={{color: '#9ca3af', paddingLeft: '0.5rem'}}><IconLink /></div>
               <input type="text" placeholder="Enter Target Application URL (e.g. https://app.enterprise-saas.com)" value={url} onChange={e => setUrl(e.target.value)} style={{flex: 1, background: 'transparent', border: 'none', color: 'white', fontSize: '1rem', outline: 'none'}} />
               <button className="btn-vibrant-blue" onClick={handleAnalyze} style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'}}>{isAnalyzing ? 'Analyzing...' : 'Analyze'} <IconLightning /></button>
            </div>

            {results && (
              <div className="analyzer-results fade-in">
                <div className="results-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
                   
                   {/* Left Side */}
                   <div className="result-card architecture glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column'}}>
                      <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                         <h3 style={{fontSize: '0.9rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em'}}><IconDatabase /> VISUAL SITE ARCHITECTURE</h3>
                         <div style={{display: 'flex', gap: '8px'}}>
                            <button style={{background: 'rgba(255,255,255,0.05)', border: 'none', color: '#9ca3af', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer'}}>+</button>
                            <button style={{background: 'rgba(255,255,255,0.05)', border: 'none', color: '#9ca3af', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer'}}>-</button>
                         </div>
                      </div>
                      <div className="workflow-viz" style={{padding: '3rem 2rem', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                         <div className="node main" style={{background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center', width: '160px', marginBottom: '3rem', position: 'relative', zIndex: 2}}>
                            <div style={{marginBottom: '0.5rem', color: '#9ca3af'}}><IconDatabase /></div>
                            <div style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '0.25rem'}}>MAIN ENTRY</div>
                            <div style={{fontSize: '0.95rem', fontWeight: 500}}>/dashboard</div>
                         </div>
                         <div className="node-grid" style={{display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center', position: 'relative', zIndex: 2}}>
                            <div className="node small" style={{background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center', width: '120px'}}>
                               <div style={{marginBottom: '0.5rem', color: '#9ca3af'}}><IconCode /></div>
                               <div style={{fontSize: '0.85rem'}}>/billing</div>
                            </div>
                            <div className="node small" style={{background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center', width: '120px'}}>
                               <div style={{marginBottom: '0.5rem', color: '#9ca3af'}}><IconSearch /></div>
                               <div style={{fontSize: '0.85rem'}}>/users</div>
                            </div>
                            <div className="node small" style={{background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', textAlign: 'center', width: '120px'}}>
                               <div style={{marginBottom: '0.5rem', color: '#9ca3af'}}><IconSettings /></div>
                               <div style={{fontSize: '0.85rem'}}>/config</div>
                            </div>
                         </div>
                         {/* Lines connecting nodes */}
                         <div style={{position: 'absolute', top: '120px', left: '50%', width: '1px', height: '48px', background: 'rgba(255,255,255,0.1)', zIndex: 1}}></div>
                         <div style={{position: 'absolute', top: '168px', left: '20%', width: '60%', height: '1px', background: 'rgba(255,255,255,0.1)', zIndex: 1}}></div>
                         <div style={{position: 'absolute', top: '168px', left: '20%', width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', zIndex: 1}}></div>
                         <div style={{position: 'absolute', top: '168px', left: '80%', width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', zIndex: 1}}></div>

                         <div className="ai-observation" style={{position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', zIndex: 3}}>
                            <div style={{background: 'rgba(96,165,250,0.1)', color: '#60a5fa', padding: '8px', borderRadius: '50%'}}><IconSparkles /></div>
                            <div>
                               <div style={{fontSize: '0.75rem', fontWeight: 600, color: 'white', letterSpacing: '0.05em', marginBottom: '0.25rem'}}>AI OBSERVATION</div>
                               <div style={{fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.4}}>Detected complex nesting in User Management. Recommended test coverage for role-based access control.</div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Right Side */}
                   <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                       <div className="result-card features glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                          <div className="card-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                            <h3 style={{fontSize: '0.9rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.05em'}}><IconStories /> IDENTIFIED FEATURES</h3>
                            <span className="count" style={{background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600}}>14 FOUND</span>
                          </div>
                          
                          <div className="feature-list" style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                            {[
                              { name: 'Authentication Service', details: 'OAuth2, MFA, Password Recovery' },
                              { name: 'Data Visualization', details: 'Chart.js Implementation, Dynamic Filters' },
                              { name: 'Asset Management', details: 'Cloud Storage Integration, Bulk Upload' },
                              { name: 'Notification Engine', details: 'WebSocket Push, Email Templates' }
                            ].map((f, i) => (
                               <div key={i} className="feature-item" style={{display: 'flex', alignItems: 'center', padding: '1rem', background: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', outline: 'none'}}>
                                  <div className="f-icon" style={{background: 'rgba(255,255,255,0.1)', color: '#9ca3af', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1rem'}}><IconDatabase /></div>
                                  <div className="f-info" style={{flex: 1}}>
                                     <h4 style={{margin: '0 0 0.25rem 0', fontSize: '0.95rem', color: 'white', fontWeight: 600}}>{f.name}</h4>
                                     <p style={{margin: 0, fontSize: '0.8rem', color: '#9ca3af'}}>{f.details}</p>
                                  </div>
                                  <span style={{color: '#6b7280'}}>›</span>
                               </div>
                            ))}
                          </div>
                          <button style={{width: '100%', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', color: '#9ca3af', padding: '1rem', borderRadius: '8px', marginTop: '1rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'border 0.2s'}}>VIEW ALL 14 FEATURES ∨</button>
                       </div>
                       
                       <div className="ready-cta" style={{background: 'linear-gradient(135deg, #2563eb, #3b82f6)', padding: '2rem', borderRadius: '12px', color: 'white', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'}}>
                          <h4 style={{fontSize: '1.25rem', margin: '0 0 0.5rem 0', fontWeight: 600}}>Ready to build the QA backlog?</h4>
                          <p style={{fontSize: '0.9rem', opacity: 0.9, margin: '0 0 1.5rem 0', lineHeight: 1.5}}>Transform these identified features into structured User Stories using our LLM engine.</p>
                          <button className="btn-white-vibrant" onClick={() => navigate('/user-stories')} style={{background: 'white', color: '#2563eb', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>Generate User Stories <span style={{fontSize: '1.2rem'}}>→</span></button>
                       </div>
                   </div>
                </div>

                <div className="bottom-stats" style={{display: 'flex', justifyContent: 'space-between', background: 'rgba(30,41,59,0.5)', padding: '1.5rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '2rem'}}>
                  <div>
                     <div style={{fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem'}}>TECH STACK DETECTED</div>
                     <div style={{display: 'flex', gap: '8px'}}>
                        {['React 18', 'Tailwind CSS', 'GraphQL'].map(t => <span key={t} style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem'}}>{t}</span>)}
                     </div>
                  </div>
                  <div>
                     <div style={{fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem'}}>FRAMEWORKS</div>
                     <div style={{display: 'flex', gap: '8px'}}>
                        {['Next.js', 'Apollo'].map(t => <span key={t} style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem'}}>{t}</span>)}
                     </div>
                  </div>
                  <div>
                     <div style={{fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem'}}>API ARCHITECTURE</div>
                     <div style={{fontSize: '0.9rem', fontWeight: 500}}>RESTful / Microservices</div>
                  </div>
                  <div>
                     <div style={{fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem'}}>ANALYSIS CONFIDENCE</div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div style={{width: '60px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}}><div style={{width: '94%', height: '100%', background: '#60a5fa', borderRadius: '2px'}}></div></div>
                        <span style={{fontWeight: 700, fontSize: '0.9rem'}}>94%</span>
                     </div>
                  </div>
                </div>

              </div>
            )}
         </div>
      </div>
    </div>
  );
}

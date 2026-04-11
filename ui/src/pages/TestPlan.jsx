import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconSparkles, IconLightning, IconDownload, IconPlan, IconStories } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function TestPlan() {
  const navigate = useNavigate();
  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#0f172a', color: 'white'}}>
      <Sidebar active="test-plan" />
      <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
         <header className="top-nav" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
            <div className="search-bar" style={{display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '300px'}}>
              <IconSearch />
              <input type="text" placeholder="Search workspace..." style={{background: 'transparent', border: 'none', color: 'white', marginLeft: '0.5rem', outline: 'none', width: '100%'}} />
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
               <div className="workspace-links" style={{display: 'flex', gap: '2rem', fontSize: '0.9rem'}}>
                 <span className="active" style={{color: '#3b82f6', fontWeight: 500, cursor: 'pointer'}}>Workspace</span>
                 <span style={{color: '#9ca3af', cursor: 'pointer'}}>Project Settings</span>
               </div>
               <button className="btn-vibrant-blue" style={{background: '#2563eb', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}><IconLightning /> Deploy Agent</button>
            </div>
         </header>

         <div className="page-content fade-in" style={{padding: '2rem', maxWidth: '1200px'}}>
            <div className="page-header" style={{margin: '0 0 2rem 0'}}>
               <h1 style={{fontSize: '2rem', color: 'white', margin: '0 0 0.5rem 0', fontWeight: 700}}>Test Plan Module</h1>
               <p style={{color: '#9ca3af', fontSize: '1.05rem', margin: 0, maxWidth: '800px', lineHeight: 1.5}}>Engineer a high-fidelity validation strategy by selecting core user stories. Our AI engine generates scope, risk assessment, and timelines based on complexity analysis.</p>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem'}}>
               
               {/* Left Column */}
               <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div className="glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                     <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                        <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1.05rem', fontWeight: 600}}><IconStories /> Select User Stories</h3>
                        <span style={{background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>12 Total</span>
                     </div>
                     
                     <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem'}}>
                        {[
                           {id: 'US-402', title: 'OAuth2 Implementation', details: 'Integration of third-party identity providers for secure authentication flow.', type: 'Critical', color: '#ef4444', pts: '8 pts', checked: true},
                           {id: 'US-405', title: 'Real-time Data Sync', details: 'WebSocket implementation for live dashboard updates across clients.', type: 'High', color: '#f97316', pts: '13 pts', checked: true},
                           {id: 'US-409', title: 'Audit Log Generation', details: 'Automated logging of administrative actions for compliance reporting.', type: 'Medium', color: '#a78bfa', pts: '5 pts', checked: false},
                           {id: 'US-412', title: 'Export to CSV/PDF', details: 'Allow users to export analytics data in multiple document formats.', type: 'Low', color: '#94a3b8', pts: '3 pts', checked: true}
                        ].map(us => (
                           <div key={us.id} style={{display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'}}>
                              <div style={{paddingTop: '2px'}}>
                                 <input type="checkbox" defaultChecked={us.checked} style={{width: '18px', height: '18px', accentColor: '#3b82f6', background: 'transparent', border: '1px solid #475569'}} />
                              </div>
                              <div>
                                 <h4 style={{margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 600}}><strong>{us.id}:</strong> {us.title}</h4>
                                 <p style={{margin: '0 0 0.75rem 0', fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.4}}>{us.details}</p>
                                 <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                                    <span style={{background: `${us.color}20`, color: us.color, padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600}}>{us.type}</span>
                                    <span style={{background: 'rgba(255,255,255,0.05)', color: '#9ca3af', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem'}}>{us.pts}</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                     <button style={{width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'}}>
                        <IconSparkles /> Generate Test Plan
                     </button>
                  </div>
                  
                  <div className="glass" style={{background: 'rgba(14, 165, 233, 0.1)', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.2)', padding: '1.25rem', display: 'flex', gap: '1rem'}}>
                     <div style={{background: '#3b82f6', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0}}><IconSparkles /></div>
                     <div>
                        <p style={{margin: 0, fontSize: '0.85rem', color: '#e0f2fe', lineHeight: 1.5}}><strong>AI Insight:</strong> Selected stories cover 84% of critical business logic. Consider adding "Password Reset" to reach full coverage.</p>
                     </div>
                  </div>
               </div>

               {/* Right Column */}
               <div className="glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', display: 'flex', flexDirection: 'column'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem'}}>
                     <div>
                        <h2 style={{fontSize: '1.3rem', margin: '0 0 0.25rem 0', fontWeight: 700}}>Test Plan: V4-Alpha-Release</h2>
                        <p style={{color: '#9ca3af', fontSize: '0.85rem', margin: 0}}>Generated by IntelliPlan Engine • Just now</p>
                     </div>
                     <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button style={{background: 'rgba(255,255,255,0.05)', border: 'none', color: '#e2e8f0', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IconDownload /></button>
                        <button style={{background: 'rgba(255,255,255,0.05)', border: 'none', color: '#e2e8f0', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg></button>
                     </div>
                  </div>

                  <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                     {/* Section I */}
                     <div>
                        <h3 style={{fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1.25rem 0'}}><div style={{width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px'}}></div> I. SCOPE</h3>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                           <div style={{background: 'rgba(15,23,42,0.6)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)'}}>
                              <div style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1rem', color: '#e2e8f0'}}>IN-SCOPE</div>
                              <ul style={{margin: 0, paddingLeft: '1.25rem', color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                 <li>Cross-browser UI validation (Chrome, Safari)</li>
                                 <li>REST API Authentication endpoints</li>
                                 <li>WebSocket state persistence</li>
                              </ul>
                           </div>
                           <div style={{background: 'rgba(15,23,42,0.6)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)'}}>
                              <div style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1rem', color: '#e2e8f0'}}>OUT-OF-SCOPE</div>
                              <ul style={{margin: 0, paddingLeft: '1.25rem', color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                                 <li>Legacy Internet Explorer support</li>
                                 <li>Native mobile application testing</li>
                              </ul>
                           </div>
                        </div>
                     </div>

                     {/* Section II */}
                     <div>
                        <h3 style={{fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1.25rem 0'}}><div style={{width: '4px', height: '16px', background: '#3b82f6', borderRadius: '2px'}}></div> II. STRATEGY</h3>
                        <div style={{background: 'rgba(15,23,42,0.6)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)'}}>
                           <div style={{display: 'flex', alignItems: 'center', marginBottom: '1rem'}}>
                              <div style={{width: '200px', fontSize: '0.9rem', color: '#e2e8f0'}}>Automated Regression</div>
                              <div style={{flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', margin: '0 1rem'}}>
                                 <div style={{width: '70%', height: '100%', background: '#60a5fa', borderRadius: '4px'}}></div>
                              </div>
                              <div style={{width: '40px', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem'}}>70%</div>
                           </div>
                           <div style={{display: 'flex', alignItems: 'center', marginBottom: '1.5rem'}}>
                              <div style={{width: '200px', fontSize: '0.9rem', color: '#e2e8f0'}}>Manual Exploratory</div>
                              <div style={{flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', margin: '0 1rem'}}>
                                 <div style={{width: '30%', height: '100%', background: '#a78bfa', borderRadius: '4px'}}></div>
                              </div>
                              <div style={{width: '40px', textAlign: 'right', fontWeight: 600, fontSize: '0.9rem'}}>30%</div>
                           </div>
                           <p style={{margin: 0, fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.5}}>
                              Utilizing Cypress for E2E flow and Postman for contractual API validation. Parallel execution enabled for CI/CD pipeline integration.
                           </p>
                        </div>
                     </div>

                     <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem'}}>
                        {/* Section III */}
                        <div>
                           <h3 style={{fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1.25rem 0'}}><div style={{width: '4px', height: '16px', background: '#f87171', borderRadius: '2px'}}></div> III. RISKS</h3>
                           <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                              <div style={{background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid rgba(239,68,68,0.1)'}}>
                                 <span style={{color: '#ef4444', fontSize: '1.2rem'}}>⚠</span>
                                 <span style={{fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.4}}>Third-party API instability during sandbox testing.</span>
                              </div>
                              <div style={{background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)'}}>
                                 <span style={{color: '#9ca3af', fontSize: '1.2rem'}}>❓</span>
                                 <span style={{fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.4}}>Data seeding delays for complex multi-tenant scenarios.</span>
                              </div>
                           </div>
                        </div>

                        {/* Section IV */}
                        <div>
                           <h3 style={{fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 1.25rem 0'}}><div style={{width: '4px', height: '16px', background: '#fb923c', borderRadius: '2px'}}></div> IV. TIMELINE</h3>
                           <div style={{background: 'rgba(15,23,42,0.6)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)'}}>
                              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: '#e2e8f0', marginBottom: '1rem'}}>
                                 <span>EXECUTION PHASE</span>
                                 <span>EST. 4 DAYS</span>
                              </div>
                              <div style={{display: 'flex', gap: '4px', height: '12px', marginBottom: '0.75rem'}}>
                                 <div style={{flex: 1, background: '#475569', borderRadius: '2px'}}></div>
                                 <div style={{flex: 1, background: '#3b82f6', borderRadius: '2px'}}></div>
                                 <div style={{flex: 1, background: '#93c5fd', borderRadius: '2px'}}></div>
                                 <div style={{flex: 1, background: '#1e293b', borderRadius: '2px'}}></div>
                              </div>
                              <div style={{fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center'}}>Nov 14 — Nov 18, 2024</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div style={{marginTop: 'auto', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end'}}>
                     <button onClick={() => navigate('/test-scenarios')} style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.85rem 1.5rem', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s'}}>
                        Generate Test Scenarios ➔
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

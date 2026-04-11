import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconDatabase, IconSparkles } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function UserStories() {
  const navigate = useNavigate();
  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#0f172a'}}>
      <Sidebar active="user-stories" />
      <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative'}}>
         <header className="top-nav" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
            <div className="search-bar" style={{display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '300px'}}>
              <IconSearch />
              <input type="text" placeholder="Search documentation..." style={{background: 'transparent', border: 'none', color: 'white', marginLeft: '0.5rem', outline: 'none', width: '100%'}} />
            </div>
            <div className="workspace-links" style={{display: 'flex', gap: '2rem', fontSize: '0.9rem'}}>
              <span className="active" style={{color: '#3b82f6', fontWeight: 500, cursor: 'pointer'}}>Workspace</span>
              <span style={{color: '#9ca3af', cursor: 'pointer'}}>Project Settings</span>
            </div>
         </header>

         <div className="page-content fade-in" style={{padding: '2rem', flex: 1, overflowY: 'auto', paddingBottom: '6rem'}}>
            <div className="page-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <div>
                  <h1 style={{fontSize: '2rem', color: 'white', marginBottom: '0.5rem', fontWeight: 700}}>User Stories Module</h1>
                  <p style={{color: '#9ca3af', fontSize: '1.05rem', maxWidth: '700px', lineHeight: 1.5}}>Transform analyzed architectural source data into actionable, high-fidelity user stories using IntelliPlan's neural drafting engine.</p>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                   <span style={{color: '#64748b', fontSize: '0.8rem', fontWeight: 600}}>Step 2 of 8</span>
                   <div style={{display: 'flex', gap: '4px'}}>
                      <div style={{width: '24px', height: '4px', background: '#3b82f6', borderRadius: '2px'}}></div>
                      <div style={{width: '24px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}}></div>
                      <div style={{width: '24px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}}></div>
                   </div>
                </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem'}}>
               
               {/* Left Column */}
               <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div className="glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                     <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                        <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', margin: 0, fontWeight: 600, color: 'white'}}><IconDatabase /> Source Data</h3>
                        <span style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600}}>Synced</span>
                     </div>
                     <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                        <div style={{background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)'}}>
                           <div style={{fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem'}}>ANALYZED URL</div>
                           <div style={{fontSize: '0.9rem', color: '#e2e8f0', wordBreak: 'break-all'}}>https://api.v3.enterprise.qa/aut...</div>
                        </div>
                        <div style={{background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)'}}>
                           <div style={{fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem'}}>DETECTED ENTITIES</div>
                           <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                              <span style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#94a3b8'}}>UserAuth</span>
                              <span style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#94a3b8'}}>MFA_Provider</span>
                              <span style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#94a3b8'}}>SessionToken</span>
                           </div>
                        </div>
                        <div style={{background: 'rgba(15,23,42,0.6)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)'}}>
                           <div style={{fontSize: '0.7rem', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem'}}>SCHEMA LOGIC</div>
                           <div style={{fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5}}>JSON payload includes biometric challenge seeds and encrypted salt parameters for the V2 handshake.</div>
                        </div>
                     </div>
                  </div>

                  <div className="glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                     <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', margin: '0 0 1rem 0', fontWeight: 600, color: 'white'}}>Contextual Nuances</h3>
                     <textarea placeholder="Input specific business logic, compliance requirements (GDPR, SOC2), or legacy constraints that AI should consider..." style={{width: '100%', height: '120px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '1rem', color: 'white', resize: 'none', outline: 'none', marginBottom: '1rem', fontFamily: 'inherit', boxSizing: 'border-box'}}></textarea>
                     <button style={{width: '100%', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', border: 'none', padding: '0.85rem', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}> <IconSparkles /> Generate User Stories</button>
                  </div>
               </div>

               {/* Right Column */}
               <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                     <div style={{display: 'flex', alignItems: 'baseline', gap: '1rem'}}>
                        <h2 style={{fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'white'}}>Generated Scenarios</h2>
                        <span style={{color: '#64748b', fontSize: '0.9rem'}}>8 Stories Detected</span>
                     </div>
                     <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{fontSize: '1rem'}}>≡</span> Filter</button>
                        <button style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'}}><span style={{fontSize: '1rem'}}>↕</span> Sort</button>
                     </div>
                  </div>

                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem'}}>
                     {[
                        {id: 'US-1024', title: 'Secure Handshake Validation', desc: 'As a security system, I want to validate the V2 handshake encrypted salt so that unauthorized biometric challenges are rejected before processing.', prio: 'CRITICAL', prioColor: '#ef4444', plat: 'FE/BE Impact', active: true},
                        {id: 'US-1025', title: 'Token Expiration Resilience', desc: 'As a mobile user, I want the session token to auto-refresh during active handshake sequences to prevent flow disruption.', prio: 'MEDIUM', prioColor: '#a78bfa', plat: 'Logic Layer', active: false},
                        {id: 'US-1026', title: 'Schema Mismatch Handling', desc: 'As an API integrator, I want clear error codes when the biometric seed format deviates from the expected schema definition.', prio: 'HIGH', prioColor: '#f97316', plat: 'API Layer', active: false},
                        {id: 'US-1027', title: 'Audit Log Compliance', desc: 'As a compliance officer, I need every failed V2 handshake recorded in the audit trail with non-sensitive reason codes.', prio: 'LOW', prioColor: '#94a3b8', plat: 'Governance', active: false}
                     ].map(story => (
                        <div key={story.id} className="story-card" style={{background: 'rgba(30,41,59,0.5)', border: story.active ? '1px solid rgba(96,165,250,0.8)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', position: 'relative', cursor: 'pointer', transition: 'border 0.2s'}}>
                           <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                              <span style={{background: story.active ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.05)', color: story.active ? '#60a5fa' : '#94a3b8', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>{story.id}</span>
                              {story.active ? <div style={{color: '#60a5fa'}}><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
                                            : <div style={{width:'22px', height:'22px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.2)'}}></div>}
                           </div>
                           <h3 style={{fontSize: '1.1rem', color: 'white', margin: '0 0 0.75rem 0', fontWeight: 600}}>{story.title}</h3>
                           <p style={{color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 1.5rem 0', flex: 1}}>{story.desc}</p>
                           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                              <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8'}}>
                                 <span style={{color: story.prioColor}}>!</span> {story.prio}
                              </div>
                              <span style={{color: '#64748b', fontSize: '0.75rem'}}>{story.plat}</span>
                           </div>
                        </div>
                     ))}
                  </div>
                  
                  <div className="neural-insights" style={{background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
                     <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px', color: '#a78bfa'}}><IconSparkles /></div>
                     <div>
                        <h4 style={{color: 'white', margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600}}>Neural Insights</h4>
                        <p style={{color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.5, margin: 0}}>I've detected a high degree of overlap between US-1024 and US-1026. Consolidating these might streamline the Test Plan generation phase by 15%.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Floating Bottom Bar Container */}
         <div style={{position: 'absolute', bottom: '2rem', left: '0', width: '100%', display: 'flex', justifyContent: 'flex-end', padding: '0 2rem', pointerEvents: 'none'}}>
            <div style={{background: 'rgba(30,41,59,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '2rem', backdropFilter: 'blur(10px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', pointerEvents: 'auto'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <div style={{background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                     <span>1 Story</span><span>Selected</span>
                  </div>
                  <div style={{color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.4}}>
                     Ready to move to Test <br/>Planning phase
                  </div>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
                  <button style={{background: 'transparent', border: 'none', color: '#9ca3af', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'center'}}>Reset<br/>Selection</button>
                  <button onClick={() => navigate('/test-plan')} style={{background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'}}>
                    <span style={{textAlign: 'left'}}>Generate Test Plan<br/>from Selected</span>
                    <span style={{fontSize: '1.2rem'}}>→</span>
                  </button>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}

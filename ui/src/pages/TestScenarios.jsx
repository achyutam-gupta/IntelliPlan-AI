import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconSparkles, IconCheck, IconTrash, IconRefresh, IconDownload } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function TestScenarios() {
  const navigate = useNavigate();
  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#080c14', color: 'white', overflow: 'hidden', fontFamily: '"Inter", sans-serif'}}>
      <Sidebar active="scenarios" />
      <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative'}}>
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

         <div className="page-content fade-in" style={{padding: '2rem', maxWidth: '1200px'}}>
            <div className="page-header-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
                 <div className="header-text">
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem'}}>
                       <span style={{background: 'rgba(96,165,250,0.15)', color: '#60a5fa', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em'}}>MODULE 04</span>
                       <span style={{color: '#64748b', fontSize: '0.85rem'}}>/ Authentication Flow</span>
                    </div>
                    <h1 style={{fontSize: '2.2rem', margin: '0 0 0.5rem 0', fontWeight: 700}}>Test Scenarios</h1>
                    <p style={{color: '#9ca3af', fontSize: '1rem', margin: 0, maxWidth: '600px', lineHeight: 1.5}}>Our AI has derived 12 unique test scenarios from the analyzed project documentation. Review and refine them before case generation.</p>
                 </div>
                 <div className="header-actions" style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                    <button style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s'}}>
                       <IconRefresh /> Re-generate
                    </button>
                    <button onClick={() => navigate('/test-cases')} style={{background: '#60a5fa', border: 'none', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(96, 165, 250, 0.39)'}}>
                       Generate Test Cases →
                    </button>
                 </div>
            </div>

            <div className="scenarios-layout" style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem'}}>
               
               <div className="scenarios-table glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
                  <div className="table-header" style={{display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr', padding: '1rem 1.5rem', background: 'rgba(15,23,42,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em'}}>
                     <span>SCENARIO NAME</span><span>DESCRIPTION</span><span>STATUS</span><span>ACTIONS</span>
                  </div>
                  
                  <div className="table-row" style={{display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center'}}>
                     <div className="col-name" style={{display: 'flex', flexDirection: 'column'}}>
                        <strong style={{fontSize: '0.95rem', color: 'white', marginBottom: '0.25rem'}}>TS-001: Valid Credentials Login</strong>
                        <span style={{fontSize: '0.75rem', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '4px'}}><svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> High Priority</span>
                     </div>
                     <div className="col-desc" style={{fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.4}}>Verify that a user can successfully log in using vali...</div>
                     <div className="col-status"><span style={{background: 'rgba(255,255,255,0.05)', color: '#94a3b8', padding: '4px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700}}>● DRAFT</span></div>
                     <div className="col-actions"></div>
                  </div>

                  <div className="table-row" style={{display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center'}}>
                     <div className="col-name" style={{display: 'flex', flexDirection: 'column'}}>
                        <strong style={{fontSize: '0.95rem', color: 'white', marginBottom: '0.25rem'}}>TS-002: Multi-Factor Authentication</strong>
                        <span style={{fontSize: '0.75rem', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '4px'}}><svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> Security</span>
                     </div>
                     <div className="col-desc" style={{fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.4}}>Ensure the OTP verification flow triggers correctly and...</div>
                     <div className="col-status"><span style={{background: 'rgba(255,255,255,0.05)', color: '#94a3b8', padding: '4px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700}}>● DRAFT</span></div>
                     <div className="col-actions"></div>
                  </div>

                  <div className="table-row active" style={{display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr', padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center'}}>
                     <div className="col-name" style={{display: 'flex', flexDirection: 'column'}}>
                        <strong style={{fontSize: '0.95rem', color: 'white', marginBottom: '0.25rem'}}>TS-003: OAuth 2.0 Provider Integration</strong>
                        <span style={{fontSize: '0.75rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px'}}>∞ Integration</span>
                     </div>
                     <div className="col-desc">
                        <input type="text" className="inline-edit" value="Validate Google and GitHub" readOnly style={{background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', width: '90%', outline: 'none'}} />
                     </div>
                     <div className="col-status"><span style={{background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '4px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700}}>● REVIEWED</span></div>
                     <div className="col-actions" style={{display: 'flex', gap: '8px'}}>
                        <button style={{background: '#3b82f6', border: 'none', color: 'white', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IconCheck /></button>
                        <button style={{background: 'rgba(255,255,255,0.05)', border: 'none', color: '#9ca3af', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><IconTrash /></button>
                     </div>
                  </div>
                  
                  <div className="table-row" style={{display: 'grid', gridTemplateColumns: '2fr 3fr 1fr 1fr', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center'}}>
                     <div className="col-name" style={{display: 'flex', flexDirection: 'column'}}>
                        <strong style={{fontSize: '0.95rem', color: 'white', marginBottom: '0.25rem'}}>TS-004: Password Reset Workflow</strong>
                        <span style={{fontSize: '0.75rem', color: '#f97316', display: 'flex', alignItems: 'center', gap: '4px'}}>↺ User Flow</span>
                     </div>
                     <div className="col-desc" style={{fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.4}}>Test the full cycle of 'Forgot Password' from email...</div>
                     <div className="col-status"><span style={{background: 'rgba(255,255,255,0.05)', color: '#94a3b8', padding: '4px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700}}>● DRAFT</span></div>
                     <div className="col-actions"></div>
                  </div>

                  <div className="table-footer" style={{padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#9ca3af', background: 'rgba(15,23,42,0.2)', marginTop: 'auto'}}>
                     <span>Showing 4 of 12 generated scenarios</span>
                     <div className="pagination" style={{display: 'flex', gap: '4px'}}>
                        <button style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer'}}>&lt;</button>
                        <button style={{background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer'}}>1</button>
                        <button style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer'}}>2</button>
                        <button style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer'}}>3</button>
                        <button style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', color: '#e2e8f0', width: '28px', height: '28px', borderRadius: '4px', cursor: 'pointer'}}>&gt;</button>
                     </div>
                  </div>
               </div>

               <div className="scenarios-sidebar" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div className="insight-card glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', position: 'relative'}}>
                     <div style={{position: 'absolute', top: '1rem', right: '1rem', color: '#475569'}}><IconSparkles /></div>
                     <h3 style={{fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', margin: '0 0 1rem 0', color: '#e2e8f0'}}>AI INSIGHT</h3>
                     <p style={{color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1.5rem 0'}}>"Found a potential gap in session timeout scenarios for mobile users. Should I generate an additional scenario for background-state handling?"</p>
                     <button style={{width: '100%', background: 'rgba(59,130,246,0.2)', color: '#93c5fd', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.05em', cursor: 'pointer', transition: 'background 0.2s'}}>YES, GENERATE</button>
                  </div>
                  
                  <div className="coverage-card glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                     <h3 style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 1.5rem 0', color: '#9ca3af', textTransform: 'uppercase'}}>SCENARIO COVERAGE</h3>
                     <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                        <div>
                           <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                              <span>Functional</span><span style={{color: '#93c5fd'}}>85%</span>
                           </div>
                           <div style={{height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}}><div style={{width: '85%', height: '100%', background: '#60a5fa', borderRadius: '2px'}}></div></div>
                        </div>
                        <div>
                           <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                              <span>Security</span><span style={{color: '#f87171'}}>40%</span>
                           </div>
                           <div style={{height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}}><div style={{width: '40%', height: '100%', background: '#f87171', borderRadius: '2px'}}></div></div>
                        </div>
                        <div>
                           <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                              <span>Negative</span><span style={{color: '#fdba74'}}>62%</span>
                           </div>
                           <div style={{height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px'}}><div style={{width: '62%', height: '100%', background: '#fb923c', borderRadius: '2px'}}></div></div>
                        </div>
                     </div>
                  </div>

                  <div style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
                     <div style={{color: '#9ca3af'}}><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></div>
                     <span style={{fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0'}}>Export to Jira</span>
                  </div>

                  <div style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer'}}>
                     <div style={{color: '#9ca3af'}}><IconDownload /></div>
                     <span style={{fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0'}}>Download CSV</span>
                  </div>
               </div>
            </div>
            
            <div style={{position: 'fixed', bottom: '2rem', right: '2rem'}}>
               <button style={{width: '48px', height: '48px', borderRadius: '50%', background: '#c7d2fe', color: '#312e81', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'}}>
                  <IconSparkles />
               </button>
            </div>

            <div style={{position: 'fixed', bottom: '2rem', left: '18rem', background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', width: '220px'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase'}}><span style={{color: '#3b82f6'}}>●</span> AI ENGINE ONLINE</div>
               <div style={{fontSize: '0.8rem', color: '#9ca3af', lineHeight: 1.4}}>System is analyzing 42 feature requirements.</div>
            </div>
         </div>
      </div>
    </div>
  );
}

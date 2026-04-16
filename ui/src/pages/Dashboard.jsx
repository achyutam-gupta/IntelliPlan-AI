import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#080c14', color: 'white', overflow: 'hidden', fontFamily: '"Inter", sans-serif'}}>
      <Sidebar active="dashboard" />
      <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
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
          <div className="page-header" style={{marginBottom: '2rem'}}>
             <h1 style={{fontSize: '2.2rem', color: 'white', marginBottom: '0.5rem', fontWeight: 700}}>Architectural Intelligence</h1>
             <p style={{color: '#9ca3af', fontSize: '1rem'}}>Project Alpha: Unified testing strategy for Enterprise Core</p>
          </div>
          
          <div className="stats-grid-dashboard" style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
            <div className="stat-card glass" style={{background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                 <div className="stat-icon purple" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '8px', borderRadius: '8px'}}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 </div>
                 <span className="trend pos" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600}}>+12%</span>
               </div>
               <div className="stat-info">
                  <div className="label" style={{color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem'}}>TOTAL USER STORIES</div>
                  <div className="value" style={{color: 'white', fontSize: '1.8rem', fontWeight: 700}}>142</div>
               </div>
            </div>

            <div className="stat-card glass" style={{background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                 <div className="stat-icon blue" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '8px', borderRadius: '8px'}}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                 </div>
                 <span className="trend" style={{background: 'rgba(148, 163, 184, 0.1)', color: '#9ca3af', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600}}>Static</span>
               </div>
               <div className="stat-info">
                  <div className="label" style={{color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem'}}>TEST PLANS</div>
                  <div className="value" style={{color: 'white', fontSize: '1.8rem', fontWeight: 700}}>24</div>
               </div>
            </div>

            <div className="stat-card glass" style={{background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                 <div className="stat-icon vibrant" style={{background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '8px', borderRadius: '8px'}}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                 </div>
                 <span className="trend pos" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600}}>+8%</span>
               </div>
               <div className="stat-info">
                  <div className="label" style={{color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem'}}>TEST SCENARIOS</div>
                  <div className="value" style={{color: 'white', fontSize: '1.8rem', fontWeight: 700}}>863</div>
               </div>
            </div>

            <div className="stat-card glass" style={{background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                 <div className="stat-icon navy" style={{background: 'rgba(100, 116, 139, 0.1)', color: '#94a3b8', padding: '8px', borderRadius: '8px'}}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <span className="trend neg" style={{background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600}}>-2%</span>
               </div>
               <div className="stat-info">
                  <div className="label" style={{color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem'}}>TEST CASES</div>
                  <div className="value" style={{color: 'white', fontSize: '1.8rem', fontWeight: 700}}>3.2k</div>
               </div>
            </div>
          </div>

          <div className="dashboard-row" style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem'}}>
            <div className="chart-container glass" style={{background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column'}}>
               <div className="chart-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
                  <div>
                    <h3 style={{color: 'white', fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 600}}>Automation Coverage %</h3>
                    <p style={{color: '#9ca3af', fontSize: '0.85rem', margin: 0}}>System intelligence scan across all modules</p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{color: 'white', fontSize: '2rem', fontWeight: 700, lineHeight: 1}}>84.2%</div>
                    <div style={{color: '#10b981', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em'}}>OPTIMIZED</div>
                  </div>
               </div>
               <div className="bar-chart-placeholder" style={{display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', marginTop: 'auto'}}>
                  {[30, 45, 30, 65, 45, 60, 40, 80, 50, 75, 40, 85, 30].map((h, i) => (
                    <div key={i} className="bar" style={{height: `${h}%`, flex: 1, background: 'rgba(96, 165, 250, 0.2)', borderRadius: '4px 4px 0 0'}}></div>
                  ))}
               </div>
            </div>

            <div className="activity-container glass" style={{background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div className="activity-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                  <h3 style={{color: 'white', fontSize: '1.1rem', margin: 0, fontWeight: 600}}>Recent Activity</h3>
                  <span className="view-all" style={{color: '#60a5fa', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500}}>View All</span>
               </div>
               <div className="activity-list" style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                  <div className="activity-item" style={{display: 'flex', gap: '12px'}}>
                    <div className="act-icon" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    </div>
                    <div className="act-content">
                      <p style={{margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.4}}><strong>System</strong> generated 42 new test cases for <span style={{color: '#60a5fa'}}>Payment-Gateway</span></p>
                      <span className="time" style={{color: '#64748b', fontSize: '0.75rem'}}>12 minutes ago</span>
                    </div>
                  </div>
                  <div className="activity-item" style={{display: 'flex', gap: '12px'}}>
                    <div className="act-icon" style={{background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div className="act-content">
                      <p style={{margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.4}}><strong>Sarah Williams</strong> approved the <span style={{color: '#10b981'}}>Security Audit Plan</span></p>
                      <span className="time" style={{color: '#64748b', fontSize: '0.75rem'}}>2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item" style={{display: 'flex', gap: '12px'}}>
                    <div className="act-icon" style={{background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                      <span style={{fontSize: '12px', fontWeight: 'bold'}}>!</span>
                    </div>
                    <div className="act-content">
                      <p style={{margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.4}}><strong>Analyzer</strong> flagged 3 missing user story connections</p>
                      <span className="time" style={{color: '#64748b', fontSize: '0.75rem'}}>4 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item" style={{display: 'flex', gap: '12px'}}>
                    <div className="act-icon" style={{background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                    </div>
                    <div className="act-content">
                      <p style={{margin: '0 0 0.25rem 0', color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.4}}><strong>New Project</strong> documentation imported by Chen</p>
                      <span className="time" style={{color: '#64748b', fontSize: '0.75rem'}}>Yesterday</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="accelerators">
            <h3 style={{color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '1.25rem'}}>WORKFLOW ACCELERATORS</h3>
            <div className="acc-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem'}}>
              <div className="acc-card" style={{background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.2s'}} onClick={() => navigate('/url-analyzer')}>
                 <div className="acc-icon-box" style={{background: '#3b82f6', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0}}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 </div>
                 <div className="acc-info">
                    <h4 style={{color: 'white', margin: '0 0 0.25rem 0', fontSize: '1rem'}}>Analyzer Engine</h4>
                    <p style={{color: '#9ca3af', margin: 0, fontSize: '0.85rem'}}>Map your app architecture</p>
                 </div>
              </div>
              <div className="acc-card" style={{background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.2s'}} onClick={() => navigate('/user-stories')}>
                 <div className="acc-icon-box" style={{background: '#8b5cf6', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0}}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 </div>
                 <div className="acc-info">
                    <h4 style={{color: 'white', margin: '0 0 0.25rem 0', fontSize: '1rem'}}>Story Generator</h4>
                    <p style={{color: '#9ca3af', margin: 0, fontSize: '0.85rem'}}>From concept to test cases</p>
                 </div>
              </div>
              <div className="acc-card" style={{background: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'background 0.2s', position: 'relative'}} onClick={() => navigate('/code-gen')}>
                 <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                     <div className="acc-icon-box" style={{background: '#f97316', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0}}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                     </div>
                     <div className="acc-info">
                        <h4 style={{color: 'white', margin: '0 0 0.25rem 0', fontSize: '1rem'}}>Code Lab</h4>
                        <p style={{color: '#9ca3af', margin: 0, fontSize: '0.85rem'}}>Framework agnostic generation</p>
                     </div>
                 </div>
                 <div style={{background: '#3b82f6', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem', paddingBottom: '3px'}}>+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

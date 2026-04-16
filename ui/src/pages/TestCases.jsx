import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconDownload, IconSparkles, IconLightning, IconTrash, IconPlan } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function TestCases() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (sessionStorage.getItem('guestMode') === 'true') {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#080c14', color: 'white', overflow: 'hidden', fontFamily: '"Inter", sans-serif'}}>
      <Sidebar active="test-cases" />
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
                       <span style={{background: 'rgba(96,165,250,0.15)', color: '#60a5fa', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em'}}>MODULE 05</span>
                       <span style={{color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase'}}>/ Authentication Suite</span>
                    </div>
                    <h1 style={{fontSize: '2.2rem', margin: '0 0 0.5rem 0', fontWeight: 700}}>Test Case Specifications</h1>
                    <p style={{color: '#9ca3af', fontSize: '1rem', margin: 0, maxWidth: '650px', lineHeight: 1.5}}>Refine generated test cases. Review steps, expected results, and set execution priorities before finalizing automation scripts.</p>
                 </div>
                 <div className="header-actions" style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                    <button style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'background 0.2s'}}>
                       <IconDownload /> Export PDF
                    </button>
                    <button onClick={() => handleNavigation('/code-gen')} style={{background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', border: 'none', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(96, 165, 250, 0.39)'}}>
                       <IconSparkles /> Generate Automation Code
                    </button>
                 </div>
            </div>

            <div className="summary-cards" style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr)', gap: '1.5rem', marginBottom: '2rem'}}>
               <div className="summary-card glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                  <div className="label" style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase'}}>TOTAL CASES</div>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: '12px'}}>
                     <span style={{fontSize: '2.5rem', fontWeight: 700, lineHeight: 1}}>42</span>
                     <span style={{color: '#10b981', fontSize: '0.75rem', fontWeight: 600}}>+12 from last scan</span>
                  </div>
               </div>
               <div className="summary-card glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                  <div className="label" style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '0.5rem', textTransform: 'uppercase'}}>HIGH PRIORITY</div>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: '12px'}}>
                     <span style={{fontSize: '2.5rem', fontWeight: 700, lineHeight: 1}}>18</span>
                     <span style={{color: '#94a3b8', fontSize: '0.75rem', maxWidth: '100px', lineHeight: 1.3}}>Requires immediate attention</span>
                  </div>
               </div>
               <div className="summary-card glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                     <div className="label" style={{fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: '#60a5fa', marginBottom: '0.5rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px'}}>AI RECOMMENDATION</div>
                     <p style={{margin: 0, fontSize: '0.95rem', fontWeight: 500, color: '#f8fafc'}}>5 Duplicate scenarios detected in 'Checkout Flow'</p>
                  </div>
                  <button style={{background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'}}>Review</button>
               </div>
            </div>

            <div className="cases-table glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', marginBottom: '2rem', position: 'relative'}}>
               <div className="table-controls" style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,23,42,0.4)', alignItems: 'center'}}>
                  <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                     <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: 'white'}}>
                        <input type="checkbox" style={{accentColor: '#3b82f6', width: '16px', height: '16px'}} /> Select All
                     </label>
                     <button style={{background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'}}><IconTrash /> Bulk Delete</button>
                     <button style={{background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'}}><IconPlan /> Move to Suite</button>
                  </div>
                  <div style={{fontSize: '0.85rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px'}}>
                     Sort by: <select style={{background: 'rgba(15,23,42,0.8)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px', outline: 'none'}}><option>Priority (Highest)</option></select>
                  </div>
               </div>
               
               <div className="table-header" style={{display: 'grid', gridTemplateColumns: '40px 60px 2fr 2fr 100px 150px 40px', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em'}}>
                  <span></span><span>ID</span><span>TEST DESCRIPTION & STEPS</span><span>EXPECTED RESULT</span><span>PRIORITY</span><span>LABELS</span><span>ACTIONS</span>
               </div>
               
               <div className="cases-list">
                  {[
                    { id: 'TC-801', title: 'Validate Multi-factor Auth Token', steps: ['Navigate to login page', 'Enter valid user credentials', 'Submit secondary MFA token "000000"'], expected: 'System should display \'Invalid Token\' error message and remain on the verification screen without locking account.', priority: 'HIGH', prioColor: '#ef4444', labels: ['Security', 'Auth'], checked: true },
                    { id: 'TC-802', title: 'Password Complexity - Minimum Length', steps: ['Access \'Change Password\' profile settings', 'Input password with 5 characters'], expected: 'Validation error must trigger: \'Password must be at least 8 characters\'. Save button remains disabled.', priority: 'MEDIUM', prioColor: '#f97316', labels: ['UI/UX'], checked: false },
                    { id: 'TC-803', title: 'Remember Me Persistence', steps: ['Log in with \'Remember Me\' enabled', 'Close browser tab and reopen'], expected: 'User should be automatically authenticated and redirected to Dashboard without login prompt.', priority: 'LOW', prioColor: '#3b82f6', labels: ['Regression'], checked: true }
                  ].map(tc => (
                    <div key={tc.id} className="case-row" style={{display: 'grid', gridTemplateColumns: '40px 60px 2fr 2fr 100px 150px 40px', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: tc.checked ? 'rgba(255,255,255,0.02)' : 'transparent', alignItems: 'start'}}>
                       <div><input type="checkbox" defaultChecked={tc.checked} style={{accentColor: '#3b82f6', width: '16px', height: '16px'}} /></div>
                       <div style={{fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600}}>{tc.id.replace('-', '-\n')}</div>
                       <div style={{paddingRight: '2rem'}}>
                          <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: 'white', fontWeight: 600}}>{tc.title}</h4>
                          <ol style={{margin: 0, paddingLeft: '1.25rem', color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.5}}>
                             {tc.steps.map((step, i) => <li key={i}>{step}</li>)}
                          </ol>
                       </div>
                       <div style={{fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5, paddingRight: '2rem'}}>{tc.expected}</div>
                       <div><span style={{background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.65rem', fontWeight: 700, color: tc.prioColor}}>● {tc.priority}</span></div>
                       <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                          {tc.labels.map(l => <span key={l} style={{background: 'rgba(255,255,255,0.1)', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem'}}>{l}</span>)}
                       </div>
                       <div style={{color: '#64748b', cursor: 'pointer', textAlign: 'right', fontSize: '1.2rem', marginTop: '-4px'}}>⋮</div>
                    </div>
                  ))}
               </div>

               <div style={{padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#9ca3af', background: 'rgba(15,23,42,0.2)'}}>
                  <span>Showing <strong>1-10</strong> of <strong>42</strong> test cases</span>
                  <div className="pagination" style={{display: 'flex', gap: '4px'}}>
                     <button style={{background: 'transparent', border: 'none', color: '#9ca3af', width: '28px', height: '28px', cursor: 'pointer'}}>&lt;</button>
                     <button style={{background: '#e2e8f0', color: '#0f172a', border: 'none', width: '28px', height: '28px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer'}}>1</button>
                     <button style={{background: 'transparent', border: 'none', color: '#9ca3af', width: '28px', height: '28px', cursor: 'pointer'}}>2</button>
                     <button style={{background: 'transparent', border: 'none', color: '#9ca3af', width: '28px', height: '28px', cursor: 'pointer'}}>3</button>
                     <button style={{background: 'transparent', border: 'none', color: '#9ca3af', width: '28px', height: '28px', cursor: 'pointer'}}>&gt;</button>
                  </div>
               </div>

               <button style={{position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '48px', height: '48px', borderRadius: '50%', background: '#3b82f6', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)'}}>
                  <IconLightning />
               </button>
            </div>

            <div className="cases-footer-row" style={{display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 3fr)', gap: '2rem'}}>
               <div className="insights-panel glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                  <div style={{display: 'flex', gap: '12px', marginBottom: '1.5rem'}}>
                     <div style={{background: 'rgba(255,255,255,0.1)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', flexShrink: 0}}><IconSparkles /></div>
                     <div>
                        <h3 style={{fontSize: '1rem', fontWeight: 600, margin: '0 0 0.25rem 0'}}>IntelliInsights: Coverage Gap</h3>
                        <p style={{fontSize: '0.85rem', color: '#9ca3af', margin: 0}}>AI detected missing edge cases based on codebase analysis.</p>
                     </div>
                  </div>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                     <div style={{background: 'rgba(30,58,138,0.2)', borderLeft: '4px solid #60a5fa', padding: '1.25rem', borderRadius: '0 8px 8px 0'}}>
                        <h4 style={{fontSize: '0.9rem', color: '#93c5fd', margin: '0 0 0.5rem 0', fontWeight: 600}}>Missing: Password Recovery via SMS</h4>
                        <p style={{fontSize: '0.85rem', color: '#e2e8f0', margin: '0 0 1rem 0', lineHeight: 1.4}}>Users might attempt recovery via mobile if email fails. No test coverage found for SMS gateway response.</p>
                        <button style={{background: 'transparent', border: 'none', color: 'white', fontWeight: 600, fontSize: '0.85rem', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'}}>⊕ Generate this case</button>
                     </div>
                     <div style={{background: 'rgba(124,45,18,0.2)', borderLeft: '4px solid #fb923c', padding: '1.25rem', borderRadius: '0 8px 8px 0'}}>
                        <h4 style={{fontSize: '0.9rem', color: '#fdba74', margin: '0 0 0.5rem 0', fontWeight: 600}}>Observation: Token Expiry</h4>
                        <p style={{fontSize: '0.85rem', color: '#e2e8f0', margin: 0, lineHeight: 1.4}}>The current verification steps don't account for token TTL. Recommend adding a 'Stale Token' verification step.</p>
                     </div>
                  </div>
               </div>

               <div className="selection-card glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', display: 'flex', flexDirection: 'column'}}>
                  <h3 style={{fontSize: '1rem', fontWeight: 600, margin: '0 0 1.5rem 0'}}>Selection Summary</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem'}}>
                     <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem'}}><span style={{color: '#9ca3af'}}>Selected Items</span><strong style={{color: 'white'}}>12 Cases</strong></div>
                     <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem'}}><span style={{color: '#9ca3af'}}>Avg. Difficulty</span><strong style={{color: '#60a5fa'}}>Moderate</strong></div>
                     <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem'}}><span style={{color: '#9ca3af'}}>Estimated Exec.</span><strong style={{color: 'white'}}>14.5 Minutes</strong></div>
                  </div>
                  <div style={{marginBottom: '2rem'}}>
                     <div style={{fontSize: '0.7rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '1rem'}}>AUTOMATION READINESS</div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <div style={{width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', borderRightColor: '#3b82f6', borderBottomColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700}}>85%</div>
                        <p style={{margin: 0, fontSize: '0.85rem', color: '#e2e8f0', flex: 1, lineHeight: 1.4}}>12 selected cases are ready for Cypress/Playwright conversion.</p>
                     </div>
                  </div>
                  <button onClick={() => handleNavigation('/code-gen')} style={{width: '100%', marginTop: 'auto', background: '#3b82f6', border: 'none', padding: '0.85rem', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background 0.2s'}}>Generate Automation Code ➔</button>
               </div>
            </div>

            <div style={{position: 'fixed', bottom: '2rem', left: '18rem', background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', width: '220px'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase'}}><span style={{color: '#10b981'}}>●</span> AI Engine Active</div>
               <div style={{fontSize: '0.75rem', color: '#64748b'}}>Processing Model: GPT-4o-Turbo</div>
            </div>
         </div>
      </div>
    </div>
  );
}

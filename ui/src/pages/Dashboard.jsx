import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSearch, IconSparkles } from '../components/Icons';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function Dashboard() {
  const navigate = useNavigate();

  /* ─── Real-time Telemetry State ─── */
  const [metrics, setMetrics] = useState({
    stories: 0,
    scenarios: 0,
    cases: 0,
    plans: 0,
    coverage: 0,
    connections: { jira: false, ai: false }
  });

  useEffect(() => {
    // 🛡️ Guest Guard
    if (sessionStorage.getItem('guestMode') === 'true') {
      navigate('/login');
      return;
    }

    // 📊 Load Live Metrics
    const stories   = JSON.parse(sessionStorage.getItem('us_stories') || '[]');
    const scenarios = JSON.parse(sessionStorage.getItem('ts_scenarios') || '[]');
    const cases     = JSON.parse(sessionStorage.getItem('tc_cases') || '[]');
    const plan      = JSON.parse(sessionStorage.getItem('tp_data') || 'null');

    // 📡 Check Infrastructure
    const jiraOk = !!(localStorage.getItem('jira_url') && localStorage.getItem('jira_token'));
    const aiProvider = localStorage.getItem('llm_provider');
    const aiOk = aiProvider === 'Ollama' || !!(localStorage.getItem(`llm_${(aiProvider||'').toLowerCase()}Key`));

    // 📈 Logic: Coverage is % of stories with at least one scenario
    const linkedStoryIds = new Set(scenarios.map(s => s.linkedStory));
    const cov = stories.length > 0 ? Math.round((linkedStoryIds.size / stories.length) * 100) : 0;

    setMetrics({
      stories: stories.length,
      scenarios: scenarios.length,
      cases: cases.length,
      plans: plan ? 1 : 0,
      coverage: cov,
      connections: { jira: jiraOk, ai: aiOk }
    });
  }, [navigate]);

  const card = { background:'rgba(30,41,59,0.5)', padding:'1.5rem', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.05)', backdropFilter:'blur(10px)' };
  const pulse = { width:'8px', height:'8px', borderRadius:'50%', animation:'pulse 2s infinite' };

  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#080c14', color: 'white', overflow: 'hidden', fontFamily: '"Inter", sans-serif'}}>
      <Sidebar active="dashboard" />
      
      <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
        <Header searchPlaceholder="Search architecture..." />

        <div className="page-content" style={{padding: '2rem', maxWidth: '1200px'}}>
          <div style={{marginBottom: '2rem'}}>
             <h1 style={{fontSize: '2.2rem', color: 'white', marginBottom: '0.25rem', fontWeight: 800, letterSpacing:'-0.01em'}}>Architectural Intelligence</h1>
             <p style={{color: '#64748b', fontSize: '1rem'}}>Live telemetry and autonomous QA synchronization metrics.</p>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
            {/* Story Card */}
            <div style={card}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                 <div style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', padding: '8px', borderRadius: '8px'}}><IconSparkles/></div>
                 <span style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600}}>LIVE</span>
               </div>
               <div className="stat-info">
                  <div style={{color: '#64748b', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem'}}>TOTAL USER STORIES</div>
                  <div style={{color: 'white', fontSize: '1.8rem', fontWeight: 700}}>{metrics.stories}</div>
               </div>
            </div>

            {/* Plans Card */}
            <div style={card}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                 <div style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '8px', borderRadius: '8px'}}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                 </div>
               </div>
               <div className="stat-info">
                  <div style={{color: '#64748b', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem'}}>ACTIVE TEST PLANS</div>
                  <div style={{color: 'white', fontSize: '1.8rem', fontWeight: 700}}>{metrics.plans}</div>
               </div>
            </div>

            {/* Scenarios Card */}
            <div style={card}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                 <div style={{background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '8px', borderRadius: '8px'}}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0" /></svg>
                 </div>
               </div>
               <div className="stat-info">
                  <div style={{color: '#64748b', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem'}}>TEST SCENARIOS</div>
                  <div style={{color: 'white', fontSize: '1.8rem', fontWeight: 700}}>{metrics.scenarios}</div>
               </div>
            </div>

            {/* Cases Card */}
            <div style={card}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                 <div style={{background: 'rgba(100, 116, 139, 0.1)', color: '#94a3b8', padding: '8px', borderRadius: '8px'}}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                 </div>
               </div>
               <div className="stat-info">
                  <div style={{color: '#64748b', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem'}}>TEST CASE SPECS</div>
                  <div style={{color: 'white', fontSize: '1.8rem', fontWeight: 700}}>{metrics.cases}</div>
               </div>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem'}}>
            <div style={card}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
                  <div>
                    <h3 style={{color: 'white', fontSize: '1.1rem', margin: '0 0 0.25rem 0', fontWeight: 700}}>Strategic Automation Coverage</h3>
                    <p style={{color: '#64748b', fontSize: '0.85rem', margin: 0}}>Real-time requirement-to-scenario mapping</p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{color: metrics.coverage > 70 ? '#10b981' : '#f59e0b', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1}}>{metrics.coverage}%</div>
                    <div style={{color: metrics.coverage > 70 ? '#10b981' : '#f59e0b', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', marginTop:'4px'}}>CALCULATED</div>
                  </div>
               </div>
               <div style={{display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', marginTop: 'auto'}}>
                  {[30, 45, 30, 65, 45, 60, 40, metrics.coverage, 50, 75, 40, 85, 30].map((h, i) => (
                    <div key={i} style={{height: `${h}%`, flex: 1, background: i === 7 ? 'linear-gradient(to top, #3b82f6, #60a5fa)' : 'rgba(59, 130, 246, 0.15)', borderRadius: '4px 4px 0 0', transition:'height 0.5s ease'}} />
                  ))}
               </div>
            </div>

            <div style={card}>
               <h3 style={{color: 'white', fontSize: '1.1rem', margin: '0 0 1.5rem', fontWeight: 700}}>Recent Activity</h3>
               <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                  {[
                    { icon: '🧪', color:'#60a5fa', txt: `System optimized ${metrics.cases} test cases`, time: 'Real-time' },
                    { icon: '📋', color:'#10b981', txt: `Generated ${metrics.scenarios} scenarios from stories`, time: 'Live session' },
                    { icon: '📡', color:'#a78bfa', txt: `Jira traceability established for ${metrics.stories} requirements`, time: 'Synced' },
                  ].map((act, i) => (
                    <div key={i} style={{display: 'flex', gap: '12px', alignItems:'center'}}>
                      <div style={{background: 'rgba(255,255,255,0.05)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:'1.2rem'}}>{act.icon}</div>
                      <div>
                        <p style={{margin: 0, color: '#e2e8f0', fontSize: '0.85rem', fontWeight:500}}>{act.txt}</p>
                        <span style={{color: act.color, fontSize: '0.7rem', fontWeight:700}}>{act.time}</span>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}

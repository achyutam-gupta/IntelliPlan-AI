import React, { useState } from 'react';
import { IconSearch, IconSettings, IconRefresh, IconCheck, IconLink } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function Settings() {
  const [provider, setProvider] = useState('Groq');
  const [theme, setTheme] = useState('Obsidian Dark');
  
  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#0f172a', color: 'white'}}>
      <Sidebar active="settings" />
      <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative'}}>
         <header className="top-nav" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
            <div className="search-bar" style={{display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '300px'}}>
              <IconSearch />
              <input type="text" placeholder="Search workspace..." style={{background: 'transparent', border: 'none', color: 'white', marginLeft: '0.5rem', outline: 'none', width: '100%', fontSize: '0.9rem'}} />
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
               <div className="workspace-links" style={{display: 'flex', gap: '2rem', fontSize: '0.9rem'}}>
                 <span style={{color: '#9ca3af', cursor: 'pointer'}}>Workspace</span>
                 <span className="active" style={{color: '#3b82f6', fontWeight: 500, cursor: 'pointer'}}>Project Settings</span>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af'}}>
                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 <div style={{width: '24px', height: '24px', borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>JD</div>
               </div>
            </div>
         </header>

         <div className="page-content fade-in" style={{padding: '2rem', maxWidth: '1200px'}}>
            <div className="page-header-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem'}}>
                 <div className="header-text">
                    <h1 style={{fontSize: '2.2rem', margin: '0 0 0.5rem 0', fontWeight: 700}}>Settings & Integrations</h1>
                    <p style={{color: '#9ca3af', fontSize: '1rem', margin: 0}}>Configure your AI engine, cloud services, and personal preferences.</p>
                 </div>
                 <div className="header-actions" style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
                    <button style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s'}}>
                       Discard Changes
                    </button>
                    <button style={{background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'}}>
                       Save Workspace
                    </button>
                 </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '2rem'}}>
               
               {/* Left Column */}
               <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                  
                  {/* Model Engine Provider */}
                  <div className="glass card" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem'}}>
                     <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem'}}>
                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px', color: '#9ca3af'}}>
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                        <div>
                           <h3 style={{margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600}}>Model Engine Provider</h3>
                           <p style={{color: '#9ca3af', margin: 0, fontSize: '0.85rem'}}>Select the AI brain for your test generation.</p>
                        </div>
                     </div>

                     <div style={{marginBottom: '1.5rem'}}>
                        <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase'}}>PROVIDER</label>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
                           {['Ollama', 'Groq', 'Grok'].map(p => (
                              <button key={p} onClick={() => setProvider(p)} style={{background: 'rgba(15,23,42,0.8)', border: provider === p ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.05)', padding: '0.85rem', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
                                 <span style={{color: provider === p ? '#60a5fa' : '#64748b'}}>●</span> {p}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
                        <div>
                           <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase'}}>ACTIVE MODEL</label>
                           <select style={{width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.85rem', borderRadius: '8px', outline: 'none', appearance: 'none'}}>
                              <option>Llama-3.3-70b-versatile</option>
                           </select>
                        </div>
                        <div>
                           <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase'}}>MAX TOKENS</label>
                           <input type="text" defaultValue="4096" style={{width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.85rem', borderRadius: '8px', outline: 'none'}} />
                        </div>
                     </div>

                     <div style={{marginBottom: '1rem'}}>
                        <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase'}}>GROQ API KEY</label>
                        <div style={{position: 'relative'}}>
                           <input type="password" defaultValue="gsk_1234567890abcdefghijklmnopqrstuvwxyz" style={{width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.85rem', borderRadius: '8px', outline: 'none', fontFamily: 'monospace'}} />
                           <div style={{position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', cursor: 'pointer'}}>
                              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                           </div>
                        </div>
                        <p style={{margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#64748b', fontStyle: 'italic'}}>Keys are encrypted with AES-256 and never stored in plain text.</p>
                     </div>

                     <button style={{width: '100%', marginTop: '1.5rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.85rem', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s'}}>
                        <IconCheck /> Verify Model Connection
                     </button>
                  </div>

                  {/* Jira Integration */}
                  <div className="glass card" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem'}}>
                     <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
                        <div style={{display: 'flex', gap: '1rem'}}>
                           <div style={{background: 'rgba(59,130,246,0.1)', padding: '12px', borderRadius: '10px', color: '#60a5fa'}}>
                              <IconLink />
                           </div>
                           <div>
                              <h3 style={{margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600}}>Jira Cloud Integration</h3>
                              <p style={{color: '#9ca3af', margin: 0, fontSize: '0.85rem'}}>Sync test cases directly into your Jira backlog.</p>
                           </div>
                        </div>
                        <span style={{background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em'}}>LEGACY MODE</span>
                     </div>

                     <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem'}}>
                        <div>
                           <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase'}}>JIRA URL</label>
                           <input type="text" defaultValue="https://company.atlassian.net" style={{width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '0.85rem', borderRadius: '8px', outline: 'none'}} />
                        </div>
                        <div>
                           <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase'}}>DEV EMAIL</label>
                           <input type="text" defaultValue="dev@company.com" style={{width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '0.85rem', borderRadius: '8px', outline: 'none'}} />
                        </div>
                     </div>

                     <div style={{marginBottom: '2rem'}}>
                        <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase'}}>API V3 TOKEN</label>
                        <input type="password" placeholder="Enter Jira API Token" style={{width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', padding: '0.85rem', borderRadius: '8px', outline: 'none'}} />
                     </div>

                     <button style={{width: '100%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', padding: '0.85rem', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '8px'}}>
                        <IconRefresh /> Sync & Save Integration
                     </button>
                  </div>
               </div>

               {/* Right Column */}
               <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                  
                  {/* General Settings */}
                  <div className="glass card" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem'}}>
                     <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem'}}>
                        <div style={{background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px', color: '#9ca3af'}}>
                           <IconSettings />
                        </div>
                        <div>
                           <h3 style={{margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 600}}>General Settings</h3>
                           <p style={{color: '#9ca3af', margin: 0, fontSize: '0.85rem'}}>Global workspace configurations.</p>
                        </div>
                     </div>

                     <div style={{marginBottom: '2rem'}}>
                        <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase'}}>WORKSPACE NAME</label>
                        <input type="text" defaultValue="IntelliPlan Enterprise" style={{width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.85rem', borderRadius: '8px', outline: 'none'}} />
                     </div>

                     <div style={{marginBottom: '2rem'}}>
                        <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase'}}>NOTIFICATIONS</label>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.4)', padding: '0.75rem 1rem', borderRadius: '8px'}}>
                              <span style={{fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500}}>Email Alerts on Generation</span>
                              <div style={{width: '40px', height: '22px', background: '#3b82f6', borderRadius: '11px', position: 'relative', cursor: 'pointer'}}>
                                 <div style={{width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '20px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)'}}></div>
                              </div>
                           </div>
                           <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15,23,42,0.4)', padding: '0.75rem 1rem', borderRadius: '8px'}}>
                              <span style={{fontSize: '0.9rem', color: '#e2e8f0', fontWeight: 500}}>Weekly Performance Report</span>
                              <div style={{width: '40px', height: '22px', background: 'rgba(255,255,255,0.1)', borderRadius: '11px', position: 'relative', cursor: 'pointer'}}>
                                 <div style={{width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)'}}></div>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div>
                        <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase'}}>VISUAL THEME</label>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                           <div onClick={() => setTheme('Obsidian Dark')} style={{background: 'rgba(15,23,42,0.8)', border: theme === 'Obsidian Dark' ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                              <span style={{fontSize: '0.85rem', color: 'white', fontWeight: 500}}>Obsidian Dark</span>
                           </div>
                           <div onClick={() => setTheme('Crystal Light')} style={{background: 'rgba(15,23,42,0.4)', border: theme === 'Crystal Light' ? '1px solid #60a5fa' : '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
                              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                              <span style={{fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500}}>Crystal Light</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Workspace Usage */}
                  <div className="glass card" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem'}}>
                     <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase'}}>WORKSPACE USAGE</label>
                     <div style={{display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '1rem'}}>
                        <span style={{fontSize: '2.5rem', fontWeight: 700, lineHeight: 1}}>84%</span>
                        <span style={{color: '#9ca3af', fontSize: '0.9rem'}}>of token limit</span>
                     </div>
                     <div style={{height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginBottom: '2rem'}}>
                        <div style={{width: '84%', height: '100%', background: '#c7d2fe', borderRadius: '3px'}}></div>
                     </div>
                     <button style={{width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '0.85rem', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s'}}>
                        Upgrade Plan
                     </button>
                  </div>

                  {/* Need Help */}
                  <div style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <div style={{background: '#fdba74', color: '#c2410c', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700}}>?</div>
                        <span style={{fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0'}}>Need help?</span>
                     </div>
                     <span style={{fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', cursor: 'pointer'}}>Chat with Support</span>
                  </div>

               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

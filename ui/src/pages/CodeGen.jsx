import React, { useState } from 'react';

import { IconSearch, IconDownload, IconSparkles } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function CodeGeneration() {
  const [toggleHeadless, setToggleHeadless] = useState(true);
  const [toggleVideo, setToggleVideo] = useState(false);
  
  return (
    <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#0f172a', color: 'white'}}>
      <Sidebar active="code-gen" />
      <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative'}}>
         <header className="top-nav" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
            <div className="search-bar" style={{display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.6)', padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', width: '300px'}}>
              <IconSearch />
              <input type="text" placeholder="Search project assets..." style={{background: 'transparent', border: 'none', color: 'white', marginLeft: '0.5rem', outline: 'none', width: '100%', fontSize: '0.9rem'}} />
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '2rem'}}>
               <div className="workspace-links" style={{display: 'flex', gap: '2rem', fontSize: '0.9rem'}}>
                 <span style={{color: '#9ca3af', cursor: 'pointer'}}>Workspace</span>
                 <span className="active" style={{color: '#3b82f6', fontWeight: 500, cursor: 'pointer'}}>Project Settings</span>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '1rem', color: '#9ca3af'}}>
                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                 <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </div>
            </div>
         </header>

         <div className="page-content fade-in" style={{padding: '2rem', maxWidth: '1200px'}}>
            <div className="page-header-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem'}}>
                 <div className="header-text">
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem'}}>
                       <span style={{color: '#64748b', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase'}}>PROJECT › TEST SUITE V2 › CODE GENERATOR</span>
                    </div>
                    <h1 style={{fontSize: '2.2rem', margin: '0 0 0.5rem 0', fontWeight: 700}}>Automated Script Generation</h1>
                    <p style={{color: '#9ca3af', fontSize: '1rem', margin: 0, maxWidth: '600px', lineHeight: 1.5}}>Translate your high-level test scenarios into production-ready execution scripts using our neural engine.</p>
                 </div>
                 <div className="header-actions" style={{display: 'flex', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', marginTop: '1.5rem'}}>
                    <button style={{background: '#c7d2fe', color: '#3730a3', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>Cypress</button>
                    <button style={{background: 'transparent', color: '#9ca3af', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer'}}>Playwright</button>
                    <button style={{background: 'transparent', color: '#9ca3af', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '6px', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer'}}>Selenium</button>
                 </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', gap: '2rem'}}>
               
               <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div className="glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                     <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem'}}>
                        <h3 style={{margin: 0, fontSize: '1.05rem', fontWeight: 600}}>Active Scenario</h3>
                        <span style={{background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em'}}>AI OPTIMIZED</span>
                     </div>
                     <div style={{background: 'rgba(15,23,42,0.6)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '1.5rem'}}>
                        <div style={{fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem'}}>Scenario ID: SC-742</div>
                        <h4 style={{margin: '0 0 0.75rem 0', fontSize: '0.95rem', fontWeight: 600}}>E-commerce Checkout Flow</h4>
                        <div style={{display: 'flex', gap: '0.5rem'}}>
                           <span style={{background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#9ca3af'}}>End-to-End</span>
                           <span style={{background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', color: '#9ca3af'}}>Smoke Test</span>
                        </div>
                     </div>
                     
                     <div style={{fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '1rem'}}>SCRIPT PARAMETERS</div>
                     <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                           <span style={{fontSize: '0.85rem', color: '#e2e8f0'}}>Headless Mode</span>
                           <div onClick={() => setToggleHeadless(!toggleHeadless)} style={{width: '36px', height: '20px', background: toggleHeadless ? '#3b82f6' : 'rgba(255,255,255,0.1)', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s'}}>
                              <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: toggleHeadless ? '18px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'}}></div>
                           </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                           <span style={{fontSize: '0.85rem', color: '#e2e8f0'}}>Video Recording</span>
                           <div onClick={() => setToggleVideo(!toggleVideo)} style={{width: '36px', height: '20px', background: toggleVideo ? '#3b82f6' : 'rgba(255,255,255,0.1)', borderRadius: '10px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s'}}>
                              <div style={{width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: toggleVideo ? '18px' : '2px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'}}></div>
                           </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                           <span style={{fontSize: '0.85rem', color: '#e2e8f0'}}>Retry Attempts</span>
                           <span style={{background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600}}>2 Attempts</span>
                        </div>
                     </div>
                  </div>

                  <div className="glass" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem'}}>
                     <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 1.25rem 0', fontSize: '1.05rem', fontWeight: 600}}><IconSparkles /> AI Generation Status</h3>
                     <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: '0.5rem'}}>
                        <span>Logic Accuracy</span><span style={{fontWeight: 700}}>98.4%</span>
                     </div>
                     <div style={{height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '1rem'}}><div style={{width: '98.4%', height: '100%', background: '#60a5fa', borderRadius: '2px'}}></div></div>
                     <p style={{fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic', lineHeight: 1.5, margin: 0}}>
                        "Detected dynamic element ID in Step 3. Automatically mapped to reliable XPath selectors."
                     </p>
                  </div>
               </div>

               <div style={{display: 'flex', flexDirection: 'column'}}>
                  <div className="code-editor-container" style={{background: 'rgba(15,23,42,0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative'}}>
                     <div className="editor-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <div style={{display: 'flex', gap: '6px', alignItems: 'center', width: '200px'}}>
                           <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444'}}></div>
                           <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#eab308'}}></div>
                           <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e'}}></div>
                        </div>
                        <div style={{fontSize: '0.8rem', color: '#9ca3af', display: 'flex', gap: '6px', alignItems: 'center'}}><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> checkout_spec.cy.js</div>
                        <div style={{display: 'flex', gap: '0.5rem', width: '200px', justifyContent: 'flex-end'}}>
                           <button style={{background: 'rgba(255,255,255,0.05)', border: 'none', color: '#e2e8f0', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'}}>
                              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy to Clipboard
                           </button>
                           <button style={{background: '#3b82f6', border: 'none', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'}}>
                              <IconDownload /> Download Code
                           </button>
                        </div>
                     </div>
                     <div className="editor-body" style={{padding: '1.5rem', overflowY: 'auto', flex: 1, fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '0.85rem', lineHeight: 1.6}}>
<pre style={{margin: 0}}><code>{`describe('E-commerce Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.get('[data-test="username"]').type('standard_user');
    cy.get('[data-test="password"]').type('secret_sauce');
    cy.get('#login-button').click();
  });

  it('should complete checkout with valid products', () => {
    // Add items to cart
    cy.get('.inventory_item').first().find('button').click();

    // Navigate to cart
    cy.get('.shopping_cart_link').click();
    cy.get('[data-test="checkout"]').click();

    // Fill information
    cy.get('[data-test="firstName"]').type('John');
    cy.get('[data-test="lastName"]').type('Doe');
    cy.get('[data-test="postalCode"]').type('90210');

    // Complete flow
    cy.get('[data-test="continue"]').click();
    cy.get('[data-test="finish"]').click();
  });
});`}</code></pre>
                     </div>
                     <div className="editor-footer" style={{display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.7rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em'}}>
                        <div style={{display: 'flex', gap: '1.5rem'}}>
                           <span><span style={{color: '#cbd5e1'}}>●</span> ESLINT PASSING</span>
                           <span><span style={{color: '#cbd5e1'}}>●</span> NODE 18+ COMPLIANT</span>
                        </div>
                        <div>42 lines · 1.2kb · Generated in 0.8s</div>
                     </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: '1.5rem', marginTop: '1.5rem'}}>
                     <div style={{background: 'rgba(30,41,59,0.5)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid #f97316'}}>
                        <h4 style={{fontSize: '0.95rem', color: 'white', margin: '0 0 0.5rem 0', fontWeight: 600}}>Selector Optimization</h4>
                        <p style={{fontSize: '0.85rem', color: '#9ca3af', margin: 0, lineHeight: 1.5}}>Our engine replaced 4 volatile selectors with stable data-test attributes to ensure test longevity.</p>
                     </div>
                     <div style={{background: 'rgba(30,41,59,0.5)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid #c084fc'}}>
                        <h4 style={{fontSize: '0.95rem', color: 'white', margin: '0 0 0.5rem 0', fontWeight: 600}}>Integration Snippet</h4>
                        <p style={{fontSize: '0.85rem', color: '#9ca3af', margin: 0, lineHeight: 1.5}}>Add this script to your package.json for seamless CLI execution in CI/CD pipelines.</p>
                     </div>
                     <div style={{background: 'rgba(30,41,59,0.5)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: '4px solid #94a3b8'}}>
                        <h4 style={{fontSize: '0.95rem', color: 'white', margin: '0 0 0.5rem 0', fontWeight: 600}}>Execution Environment</h4>
                        <p style={{fontSize: '0.85rem', color: '#9ca3af', margin: 0, lineHeight: 1.5}}>Tested against Chrome 114 and Firefox 113. No significant performance regressions detected.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <button style={{position: 'absolute', bottom: '2rem', right: '2rem', width: '48px', height: '48px', borderRadius: '50%', background: '#c7d2fe', color: '#312e81', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'}}>
            <IconSparkles />
         </button>
      </div>
    </div>
  );
}

import React from 'react';
import { IconCoverage } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function Coverage() {
   return (
      <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#0f172a', color: 'white'}}>
         <Sidebar active="coverage" />
         <div className="main-content" style={{flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
            <header className="top-nav" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
               <h1 style={{fontSize: '1.5rem', fontWeight: 600, margin: 0}}>Test Coverage Dashboard</h1>
            </header>
            <div className="page-content" style={{padding: '2rem'}}>
               <div className="glass card" style={{background: 'rgba(30,41,59,0.5)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '40px', textAlign: 'center'}}>
                  <div style={{color: '#60a5fa', marginBottom: '1rem', display: 'flex', justifyContent: 'center'}}>
                     <IconCoverage />
                  </div>
                  <h2 style={{fontSize: '1.5rem', fontWeight: 600, margin: '0 0 1rem 0'}}>Coverage Insights</h2>
                  <p style={{color: '#9ca3af', margin: 0}}>Aggregating data from recent runs...</p>
               </div>
            </div>
         </div>
      </div>
   );
}

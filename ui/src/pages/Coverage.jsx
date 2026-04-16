import React from 'react';
import {  IconCoverage , IconSearch } from '../components/Icons';
import Sidebar from '../components/Sidebar';

export default function Coverage() {
   return (
      <div className="app-layout" style={{display: 'flex', height: '100vh', background: '#080c14', color: 'white', overflow: 'hidden', fontFamily: '"Inter", sans-serif'}}>
         <Sidebar active="coverage" />
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

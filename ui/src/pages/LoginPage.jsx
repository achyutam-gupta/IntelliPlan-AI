import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSparkles } from '../components/Icons';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });

  const handleLogin = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('guestMode');
    navigate('/dashboard');
  };

  return (
    <div className="auth-page split-layout">
      <div className="auth-visual">
        <div className="visual-content">
          <div className="logo-white" style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem'}}>
            <div className="logo-icon-box" style={{background: '#3b82f6', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
            </div>
            IntelliPlan AI
          </div>
          <h2 style={{fontSize: '2.5rem', lineHeight: 1.2, marginBottom: '1.5rem', fontWeight: 700}}>
            Orchestrate <span className="text-gradient-blue">Intelligence</span> in<br/>Every Test Cycle.
          </h2>
          <p style={{fontSize: '1.1rem', color: '#9ca3af', maxWidth: '400px', lineHeight: 1.6}}>
            Automate manual QA workflows into high-fidelity test scenarios with our enterprise-grade AI engine.
          </p>

          <div className="insight-card-login glass" style={{marginTop: 'auto', marginBottom: '2rem', padding: '1.5rem', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '450px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem'}}>
               <div style={{background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px', borderRadius: '8px'}}>
                  <IconSparkles />
               </div>
               <span style={{fontWeight: 600, color: 'white'}}>AI Insight</span>
            </div>
            <p style={{color: '#9ca3af', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.5}}>
              "Test coverage for Project Phoenix increased by 42% after deploying automated URL analysis."
            </p>
          </div>
        </div>
        <div className="powered-by" style={{position: 'absolute', bottom: '2rem', width: '100%', textAlign: 'center', color: '#4b5563', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600}}>
          POWERED BY INTELLIPLAN AI ENTERPRISE QA ENGINE
        </div>
        <div className="mesh-gradient bg-mesh"></div>
      </div>
      <div className="auth-form-container" style={{background: '#111827', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem'}}>
        <div className="auth-card" style={{width: '100%', maxWidth: '400px'}}>
          <h2 style={{fontSize: '2rem', marginBottom: '0.5rem', color: 'white', fontWeight: 600}}>Welcome back</h2>
          <p className="subtext" style={{color: '#9ca3af', marginBottom: '2rem'}}>Enter your credentials to access your workspace.</p>
          
          <div className="social-auth" style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
            <button className="social-btn" style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', color: 'white', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s'}}>
              <img src="https://www.google.com/favicon.ico" alt="Google" width="18" /> Google
            </button>
            <button className="social-btn" style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', color: 'white', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s'}}>
              <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" width="18" style={{filter: 'invert(1)'}} /> GitHub
            </button>
          </div>

          <div className="divider" style={{display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#6b7280', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase'}}>
             <div style={{flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)'}}></div>
             <span style={{margin: '0 1rem'}}>OR CONTINUE WITH EMAIL</span>
             <div style={{flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)'}}></div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group" style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600}}>Email Address</label>
              <div style={{position: 'relative'}}>
                <span style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280'}}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input type="email" placeholder="name@company.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'white', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box'}} />
              </div>
            </div>
            <div className="input-group" style={{marginBottom: '1.5rem'}}>
              <div className="label-row" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <label style={{color: '#9ca3af', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600}}>Password</label>
                <span className="forgot" style={{color: '#60a5fa', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500}}>Forgot Password?</span>
              </div>
              <div style={{position: 'relative'}}>
                 <span style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280'}}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 </span>
                 <input type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'white', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box'}} />
              </div>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem'}}>
               <input type="checkbox" id="remember" checked={formData.rememberMe} onChange={e => setFormData({...formData, rememberMe: e.target.checked})} style={{width: '16px', height: '16px', accentColor: '#3b82f6', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px'}} />
               <label htmlFor="remember" style={{color: '#9ca3af', fontSize: '0.9rem', cursor: 'pointer'}}>Remember this device for 30 days</label>
            </div>

            <button type="submit" className="btn-vibrant-blue full" style={{width: '100%', padding: '0.85rem', background: 'linear-gradient(to right, #60a5fa, #3b82f6)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', transition: 'opacity 0.2s', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)'}}>Sign In to Dashboard</button>
          </form>
          <p className="switch-text" style={{marginTop: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem'}}>
             Don't have an account? <span onClick={() => navigate('/register')} style={{color: 'white', fontWeight: 600, cursor: 'pointer', marginLeft: '0.25rem'}}>Create an account</span>
          </p>
        </div>
      </div>
    </div>
  );
}

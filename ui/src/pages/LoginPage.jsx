import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSparkles } from '../components/Icons';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    sessionStorage.removeItem('guestMode');
    sessionStorage.setItem('user_name', formData.email.split('@')[0]);
    navigate('/dashboard');
  };

  return (
    <div className="auth-page split-layout" style={{ display: 'flex', height: '100vh', background: '#06122B', color: 'white', overflow: 'hidden' }}>
      <div className="auth-visual" style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', background: '#080c14' }}>
        <div className="visual-content" style={{ position: 'relative', zIndex: 2 }}>
          <div className="logo-white" style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: 700, marginBottom: '2.5rem'}}>
            <div className="logo-icon-box" style={{background: '#3b82f6', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
               <IconSparkles />
            </div>
            IntelliNexus AI
          </div>
          <h1 style={{fontSize: '3rem', lineHeight: 1.1, marginBottom: '1.5rem', fontWeight: 800}}>
            Orchestrate <span style={{ color: '#60a5fa' }}>Intelligence</span> in Every Test Cycle.
          </h1>
          <p style={{fontSize: '1.1rem', color: '#94a3b8', maxWidth: '400px', lineHeight: 1.6}}>
            Automate manual QA workflows into high-fidelity test scenarios with our enterprise-grade AI engine.
          </p>

          <div className="insight-card-login glass" style={{marginTop: '4rem', padding: '1.5rem', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.05)', maxWidth: '450px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem'}}>
               <div style={{background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px', borderRadius: '8px'}}>
                  <IconSparkles />
               </div>
               <span style={{fontWeight: 600, color: 'white'}}>AI Insight</span>
            </div>
            <p style={{color: '#94a3b8', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.5}}>
              "Test coverage for Project Phoenix increased by 42% after deploying automated URL analysis."
            </p>
          </div>
        </div>
        <div className="mesh-gradient" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />
      </div>

      <div className="auth-form-container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: '#0b1322' }}>
        <div className="auth-card" style={{width: '100%', maxWidth: '400px'}}>
          <h2 style={{fontSize: '2rem', marginBottom: '0.5rem', color: 'white', fontWeight: 700}}>Welcome back</h2>
          <p style={{color: '#94a3b8', marginBottom: '2.5rem'}}>Enter your credentials to access your workspace.</p>
          
          <div className="social-auth" style={{display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              onClick={() => {
                const apiBase = window.location.origin === 'http://localhost:3000' ? 'http://localhost:8000' : '';
                window.location.href = `${apiBase}/api/v1/auth/login/google`;
              }}
              className="social-btn" 
              style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', color: 'white', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s'}}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" width="18" /> Google
            </button>
            <button className="social-btn" style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '8px', color: 'white', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s'}}>
              <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" width="18" style={{filter: 'invert(1)'}} /> GitHub
            </button>
          </div>

          <div className="divider" style={{display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#475569', fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700}}>
             <div style={{flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)'}}></div>
             <span style={{margin: '0 1rem'}}>OR CONTINUE WITH EMAIL</span>
             <div style={{flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)'}}></div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{marginBottom: '1.5rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', color: '#94a3b8', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600}}>Email Address</label>
              <div style={{position: 'relative'}}>
                <Mail size={18} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b'}} />
                <input type="email" placeholder="name@company.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'white', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'}} />
              </div>
            </div>
            <div style={{marginBottom: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                <label style={{color: '#94a3b8', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600}}>Password</label>
                <span style={{color: '#60a5fa', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600}}>Forgot Password?</span>
              </div>
              <div style={{position: 'relative'}}>
                 <Lock size={18} style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b'}} />
                 <input type={showPass ? 'text' : 'password'} placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: 'white', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'}} />
                 <button type="button" onClick={() => setShowPass(!showPass)} style={{position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer'}}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
              </div>
            </div>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem'}}>
               <input type="checkbox" id="remember" checked={formData.rememberMe} onChange={e => setFormData({...formData, rememberMe: e.target.checked})} style={{width: '16px', height: '16px', accentColor: '#3b82f6', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px'}} />
               <label htmlFor="remember" style={{color: '#94a3b8', fontSize: '0.9rem', cursor: 'pointer'}}>Remember this device for 30 days</label>
            </div>

            <button type="submit" style={{width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)', transition: 'transform 0.2s, opacity 0.2s'}}>Sign In to Dashboard</button>
          </form>
          <p style={{marginTop: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem'}}>
             Don't have an account? <span onClick={() => navigate('/register')} style={{color: 'white', fontWeight: 600, cursor: 'pointer', marginLeft: '0.25rem'}}>Create an account</span>
          </p>
        </div>
      </div>
    </div>
  );
}

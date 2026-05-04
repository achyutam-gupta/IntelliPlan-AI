import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSparkles } from '../components/Icons';
import { Eye, EyeOff, ShieldCheck, User, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirm = 'Passwords do not match.';
    }
    if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid work email.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    localStorage.setItem('user', JSON.stringify({ name: formData.name, email: formData.email }));
    sessionStorage.setItem('user_name', formData.name);
    toast.success('Account created successfully!');
    navigate('/dashboard');
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', 
    background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.05)', 
    borderRadius: '8px', color: 'white', outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
  };

  const labelStyle = { 
    display: 'block', marginBottom: '0.5rem', color: '#9ca3af', 
    fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 
  };

  return (
    <div className="auth-page split-layout" style={{ display: 'flex', height: '100vh', background: '#06122B', color: 'white', overflow: 'hidden' }}>
      {/* ── Left Visual Panel ── */}
      <div className="auth-visual" style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', background: '#080c14' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', fontWeight: 700, marginBottom: '3rem', color: 'white' }}>
            <div style={{ background: '#3b82f6', padding: '8px', borderRadius: '8px' }}>
              <IconSparkles />
            </div>
            IntelliNexus AI
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '500px' }}>
             Scale <span style={{ color: '#60a5fa' }}>Automated</span> Trust Across Your Lifecycle.
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '420px', lineHeight: 1.6 }}>
            Join the elite circle of testing engineers using agentic workflows to eliminate manual regression.
          </p>
          
          <div style={{ marginTop: '4rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ display: 'flex' }}>
                {[1,2,3,4].map(i => <div key={i} style={{ width:'32px', height:'32px', borderRadius:'50%', border:'2px solid #080c14', background:'#1e293b', marginLeft: i>1?'-12px':'0' }} />)}
             </div>
             <div style={{ fontSize:'0.85rem', color:'#64748b' }}>
                <span style={{ color:'white', fontWeight:600 }}>1,200+</span> teams registered this week
             </div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />
      </div>

      {/* ── Right Form Panel ── */}
      <div className="auth-form-container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: '#0b1322' }}>
        <div className="auth-card" style={{ width: '100%', maxWidth: '420px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2.5rem' }}>Start your journey with agentic quality assurance.</p>

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" placeholder="Alex Chen" required 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                  style={inputStyle} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="email" placeholder="alex@company.com" required 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                  style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : 'rgba(255,255,255,0.05)' }} 
                />
              </div>
              {errors.email && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '6px', fontWeight: 600 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Setup Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type={showPass ? 'text' : 'password'} placeholder="••••••••" required 
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                  style={{ ...inputStyle, borderColor: errors.password ? '#ef4444' : 'rgba(255,255,255,0.05)' }} 
                />
                <button 
                  type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '6px', fontWeight: 600 }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type={showConfirmPass ? 'text' : 'password'} placeholder="••••••••" required 
                  value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  style={{ ...inputStyle, borderColor: errors.confirm ? '#ef4444' : 'rgba(255,255,255,0.05)' }} 
                />
                <button 
                  type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirm && <p style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '6px', fontWeight: 600 }}>{errors.confirm}</p>}
            </div>

            <button 
              type="submit" 
              style={{ 
                width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)', 
                border: 'none', borderRadius: '8px', color: 'white', fontWeight: 700, fontSize: '1rem', 
                cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)', transition: 'transform 0.2s, opacity 0.2s'
              }}
              onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.target.style.transform = 'none'}
            >
              Initialize Workspace
            </button>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
            Already have an account? <span onClick={() => navigate('/login')} style={{ color: 'white', fontWeight: 600, cursor: 'pointer', marginLeft: '6px' }}>Sign in instead</span>
          </p>
        </div>
      </div>
    </div>
  );
}

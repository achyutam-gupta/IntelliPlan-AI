import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconSparkles } from '../components/Icons';

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({ name: formData.name, email: formData.email }));
    navigate('/login');
  };

  return (
    <div className="auth-page split-layout">
      <div className="auth-visual">
        <div className="visual-content">
          <div className="logo-white"><IconSparkles /> IntelliPlan AI</div>
          <h2>Accelerate Every <span className="text-gradient-vibrant">Test Cycle</span>.</h2>
          <p>The industry's first agentic platform for end-to-end quality assurance transformation.</p>
        </div>
        <div className="mesh-gradient"></div>
      </div>
      <div className="auth-form-container">
        <div className="auth-card glass-card fade-in">
          <h2>Create an account</h2>
          <p className="subtext">Join 5,000+ engineering teams shipping better code.</p>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" placeholder="Alex Chen" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Work Email</label>
              <input type="email" placeholder="alex@company.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" className="btn-vibrant full">Register Now</button>
          </form>
          <p className="switch-text">Already have an account? <span onClick={() => navigate('/login')}>Sign in</span></p>
        </div>
      </div>
    </div>
  );
}

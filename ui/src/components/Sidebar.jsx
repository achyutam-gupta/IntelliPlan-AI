import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconDashboard, IconAnalyze, IconStories, IconPlan, IconScenario, IconSearch, IconCode, IconCoverage, IconSettings, IconSparkles } from './Icons';

export default function Sidebar({ active }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (sessionStorage.getItem('guestMode') === 'true') {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: <IconDashboard />, label: 'Dashboard', path: '/dashboard' },
    { id: 'url-analyzer', icon: <IconAnalyze />, label: 'URLAnalyzer', path: '/url-analyzer' },
    { id: 'user-stories', icon: <IconStories />, label: 'User Stories', path: '/user-stories' },
    { id: 'test-plan', icon: <IconPlan />, label: 'Test Plan', path: '/test-plan' },
    { id: 'scenarios', icon: <IconScenario />, label: 'Test Scenarios', path: '/test-scenarios' },
    { id: 'test-cases', icon: <IconSearch />, label: 'Test Cases', path: '/test-cases' },
    { id: 'code-gen', icon: <IconCode />, label: 'Code Generation', path: '/code-gen' },
    { id: 'coverage', icon: <IconCoverage />, label: 'Coverage', path: '/coverage' },
    { id: 'settings', icon: <IconSettings />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="sidebar-modern">
      <div className="sidebar-header" style={{padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px'}}>
        <div className="logo-icon" style={{background: '#3b82f6', padding: '8px', borderRadius: '8px', color: 'white', display: 'flex'}}>
          <IconSparkles />
        </div>
        <div className="logo-text" style={{display: 'flex', flexDirection: 'column'}}>
          <span className="title" style={{color: 'white', fontWeight: 600, fontSize: '1.1rem'}}>IntelliPlan AI</span>
          <span className="sub" style={{color: '#6b7280', fontSize: '0.65rem', letterSpacing: '0.05em', fontWeight: 600}}>ENTERPRISE QA</span>
        </div>
      </div>
      <nav className="sidebar-nav" style={{flex: 1, padding: '0.5rem 1rem'}}>
        {menuItems.map(item => (
          <div key={item.id} className={`nav-item ${active === item.id ? 'active' : ''}`} onClick={() => handleNavigation(item.path)}>
            {item.icon} <span style={{marginLeft: '12px'}}>{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer" style={{padding: '1.5rem 1rem'}}>
        <div className="user-pill" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <img src="https://i.pravatar.cc/150?u=current_user" alt="User Profile" style={{width: '36px', height: '36px', borderRadius: '50%'}} />
            <div className="user-details" style={{display: 'flex', flexDirection: 'column'}}>
              <span className="name" style={{color: 'white', fontSize: '0.9rem', fontWeight: 500}}>
                {localStorage.getItem('user_name') || sessionStorage.getItem('user_name') || 'IntelliPlan Admin'}
              </span>
              <span className="role" style={{color: '#6b7280', fontSize: '0.75rem'}}>Lead QA Architect</span>
            </div>
          </div>
          <button 
            onClick={() => {
              sessionStorage.clear();
              localStorage.clear();
              navigate('/login');
            }} 
            style={{
              background: 'transparent', border: 'none', color: '#ef4444', 
              cursor: 'pointer', padding: '8px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            title="Logout"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

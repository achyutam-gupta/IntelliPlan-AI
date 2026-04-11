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
    // Removed Settings from this list as per prompt 'till settings page' but we will see
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
        <div className="user-pill" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <img src="https://i.pravatar.cc/150?u=alex" alt="Alex Chen" style={{width: '36px', height: '36px', borderRadius: '50%'}} />
          <div className="user-details" style={{display: 'flex', flexDirection: 'column'}}>
            <span className="name" style={{color: 'white', fontSize: '0.9rem', fontWeight: 500}}>Alex Chen</span>
            <span className="role" style={{color: '#6b7280', fontSize: '0.75rem'}}>Lead QA Architect</span>
          </div>
        </div>
      </div>
    </div>
  );
}

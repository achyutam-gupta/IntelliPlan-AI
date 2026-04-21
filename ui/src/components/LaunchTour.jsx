import React, { useState, useEffect } from 'react';
import { IconSparkles, IconAnalyze, IconStories, IconScenario, IconCoverage } from './Icons';

const TOUR_STEPS = [
  {
    title: "Welcome to IntelliNexus AI",
    desc: "Greetings, Analyst. You are now at the helm of an enterprise-grade neural QA pipeline. Let's briefly orient you to the mission parameters.",
    icon: <IconSparkles />,
    color: "#60a5fa"
  },
  {
    title: "Stage 1: Requirement Scoping",
    desc: "Every mission starts with data. Use the URL Analyzer or manual ingestion to feed the engine with your business requirements.",
    icon: <IconAnalyze />,
    color: "#3b82f6"
  },
  {
    title: "The 8-Stage Neural Pipeline",
    desc: "From AI-driven User Stories to Traceability and Code Generation, your workflow is now synchronized across the entire QA lifecycle.",
    icon: <IconScenario />,
    color: "#10b981"
  },
  {
    title: "Jira & LLM Orchestration",
    desc: "Your environment is fully coupled with your enterprise tools. Sync test cases and insights with Jira in real-time.",
    icon: <IconCoverage />,
    color: "#f59e0b"
  }
];

export default function LaunchTour({ onComplete }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasCompleted = localStorage.getItem('nexus_tour_completed');
    if (!hasCompleted) {
      setTimeout(() => setVisible(true), 1200);
    }
  }, []);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('nexus_nexus_tour_completed', 'true');
    if (onComplete) onComplete();
  };

  if (!visible) return null;

  const current = TOUR_STEPS[step];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.85)', backdropFilter:'blur(8px)' }}>
      <div style={{ width:'480px', background:'rgba(15,23,42,0.95)', border:`1px solid ${current.color}40`, borderRadius:'24px', padding:'2.5rem', position:'relative', boxShadow:`0 0 50px ${current.color}15`, transition:'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        
        {/* Progress Bar */}
        <div style={{ display:'flex', gap:'6px', marginBottom:'2rem' }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i} style={{ flex:1, height:'3px', borderRadius:'2px', background: i <= step ? current.color : 'rgba(255,255,255,0.05)', transition:'background 0.3s' }} />
          ))}
        </div>

        {/* Icon & Title */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'1.5rem' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'18px', background:`${current.color}15`, display:'flex', alignItems:'center', justifyContent:'center', color:current.color }}>
             {React.cloneElement(current.icon, { size: 32 })}
          </div>
          <div>
            <h2 style={{ fontSize:'1.75rem', fontWeight:800, margin:'0 0 12px', color:'white' }}>{current.title}</h2>
            <p style={{ fontSize:'0.95rem', color:'#94a3b8', lineHeight:1.6, margin:0 }}>{current.desc}</p>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginTop:'3rem', display:'flex', justifyContent:'center' }}>
          <button 
             onClick={handleNext}
             style={{ background:current.color, border:'none', color:'white', padding:'1rem 3rem', borderRadius:'12px', fontWeight:800, fontSize:'1rem', cursor:'pointer', boxShadow:`0 10px 25px ${current.color}30`, transition:'transform 0.2s' }}
             onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
             onMouseLeave={e => e.target.style.transform = 'none'}
          >
            {step === TOUR_STEPS.length - 1 ? 'Initiate Mission' : 'Analyze Next'}
          </button>
        </div>

        {/* Skip button logic */}
        <button onClick={handleClose} style={{ position:'absolute', top:'1.5rem', right:'1.5rem', background:'none', border:'none', color:'#475569', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.05em' }}>SKIP INTRO</button>
      </div>
    </div>
  );
}

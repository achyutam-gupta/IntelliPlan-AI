import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import {
  TerminalSquare, Box, Server, ShieldCheck, Activity, LineChart, Settings as GearIcon,
  ChevronDown, Eye, EyeOff, Copy, RefreshCw, CheckCircle2, XCircle, Search, Bell,
  Moon, Target, Plus, Download, HardDrive, Zap, Cpu
} from 'lucide-react';
import {
  testOllamaConnection, testGroqConnection, testOpenAIConnection, testJiraConnection, testNvidiaConnection
} from '../lib/llmHandshake';

const THEME = {
  bg: '#06122B',
  surface: '#0B1A35',
  card: 'rgba(255, 255, 255, 0.04)',
  cardHover: 'rgba(255, 255, 255, 0.06)',
  border: 'rgba(255, 255, 255, 0.08)',
  cyan: '#2ED8F6',
  glow: '#22E7FF',
  success: '#22C55E',
  error: '#EF4444',
  text: '#FFFFFF',
  textDim: 'rgba(255, 255, 255, 0.7)'
};

const PROVIDER_MODELS = {
  NVIDIA: ['mistralai/mistral-large-2411', 'mistralai/pixtral-12b-2409'],
  Groq: ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'],
  Ollama: ['llama3:latest', 'mistral:latest', 'gemma2:latest'],
  OpenAI: ['gpt-4o-latest', 'gpt-4o', 'gpt-4o-mini'],
};

// -- Custom Input Components
const Select = ({ value, onChange, options }) => (
  <div style={{ position: 'relative', width: '100%' }}>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', appearance: 'none', background: 'rgba(0,0,0,0.2)',
        border: `1px solid ${THEME.border}`, borderRadius: '8px',
        color: THEME.text, padding: '12px 16px', fontSize: '14px', outline: 'none',
        cursor: 'pointer', transition: 'border 0.2s', fontFamily: 'Inter, sans-serif'
      }}
      onFocus={e => e.target.style.borderColor = THEME.cyan}
      onBlur={e => e.target.style.borderColor = THEME.border}
    >
      {options.map(o => <option key={o} value={o} style={{ background: THEME.surface }}>{o}</option>)}
    </select>
    <ChevronDown size={16} color={THEME.textDim} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
  </div>
);

const SecureInput = ({ value, onChange, placeholder, isUrl = false }) => {
  const [show, setShow] = useState(isUrl);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', background: 'rgba(0,0,0,0.2)',
          border: `1px solid ${THEME.border}`, borderRadius: '8px',
          color: THEME.text, padding: '12px 16px', paddingRight: '40px', fontSize: '14px',
          outline: 'none', fontFamily: isUrl ? 'Inter, sans-serif' : 'monospace',
          transition: 'all 0.2s', boxSizing: 'border-box'
        }}
        onFocus={e => { e.target.style.borderColor = THEME.cyan; e.target.style.boxShadow = `0 0 12px rgba(46,216,246,0.15)`; }}
        onBlur={e => { e.target.style.borderColor = THEME.border; e.target.style.boxShadow = 'none'; }}
      />
      {!isUrl && (
        <button onClick={() => setShow(!show)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: THEME.textDim, display: 'flex' }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
};

// -- Main Page Component
export default function Settings() {
  const navigate = useNavigate();

  // Load state from local storage or defaults
  const [provider, setProvider] = useState(() => localStorage.getItem('llm_provider') || 'Ollama');
  const [model, setModel] = useState(() => localStorage.getItem('llm_model') || 'llama3:latest');
  const [ollamaUrl, setOllamaUrl] = useState(() => localStorage.getItem('llm_ollamaUrl') || 'http://localhost:11434');
  const [groqKey, setGroqKey] = useState(() => localStorage.getItem('llm_groqKey') || '');
  const [openAIKey, setOpenAIKey] = useState(() => localStorage.getItem('llm_openAIKey') || '');
  const [nvidiaKey, setNvidiaKey] = useState(() => localStorage.getItem('llm_nvidiaKey') || '');

  const [jiraUrl, setJiraUrl] = useState(() => localStorage.getItem('jira_url') || '');
  const [jiraEmail, setJiraEmail] = useState(() => localStorage.getItem('jira_email') || '');
  const [jiraToken, setJiraToken] = useState(() => localStorage.getItem('jira_token') || '');

  // Active statuses map
  const [statuses, setStatuses] = useState(() => JSON.parse(localStorage.getItem('provider_statuses') || '{}'));
  const [latency, setLatency] = useState(() => JSON.parse(localStorage.getItem('provider_latency') || '{}'));
  const [testing, setTesting] = useState({});

  useEffect(() => {
    // Effect to bind primary provider model
    if (!PROVIDER_MODELS[provider]?.includes(model)) {
      setModel(PROVIDER_MODELS[provider]?.[0] || 'llama3:latest');
    }
  }, [provider]);

  // AUTO-SAVE SESSION LOGIC
  useEffect(() => {
    localStorage.setItem('llm_provider', provider);
    localStorage.setItem('llm_model', model);
    localStorage.setItem('llm_ollamaUrl', ollamaUrl);
    localStorage.setItem('llm_groqKey', groqKey);
    localStorage.setItem('llm_openAIKey', openAIKey);
    localStorage.setItem('llm_nvidiaKey', nvidiaKey);
    
    localStorage.setItem('jira_url', jiraUrl);
    localStorage.setItem('jira_email', jiraEmail);
    localStorage.setItem('jira_token', jiraToken);
  }, [provider, model, ollamaUrl, groqKey, openAIKey, nvidiaKey, jiraUrl, jiraEmail, jiraToken]);

  const handleTest = async (provName) => {
    setTesting(p => ({ ...p, [provName]: true }));
    const start = Date.now();
    let res;

    const testModel = provider === provName ? model : PROVIDER_MODELS[provName]?.[0];

    if (provName === 'Ollama') res = await testOllamaConnection(ollamaUrl);
    else if (provName === 'Groq') res = await testGroqConnection(groqKey, testModel || 'openai/gpt-oss-120b');
    else if (provName === 'OpenAI') res = await testOpenAIConnection(openAIKey, testModel || 'gpt-3.5-turbo');
    else if (provName === 'NVIDIA') res = await testNvidiaConnection(nvidiaKey);
    else if (provName === 'Jira') res = await testJiraConnection(jiraUrl, jiraEmail, jiraToken);

    const ms = Date.now() - start;
    if (res?.ok) {
      setStatuses(p => {
        const newStatuses = { ...p, [provName]: 'ACTIVE' };
        localStorage.setItem('provider_statuses', JSON.stringify(newStatuses));
        return newStatuses;
      });
      setLatency(p => {
        const newLatency = { ...p, [provName]: `${ms}ms` };
        localStorage.setItem('provider_latency', JSON.stringify(newLatency));
        return newLatency;
      });
    } else {
      setStatuses(p => {
        const newStatuses = { ...p, [provName]: 'ERROR' };
        localStorage.setItem('provider_statuses', JSON.stringify(newStatuses));
        return newStatuses;
      });
      setLatency(p => {
        const newLatency = { ...p, [provName]: '--' };
        localStorage.setItem('provider_latency', JSON.stringify(newLatency));
        return newLatency;
      });
      toast.error(`${provName} Connection failed: ${res?.msg}`);
    }
    setTesting(p => ({ ...p, [provName]: false }));
  };

  const handleSaveAll = () => {
    localStorage.setItem('llm_provider', provider);
    localStorage.setItem('llm_model', model);
    localStorage.setItem('llm_ollamaUrl', ollamaUrl);
    localStorage.setItem('llm_groqKey', groqKey);
    localStorage.setItem('llm_openAIKey', openAIKey);

    localStorage.setItem('jira_url', jiraUrl);
    localStorage.setItem('jira_email', jiraEmail);
    localStorage.setItem('jira_token', jiraToken);

    toast.success('System configurations synchronized and saved effectively.', {
      style: { background: '#0B1A35', border: `1px solid ${THEME.cyan}`, color: '#fff' }
    });
  };

  const ProviderCard = ({ name, icon, isCloud, modelVal, setModelVal, modelsList, secretVal, setSecretVal, secretLabel, secretPlaceholder, isUrl = false }) => {
    const isAct = provider === name;
    const stat = statuses[name] || 'INACTIVE';
    const isTest = testing[name];

    return (
      <div style={{
        background: THEME.card, border: `1px solid ${isAct ? THEME.cyan : THEME.border}`,
        borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden',
        boxShadow: isAct ? `0 0 30px rgba(46,216,246,0.05)` : 'none', transition: 'all 0.3s'
      }}>
        {/* Glow if active primary provider */}
        {isAct && <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(46,216,246,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />}

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: THEME.text }}>
              {icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {name}
                {isAct && <span style={{ fontSize: '10px', background: 'rgba(46,216,246,0.15)', color: THEME.cyan, border: `1px solid rgba(46,216,246,0.3)`, padding: '2px 8px', borderRadius: '12px', letterSpacing: '0.05em' }}>PRIMARY</span>}
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: THEME.textDim }}>{isCloud ? 'Cloud Inference Pipeline' : 'Local Inference Engine'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', padding: '4px 10px', borderRadius: '6px',
              background: stat === 'ACTIVE' ? 'rgba(34,197,94,0.1)' : stat === 'ERROR' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
              color: stat === 'ACTIVE' ? THEME.success : stat === 'ERROR' ? THEME.error : THEME.textDim,
              border: `1px solid ${stat === 'ACTIVE' ? 'rgba(34,197,94,0.2)' : stat === 'ERROR' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}`
            }}>
              {stat}
            </span>
          </div>
        </div>

        {/* Body Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {modelsList && (
            <div onClick={() => setProvider(name)} style={{ cursor: 'pointer' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: THEME.textDim, letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>Model Selection</label>
              <Select value={isAct ? model : modelVal} onChange={setModelVal} options={modelsList} />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: THEME.textDim, letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>{secretLabel}</label>
            <SecureInput value={secretVal} onChange={setSecretVal} placeholder={secretPlaceholder} isUrl={isUrl} />
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '16px', borderTop: `1px solid ${THEME.border}` }}>
          <button
            onClick={() => handleTest(name)}
            disabled={isTest}
            style={{
              background: 'transparent', border: 'none', color: isTest ? THEME.textDim : THEME.cyan, fontSize: '13px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px', cursor: isTest ? 'not-allowed' : 'pointer', padding: 0
            }}
          >
            {isTest ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}
            {isTest ? 'TESTING...' : 'TEST CONNECTION'}
          </button>

          <div style={{ fontSize: '11px', color: THEME.textDim, fontWeight: 600, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
            LATENCY <span style={{ color: THEME.text, opacity: 0.9 }}>{latency[name] || '--'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080c14', color: THEME.text, fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>
      <Sidebar active="settings" />

      {/* ── Main Content Area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>

        <Header searchPlaceholder="Search settings..." />

        {/* Scrollable Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px', paddingBottom: '120px' }}>

          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Title Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Workspace Settings</h1>
                <p style={{ margin: 0, color: THEME.textDim, fontSize: '15px', maxWidth: '600px', lineHeight: 1.5 }}>
                  Manage your organizational profile, external system integrations, and security protocols to ensure seamless data orchestration across the enterprise.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: THEME.surface, border: `1px solid ${THEME.border}`, color: THEME.text, padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                  <Download size={16} /> Audit Trail
                </button>
              </div>
            </div>

            {/* Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>

              {/* NVIDIA Primary Card */}
              <ProviderCard 
                name="NVIDIA" 
                icon={<Cpu size={22} color={THEME.cyan} />} 
                isCloud={true}
                modelVal={model}
                setModelVal={setModel}
                modelsList={PROVIDER_MODELS.NVIDIA}
                secretVal={nvidiaKey}
                setSecretVal={setNvidiaKey}
                secretLabel="NVIDIA API KEY"
                secretPlaceholder="nvapi-..."
              />

              {/* Groq Failover Card */}
              <ProviderCard 
                name="Groq" 
                icon={<Zap size={22} color="#f59e0b" />} 
                isCloud={true}
                modelVal={model}
                setModelVal={setModel}
                modelsList={PROVIDER_MODELS.Groq}
                secretVal={groqKey}
                setSecretVal={setGroqKey}
                secretLabel="GROQ API KEY"
                secretPlaceholder="gsk_..."
              />

              {/* Ollama Local Card */}
              <ProviderCard 
                name="Ollama" 
                icon={<HardDrive size={22} color="#94a3b8" />} 
                isCloud={false}
                modelVal={model}
                setModelVal={setModel}
                modelsList={PROVIDER_MODELS.Ollama}
                secretVal={ollamaUrl}
                setSecretVal={setOllamaUrl}
                secretLabel="LOCAL ENDPOINT"
                secretPlaceholder="http://localhost:11434"
                isUrl={true}
              />

              {/* Jira Integration Card */}
              <div style={{
                background: THEME.card, border: `1px solid ${THEME.border}`,
                borderRadius: '16px', padding: '24px', position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                      <Server size={22} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Jira Enterprise</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: THEME.textDim }}>Requirements & Story Ingestion</p>
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    background: statuses['Jira'] === 'ACTIVE' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                    color: statuses['Jira'] === 'ACTIVE' ? THEME.success : THEME.textDim,
                    border: `1px solid ${statuses['Jira'] === 'ACTIVE' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)'}`
                  }}>
                    {statuses['Jira'] || 'OPTIONAL'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: THEME.textDim, marginBottom: '6px' }}>JIRA DOMAIN</label>
                    <SecureInput value={jiraUrl} onChange={setJiraUrl} placeholder="https://org.atlassian.net" isUrl={true} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: THEME.textDim, marginBottom: '6px' }}>ACCOUNT EMAIL</label>
                    <SecureInput value={jiraEmail} onChange={setJiraEmail} placeholder="qa@company.com" isUrl={true} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: THEME.textDim, marginBottom: '6px' }}>API TOKEN</label>
                    <SecureInput value={jiraToken} onChange={setJiraToken} placeholder="ATATT3x..." isUrl={false} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${THEME.border}` }}>
                  <button onClick={() => handleTest('Jira')} disabled={testing['Jira']} style={{ background: 'transparent', border: 'none', color: testing['Jira'] ? THEME.textDim : '#3b82f6', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', cursor: testing['Jira'] ? 'not-allowed' : 'pointer', padding: 0 }}>
                    {testing['Jira'] ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}
                    VERIFY CONNECTIVITY
                  </button>
                  <div style={{ fontSize: '11px', color: THEME.textDim, fontWeight: 600, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    LATENCY <span style={{ color: THEME.text }}>{latency['Jira'] || '--'}</span>
                  </div>
                </div>
              </div>

               {/* ADO Placeholder Integration */}
               <div style={{
                background: THEME.card, border: `1px solid ${THEME.border}`, opacity: 0.6,
                borderRadius: '16px', padding: '24px', position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${THEME.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                      <Box size={22} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Azure DevOps</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: THEME.textDim }}>Microsoft Ecosystem Bridge</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' }}>COMING SOON</span>
                </div>
                <p className="text-xs text-muted-foreground italic">Integration with Azure Boards and Pipeline telemetry is scheduled for Q3 deployment.</p>
              </div>

            </div>
          </div>
        </div>

        {/* Global Action Bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 40px',
          background: 'rgba(6,18,43,0.85)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${THEME.border}`,
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px'
        }}>
          <div style={{ fontSize: '13px', color: THEME.textDim, marginRight: 'auto' }}>
            Unsaved changes to infrastructure configuration detected.
          </div>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: THEME.text, padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.05)'}>
            Reset Default
          </button>
          <button onClick={handleSaveAll} style={{ background: `linear-gradient(135deg, ${THEME.cyan}, #0066FF)`, border: 'none', color: '#fff', padding: '12px 32px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 24px rgba(46,216,246,0.4)', transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.transform = 'scale(1.02)'} onMouseLeave={e => e.target.style.transform = 'none'}>
            SAVE ENVIRONMENT
          </button>
        </div>

      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

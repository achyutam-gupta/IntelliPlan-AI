import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import URLAnalyzer from './pages/URLAnalyzer';
import UserStories from './pages/UserStories';
import TestPlan from './pages/TestPlan';
import TestScenarios from './pages/TestScenarios';
import TestCases from './pages/TestCases';
import CodeGen from './pages/CodeGen';
import Coverage from './pages/Coverage';
import Settings from './pages/Settings';

import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/url-analyzer" element={<URLAnalyzer />} />
        <Route path="/user-stories" element={<UserStories />} />
        <Route path="/test-plan" element={<TestPlan />} />
        <Route path="/test-scenarios" element={<TestScenarios />} />
        <Route path="/test-cases" element={<TestCases />} />
        <Route path="/code-gen" element={<CodeGen />} />
        <Route path="/coverage" element={<Coverage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/test-case-generator" element={<Navigate to="/test-cases" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

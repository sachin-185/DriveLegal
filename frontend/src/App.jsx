import React, { useState, useEffect } from 'react';
import { Calculator, BookOpen, ShieldAlert, Globe, User, X, Bot, MessageCircle, Maximize2, Minimize2, Menu, FileCheck2 } from 'lucide-react';
import ChatbotTab from './components/ChatbotTab';
import CalculatorTab from './components/CalculatorTab';
import ExplorerTab from './components/ExplorerTab';
import EmergencyTab from './components/EmergencyTab';
import DisputeTab from './components/DisputeTab';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { lawDatabase } from './data/lawDatabase';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('drivelegal_active_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState('calculator');
  const [authScreen, setAuthScreen] = useState('login');
  const [location, setLocation] = useState({ country: 'IN', state: 'TN' });
  const [offlineStatus, setOfflineStatus] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMaximized, setIsChatMaximized] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setLocation({ country: 'IN', state: 'TN' });
    setActiveTab('calculator');
  };

  const handleLogout = () => {
    localStorage.removeItem('drivelegal_active_user');
    setCurrentUser(null);
    setAuthScreen('login');
    setActiveTab('calculator');
    setIsChatOpen(false);
  };

  useEffect(() => {
    const handleOnline = () => setOfflineStatus(true);
    const handleOffline = () => setOfflineStatus(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLocationChange = (newLoc) => {
    setLocation(newLoc);
  };

  const activeCountryData = lawDatabase.countries[location.country] || lawDatabase.countries.IN;
  const states = activeCountryData.states || {};

  const getPageTitle = () => {
    switch (activeTab) {
      case 'calculator': return 'Statutory Challan Calculator';
      case 'dispute': return 'Instant AI Challan Dispute & Proof Verification';
      case 'explorer': return 'Highway Law Explorer';
      case 'emergency': return 'Emergency Assistance Center';
      case 'profile': return 'Driver Identity Dashboard';
      default: return 'DriveLegal Hub';
    }
  };

  if (!currentUser) {
    return (
      <div className="auth-gateway-immersive">
        <div className="auth-backdrop-decoration">
          <div className="auth-orb indigo"></div>
          <div className="auth-orb cyan"></div>
        </div>
        <div className="auth-card-wrapper">
          <div className="auth-branding-header">
            <div className="brand-logo-glow large">
              <svg viewBox="0 0 100 100" style={{ width: '32px', height: '32px', fill: 'none' }}>
                <path d="M50 5 C50 5 82 17 82 45 C82 67 50 85 50 85 C50 85 18 67 18 45 C18 17 50 5 50 5 Z"
                  stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
                <line x1="33" y1="68" x2="47" y2="42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                <line x1="67" y1="68" x2="53" y2="42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                <line x1="50" y1="68" x2="50" y2="44" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" strokeLinecap="round" />
                <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <line x1="50" y1="20" x2="50" y2="62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M22 46 H38 C38 46 37 50 30 50 C23 50 22 46 22 46 Z" fill="currentColor" />
                <line x1="30" y1="30" x2="22" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <line x1="30" y1="30" x2="38" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <path d="M62 46 H78 C78 46 77 50 70 50 C63 50 62 46 62 46 Z" fill="currentColor" />
                <line x1="70" y1="30" x2="62" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <line x1="70" y1="30" x2="78" y2="46" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '12px' }}>DriveLegal AI</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
              Your Secure, Anti-Hallucination Road Compliance Companion
            </p>
          </div>
          <div className="auth-component-fade" style={{ width: '100%' }}>
            {authScreen === 'login' ? (
              <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setAuthScreen('register')} />
            ) : (
              <Register onRegisterSuccess={handleLoginSuccess} onNavigateToLogin={() => setAuthScreen('login')} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="dashboard-backdrop-decoration">
        <div className="dashboard-orb violet"></div>
        <div className="dashboard-orb pink"></div>
      </div>

      {isMobileNavOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setIsMobileNavOpen(false)} />
      )}

      <aside className={`sidebar ${isMobileNavOpen ? 'mobile-open' : ''}`}>
        <div>
          <div className="brand-section">
            <div className="brand-logo-glow">
              <svg viewBox="0 0 100 100" style={{ width: '22px', height: '22px', fill: 'none' }}>
                <path d="M50 5 C50 5 82 17 82 45 C82 67 50 85 50 85 C50 85 18 67 18 45 C18 17 50 5 50 5 Z"
                  stroke="currentColor" strokeWidth="6" strokeLinejoin="round" />
                <line x1="33" y1="68" x2="47" y2="42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                <line x1="67" y1="68" x2="53" y2="42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                <line x1="50" y1="68" x2="50" y2="44" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" strokeLinecap="round" />
                <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <line x1="50" y1="20" x2="50" y2="62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M22 46 H38 C38 46 37 50 30 50 C23 50 22 46 22 46 Z" fill="currentColor" />
                <line x1="30" y1="30" x2="22" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <line x1="30" y1="30" x2="38" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <path d="M62 46 H78 C78 46 77 50 70 50 C63 50 62 46 62 46 Z" fill="currentColor" />
                <line x1="70" y1="30" x2="62" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <line x1="70" y1="30" x2="78" y2="46" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <h1 className="brand-name">DriveLegal</h1>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                AI Road Safety Hub
              </span>
            </div>
            <button className="mobile-close-sidebar-btn" onClick={() => setIsMobileNavOpen(false)} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          <nav className="navigation-links">
            <div className={`nav-item ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => { setActiveTab('calculator'); setIsMobileNavOpen(false); }}>
              <Calculator size={18} />
              <span>Challan Calculator</span>
            </div>

            <div className={`nav-item ${activeTab === 'dispute' ? 'active' : ''}`}
              onClick={() => { setActiveTab('dispute'); setIsMobileNavOpen(false); }}>
              <FileCheck2 size={18} />
              <span>AI Challan Dispute</span>
            </div>

            <div className={`nav-item ${activeTab === 'explorer' ? 'active' : ''}`}
              onClick={() => { setActiveTab('explorer'); setIsMobileNavOpen(false); }}>
              <BookOpen size={18} />
              <span>Law Explorer</span>
            </div>

            <div className={`nav-item ${activeTab === 'emergency' ? 'active' : ''}`}
              onClick={() => { setActiveTab('emergency'); setIsMobileNavOpen(false); }}>
              <ShieldAlert size={18} />
              <span>Emergency Services</span>
            </div>

            <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setIsMobileNavOpen(false); }}>
              <User size={18} />
              <span>Driver Profile</span>
            </div>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="location-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="location-title">ACTIVE JURISDICTION</span>
              <Globe size={12} style={{ color: 'var(--color-secondary)' }} />
            </div>
            <select className="location-selector" value="IN" disabled style={{ opacity: 0.95, cursor: 'default' }}>
              <option value="IN">India (Motor Vehicles Act)</option>
            </select>
            <select className="location-selector" value="TN" onChange={(e) => setLocation({ country: 'IN', state: e.target.value })}
              style={{ marginTop: '6px' }}>
              <option value="TN">Tamil Nadu</option>
            </select>
          </div>

          {currentUser && (
            <div className="location-card" style={{ marginTop: '8px', border: '1px solid rgba(139, 92, 246, 0.25)', display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', cursor: 'pointer' }} onClick={() => { setActiveTab('profile'); setIsMobileNavOpen(false); }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>
                {currentUser.fullName ? currentUser.fullName.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.fullName}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--color-success)', fontWeight: '600' }}>
                  SECURE IDENTITY
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-menu-btn" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)} aria-label="Toggle Navigation">
              {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="top-bar-title">
              <h1 className="gradient-text">{getPageTitle()}</h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div className={`offline-badge ${offlineStatus ? '' : 'disconnected'}`}>
              <div className="offline-dot"></div>
              <span>{offlineStatus ? 'Offline Resilient PWA' : 'Low Connection Mode'}</span>
            </div>
          </div>
        </header>

        <section className="tab-content-area">
          {activeTab === 'calculator' && (
            <CalculatorTab defaultLocation={location} onLocationChange={handleLocationChange} />
          )}
          {activeTab === 'dispute' && (
            <DisputeTab defaultLocation={location} />
          )}
          {activeTab === 'explorer' && (
            <ExplorerTab defaultLocation={location} />
          )}
          {activeTab === 'emergency' && (
            <EmergencyTab defaultLocation={location} />
          )}
          {activeTab === 'profile' && currentUser && (
            <Profile user={currentUser} onLogout={handleLogout} />
          )}
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button className={`mobile-nav-tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}>
          <Calculator size={18} />
          <span>Calculator</span>
        </button>
        <button className={`mobile-nav-tab ${activeTab === 'dispute' ? 'active' : ''}`}
          onClick={() => setActiveTab('dispute')}>
          <FileCheck2 size={18} />
          <span>Dispute</span>
        </button>
        <button className={`mobile-nav-tab ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}>
          <BookOpen size={18} />
          <span>Laws</span>
        </button>
        <button className={`mobile-nav-tab ${activeTab === 'emergency' ? 'active' : ''}`}
          onClick={() => setActiveTab('emergency')}>
          <ShieldAlert size={18} />
          <span>Emergency</span>
        </button>
        <button className={`mobile-nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}>
          <User size={18} />
          <span>Profile</span>
        </button>
      </nav>

      {isChatOpen && (
        <div className={`floating-ai-widget ${isChatMaximized ? 'maximized' : ''}`} role="dialog" aria-label="DriveLegal AI Assistant">
          <div className="floating-ai-header">
            <div className="floating-ai-header-info">
              <div className="brand-logo-glow mini">
                <Bot size={16} />
              </div>
              <div>
                <span className="floating-ai-title">DriveLegal AI Copilot</span>
                <span className="floating-ai-status">Semantic Legal Grounding</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button className="floating-ai-action-btn"
                onClick={() => setIsChatMaximized(!isChatMaximized)}
                title={isChatMaximized ? "Restore size" : "Maximize view"} aria-label="Toggle full view">
                {isChatMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button className="floating-ai-action-btn close" onClick={() => { setIsChatOpen(false); setIsChatMaximized(false); }} title="Close Assistant" aria-label="Close Assistant">
                <X size={17} />
              </button>
            </div>
          </div>
          <div className="floating-ai-body">
            <ChatbotTab defaultLocation={location} isFloating={true} onClose={() => setIsChatOpen(false)} />
          </div>

          {!isChatMaximized && (
            <div className="floating-ai-resize-grip" title="Drag corner to resize">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="rgba(204, 255, 0, 0.6)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
      )}

      {!isChatOpen && (
        <button className="floating-ai-trigger" onClick={() => setIsChatOpen(true)}
          title="Open DriveLegal AI Assistant" aria-label="AI Assistant">
          <MessageCircle size={28} strokeWidth={2.2} fill="#0b0f19" color="#0b0f19" />
          <span className="floating-ai-trigger-badge"></span>
        </button>
      )}
    </div>
  );
}
